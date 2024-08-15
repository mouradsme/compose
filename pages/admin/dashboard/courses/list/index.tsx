import Courses from '@/components/containers/admin/courses/list';
import { fetchCourses } from '@/lib/courses';
import { GetServerSideProps } from 'next';
import { Course, UserSessionData } from '@/common/types/common';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { ReactElement } from 'react';
import AdminLayout from '@/components/layouts/admin';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;

  const res = await fetchCourses(0, user.accessToken);
  const courses = res.data.items;
  const pages = res.data.totalRecords;

  return {
    props: {
      courses,
      pages,
      ...(await serverSideTranslations(locale as string, ['common', 'courses'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  courses: Course[];
  pages: number;
}

const Page = ({ courses, pages }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Courses List </title>
      </Head>
      <Courses courses={courses} pages={pages} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
