import { ReactElement, useEffect, useState } from 'react';
import Details from '@/components/containers/courses/details';
import { GetServerSideProps } from 'next';
import { Course, Instructor, UserSessionData } from '@/common/types/common';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { fetchCourseServer, getEnrolledCourses, getProgressCourse } from '@/lib/courses';
import { getCourseInstructorsServer } from '@/lib/instructors';
import StudentLayout from '@/components/layouts/student';
import Loading from '@/components/common/elements/loading';
import EnrolledCourse from '@/components/containers/courses/enrolled';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const { id } = query;
  const course = await fetchCourseServer(id as string, user.accessToken);
  const instructors = await getCourseInstructorsServer(id as string, user.accessToken);
  return {
    props: {
      course: course.data,
      instructor: instructors?.data?.items?.[0] || null,
      ...(await serverSideTranslations(locale as string, ['common', 'courses'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  course: Course;
  instructor: Instructor;
}

const Page = ({ course, instructor }: PageProps) => {
  const [courses, setCourse] = useState<Course | undefined>(undefined);
  const [completedElements, setCompletedElements] = useState<string[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEnrolledCourses().then(async (res) => {
      const courses = res.data.items;
      const _course = courses.find((item: Course) => item.id === course.id);
      let completedElements = undefined;
      try {
        const progressRes = await getProgressCourse(course.id);
        completedElements = progressRes.data.completedElementsIds;
      } catch (e) {
        console.log(e);
      }
      setCompletedElements(completedElements);
      setCourse(_course);
      setLoading(false);
    });
  }, [course]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && courses && completedElements) {
    return (
      <>
        <Head>
          <title>Siine - Enrolled Course {course.title}</title>
        </Head>
        <EnrolledCourse course={course} completedElements={completedElements} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Siine - Course {course.title}</title>
      </Head>
      <Details course={course} instructor={instructor} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
