import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Student, UserSessionData } from '@/common/types/common';
import Students from '@/components/containers/admin/students/list';
import AdminLayout from '@/components/layouts/admin';
import { getStudentsServer } from '@/lib/students';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const resStudents = await getStudentsServer(user.accessToken, 0);
  const students = resStudents.data?.items;
  const totalRecords = resStudents.data.totalRecords;
  return {
    props: {
      students,
      totalRecords,
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'students'],
        nextI18NextConfig
      )),
    },
  };
};

interface PageProps {
  students: Student[];
  totalRecords: number;
}

const Page = ({ students, totalRecords }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Students </title>
      </Head>
      <Students students={students} totalRecords={totalRecords} />;
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
