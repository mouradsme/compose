import Profile from '@/components/containers/student/profile';
import { ReactElement } from 'react';
import StudentLayout from '@/components/layouts/student';
import { GetServerSideProps } from 'next';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Course, Student, UserSessionData } from '@/common/types/common';
import { getEnrolledCoursesServer } from '@/lib/courses';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const student = { email: user.email, phoneNumber: user.phoneNumber, fullName: user.fullName }; // TODO: to be replaced with a request to the server to fetch the current user details
  const coursesRes = await getEnrolledCoursesServer(user.accessToken);
  const courses = coursesRes.data?.items;
  return {
    props: {
      student,
      courses,
      ...(await serverSideTranslations(locale as string, ['common', 'profile'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  student: Student;
  courses: Course[];
}

const Page = ({ student, courses }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Profile {student.fullName} </title>
      </Head>
      <Profile student={student} courses={courses} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
