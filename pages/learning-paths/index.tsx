import { fetchCourses } from '@/lib/courses';
import { Course } from '@/common/types/common';
import Courses from '@/components/containers/courses/list';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const resp = await fetchCourses(0, '');
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
        <title>Siine - Courses & Learning Paths</title>
      </Head>
      <Courses courses={courses} totalRecords={totalRecords} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
