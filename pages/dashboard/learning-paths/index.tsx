import { fetchCourses } from '@/lib/courses';
import { Course, UserSessionData } from '@/common/types/common';
import Courses from '@/components/containers/courses/list';
import { ReactElement } from 'react';
import StudentLayout from '@/components/layouts/student';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next/types';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const resp = await fetchCourses(0, user.accessToken);
  const courses = resp.data.items;
  const totalRecords = resp.data.totalRecords;
  return {
    props: {
      courses,
      totalRecords,
      ...(await serverSideTranslations(locale as string, ['common', 'courses'], nextI18NextConfig)),
    },
  };
};

interface LearningPathsProps {
  courses: Course[];
  totalRecords: number;
}

const Page = ({ courses, totalRecords }: LearningPathsProps) => {
  return (
    <>
      <Head>
        <title>Siine - Student Courses & Learning Paths</title>
      </Head>
      <Courses courses={courses} totalRecords={totalRecords} isPublic={false} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
