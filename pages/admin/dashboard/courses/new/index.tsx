import NewCourse from '@/components/containers/admin/courses/details';
import { Instructor, UserSessionData } from '@/common/types/common';
import { fetchInstructorsServer } from '@/lib/instructors';
import { GetServerSideProps } from 'next';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { ReactElement } from 'react';
import AdminLayout from '@/components/layouts/admin';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;

  const res = await fetchInstructorsServer(user.accessToken);
  const instructors = res.data.items;
  return {
    props: {
      instructors,
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'courses', 'quizzes'],
        nextI18NextConfig
      )),
    },
  };
};

interface PageProps {
  instructors: Instructor[];
}

const Page = ({ instructors }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Add New Course </title>
      </Head>
      <NewCourse instructors={instructors} />;
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
