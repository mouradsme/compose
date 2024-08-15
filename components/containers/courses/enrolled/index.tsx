import { BACKEND_URL } from '@/common/config';
import { Course, Lesson, Section, Element } from '@/common/types/common';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';
import { useState } from 'react';
import Sections from '../details/components/sections';
import Card from '@/components/containers/courses/details/components/card';
import CaseIcon from '@/public/images/Path 12043.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface EnrolledCourseProps {
  course: Course;
  completedElements: string[];
}

const EnrolledCourse = ({ course, completedElements }: EnrolledCourseProps) => {
  const { t } = useTranslation('courses');
  const [selectedSection, setSelectedSection] = useState<undefined | Section>(undefined);

  const { data: sections } = useRequest({
    url: `${BACKEND_URL}/${URLS.courses.list}/${course.id}/${URLS.sections.list}`,
  });

  const { data: lessons } = useRequest({
    url: selectedSection
      ? `${BACKEND_URL}/${URLS.sections.list}/${selectedSection.id}/${URLS.lessons.detailed}`
      : undefined,
  });

  const onSectionChange = (section: Section) => {
    setSelectedSection(section);
  };

  return (
    <>
      <div className="flex flex-row gap-3 pt-5">
        <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('courseElements')}</p>
      </div>
      <div className="flex flex-col justify-center w-full gap-8 mt-8">
        {sections?.items?.length > 0 && (
          <Sections sections={sections?.items} onSectionChange={onSectionChange} />
        )}
        <div className="grid grid-cols-1 md:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-2">
          {lessons && lessons?.items?.length > 0 && selectedSection && (
            <>
              {lessons.items.map((lesson: Lesson) => (
                <>
                  {lesson.elements && lesson.elements?.length > 0 && (
                    <>
                      {lesson.elements.map((element: Element) => (
                        <Link
                          key={element.id}
                          className="mb-4"
                          href={`/lessons/${lesson.id}?course=${course.id}&section=${selectedSection.id}`}
                        >
                          <Card
                            element={element}
                            completed={completedElements.includes(element.id)}
                          />
                        </Link>
                      ))}
                    </>
                  )}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EnrolledCourse;
