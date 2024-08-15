import Details from '@/components/containers/courses/details';
import { GetServerSideProps } from 'next';
import { Course, Instructor, UserSessionData } from '@/common/types/common';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { fetchCourseServer } from '@/lib/courses';
import { getCourseInstructorsServer } from '@/lib/instructors';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const isStudent = user?.authorities?.includes('ROLE_STUDENT');
  if (isStudent) {
    return {
      redirect: {
        destination: '/dashboard/learning-paths',
        permanent: false,
      },
    };
  }
  const { id } = query;
  const course = await fetchCourseServer(id as string, user.accessToken);
  const instructors = await getCourseInstructorsServer(id as string, user.accessToken);
  return {
    props: {
      course: course.data,
      instructor: instructors?.data?.items?.[0] || {},
      ...(await serverSideTranslations(locale as string, ['common', 'courses'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  course: Course;
  instructor: Instructor;
}

const Page = ({ course, instructor }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Courses {course.title} </title>
      </Head>
      <Details course={course} instructor={instructor} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
