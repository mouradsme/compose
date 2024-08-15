import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Student, Supervisor, UserSessionData } from '@/common/types/common';
import Profile from '@/components/containers/admin/students/profile';
import AdminLayout from '@/components/layouts/admin';
import { getStudentServer } from '@/lib/students';
import { getStudentSupervisorsServer } from '@/lib/supevisors';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const { id } = query;
  const resStudents = await getStudentServer(id as string, user.accessToken);
  let supervisors = [];
  try {
    const resSupervisors = await getStudentSupervisorsServer(id as string, user.accessToken);
    supervisors = resSupervisors?.data?.items;
  } catch (err: any) {
    console.log(err.message);
  }

  const student = resStudents.data;

  return {
    props: {
      student,
      supervisors,
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'students'],
        nextI18NextConfig
      )),
    },
  };
};

interface PageProps {
  student: Student;
  supervisors: Supervisor[];
}

const Page = ({ student, supervisors }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Student {student.id} </title>
      </Head>
      <Profile student={student} supervisors={supervisors} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
