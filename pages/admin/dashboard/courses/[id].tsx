import UpdateCourse from '@/components/containers/admin/courses/details';
import { fetchInstructorsServer } from '@/lib/instructors';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { GetServerSideProps } from 'next';
import { Course, Instructor, UserSessionData } from '@/common/types/common';
import { fetchCourseServer } from '@/lib/courses';
import AdminLayout from '@/components/layouts/admin';
import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const id = query.id as string;

  const instructorRes = await fetchInstructorsServer(user.accessToken);
  const courseRes = await fetchCourseServer(id, user.accessToken);
  const instructors = instructorRes.data.items;
  const course = courseRes.data;

  return {
    props: {
      instructors,
      course,
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
  course: Course;
}

const Page = ({ instructors, course }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Update Course {course.title} </title>
      </Head>
      <UpdateCourse instructors={instructors} course={course} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
