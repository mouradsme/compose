import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Course, UserSessionData, Quiz } from '@/common/types/common';
import StartQuizz from '@/components/containers/student/quizzes/start';
import DefaultLayout from '@/components/layouts/default';
import { fetchCourseServer } from '@/lib/courses';
import { getQuizzesServer } from '@/lib/quizzes';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const { id } = query;
  const quizzRes = await getQuizzesServer(id as string, 'courseId', user.accessToken);
  const courseRes = await fetchCourseServer(id as string, user.accessToken);
  const course = courseRes.data;
  const quizzes = quizzRes.data.items;
  let quiz = undefined;
  if (quizzes.length > 1) {
    const randomIndex = Math.floor(Math.random() * quizzes.length);
    quiz = quizzes[randomIndex];
  } else if (quizzes.length === 1) {
    quiz = quizzes[0];
  }
  return {
    props: {
      quiz: quiz ?? null,
      course,
      ...(await serverSideTranslations(locale as string, ['common', 'quizzes'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  quiz: Quiz;
  course: Course;
}

const Page = ({ quiz, course }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Course Quiz {course.title} </title>
      </Head>
      <StartQuizz quiz={quiz} course={course} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
