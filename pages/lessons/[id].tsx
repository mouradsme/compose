import Lesson from '@/components/containers/student/lessons';
import {
  Instructor,
  Lesson as LessonType,
  SubscriptionStatus,
  UserSessionData,
} from '@/common/types/common';
import { GetServerSideProps } from 'next';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { fetchLessonServer } from '@/lib/lessons';
import { getCourseInstructorsServer } from '@/lib/instructors';
import { ReactElement } from 'react';
import StudentLayout from '@/components/layouts/student';
import { getStudentSubscribtionsServer } from '@/lib/subscribtions';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const { id, course } = query;
  const lesson = await fetchLessonServer(id as string, user.accessToken);
  const instructors = await getCourseInstructorsServer(course as string, user.accessToken);
  const subscriptionsRes = await getStudentSubscribtionsServer(
    user.accessToken,
    0,
    1,
    SubscriptionStatus.APPROVED
  );
  const isSubscribed = subscriptionsRes.data.items?.length === 1;
  return {
    props: {
      lesson: lesson.data,
      instructor: instructors.data.items?.[0] || null,
      isSubscribed,
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'lessons', 'quizzes'],
        nextI18NextConfig
      )),
    },
  };
};

interface PageProps {
  lesson: LessonType;
  instructor: Instructor;
  isSubscribed: boolean;
}

const Page = ({ lesson, instructor, isSubscribed }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Lessons {lesson.title}</title>
      </Head>
      <div className="flex flex-col-reverse w-full lg:flex-row ">
        <Lesson lesson={lesson} instructor={instructor} isSubscribed={isSubscribed} />
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
