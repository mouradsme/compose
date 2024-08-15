import List from '@/components/containers/student/lessons/components/list';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import education_svg from '@/public/images/education.svg';
import { Element, Instructor, Lesson as LessonType, Quiz, Section } from '@/common/types/common';
import { completedElement, getElements } from '@/lib/elements';
import { getQuizzes } from '@/lib/quizzes';
import VideoElement from '@/components/common/elements/videoFrame';
import Quizz from '@/components/containers/student/quizzes';
import { getLessons } from '@/lib/lessons';
import { useRouter } from 'next/router';
import Loading from '@/components/common/elements/loading';
import { getSections } from '@/lib/sections';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';
import { AxiosError } from 'axios';

interface LessonProps {
  lesson: LessonType;
  instructor: Instructor;
  isSubscribed: boolean;
}

const Lesson = ({ lesson, instructor, isSubscribed }: LessonProps) => {
  const { t } = useTranslation('lessons');
  const { showMessage } = useMessage();
  const router = useRouter();
  const { course: courseId, section: sectionId } = router.query as {
    course: string;
    section: string;
  };
  const [elements, setElements] = useState<(Element & Quiz)[]>([]);
  const [activeElement, setActiveElement] = useState<(Element & Quiz) | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getElements(lesson.id).then(async (data) => {
      if (data.status === 200) {
        const items = (
          await Promise.all(
            data.data.items.map(async (item: Element) => {
              if (isSubscribed) {
                const res = await getQuizzes(item.id, 'elementId');
                return [item, ...res.data.items];
              } else {
                return [item];
              }
            })
          )
        ).flat();
        setElements(items);
        setActiveElement(items[0]);
      }
      setIsLoading(false);
    });
  }, [isSubscribed, lesson]);

  const onElementClick = (element: Element & Quiz) => {
    setActiveElement(element);
  };

  const handleCompleteVideo = async (element?: Element) => {
    if (element) {
      try {
        setIsLoading(true);
        await completedElement(element.id);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data.errors[0].message;
          showMessage(message, 'error');
          return;
        }
      }
    }
    if (!activeElement) {
      return;
    }
    const nextActiveElementIndex = elements.indexOf(activeElement) + 1;
    const nextActiveElement = elements[nextActiveElementIndex];
    if (!nextActiveElement) {
      onLessonFinished();
    }
    setActiveElement(nextActiveElement);
  };

  const onQuizzAnswered = () => {
    handleCompleteVideo();
  };

  const onLessonFinished = async () => {
    setIsLoading(true);
    const lessonsRes = await getLessons(sectionId);
    const lessons = lessonsRes.data?.items as LessonType[];
    const currentLessonIndex = lessons.findIndex((l) => l.id === lesson.id);

    if (currentLessonIndex < 0) {
      return;
    }

    const nextLessonIndex = currentLessonIndex + 1;
    const nextLesson = lessons[nextLessonIndex];

    if (nextLesson) {
      showMessage(
        t('completedLesson', {
          lessonTitle: lesson.title,
          nextLessonTitle: nextLesson.title,
        }) as string,
        'success'
      );
      setTimeout(() => {
        router.push(`/lessons/${nextLesson.id}?course=${courseId}&section=${sectionId}`);
        setIsLoading(false);
      }, 2000);
      return;
    } else {
      const sectionsRes = await getSections(courseId);
      const sections = sectionsRes.data?.items as Section[];
      const currentSectionIndex = sections.findIndex((s) => s.id === sectionId);

      if (currentSectionIndex < 0) {
        return;
      }

      const nextSectionIndex = currentSectionIndex + 1;
      const nextSection = sections[nextSectionIndex];
      if (nextSection) {
        const lessonsRes = await getLessons(nextSection.id);
        const lessons = lessonsRes.data?.items as LessonType[];
        const nextLesson = lessons[0];

        if (nextLesson) {
          showMessage(
            t('completedLesson', {
              lessonTitle: lesson.title,
              nextLessonTitle: nextLesson.title,
            }) as string,
            'success'
          );
          setTimeout(() => {
            router.push(`/lessons/${nextLesson.id}?course=${courseId}&section=${sectionId}`);
            setIsLoading(false);
          }, 2000);
          return;
        }
      } else {
        showMessage(t('completedCourse') as string, 'success');
        setTimeout(() => {
          router.push('/dashboard/learning-paths');
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className={'flex flex-col w-full border-r px-1 lg:w-1/3'}>
        <div className="hidden lg:flex gap-5">
          <Image width={18} height={18} src={education_svg.src} alt={education_svg.src} />
          <div className="font-semibold text-base 2xl:text-xl font-[Poppins] text-[#080940] ">
            {lesson.title}
          </div>
        </div>
        <div className="lg:pl-3">
          <div className="flex flex-col gap-3 mt-2">
            <div className="w-full h-1 rounded-full bg-[#6B96E9]"></div>
            <div className="font-semibold text-[#445158] text-center  2xl:text-xl">
              {t('lessonDescription')}
            </div>
            <div className="flex justify-between  ">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-xs 2xl:text-base text-[#445158]">
                    {instructor?.firstName} {instructor?.lastName}
                  </div>
                  <div className="font-medium text-[0.6rem] 2xl:text-sm text-[#9BA1A6]">
                    {instructor?.bio}
                  </div>
                </div>
              </div>
            </div>
            <div className="font-medium text-[0.65rem] 2xl:text-sm text-[#1C112A] mt-2 hidden lg:block">
              {lesson.description}
            </div>
            <hr />
          </div>
          <List elements={elements} onElementClick={onElementClick} isSubscribed={isSubscribed} />
        </div>
      </div>

      <div className="w-full">
        {activeElement?.content ? (
          <div>
            <div className="flex items-center gap-2 m-6">
              <div className="text-[#7C8DA6] text-[0.5rem] 2xl:text-sm font-bold">
                {lesson.title}
              </div>
              <div className="font-semibold font-[Poppins] text-[#080940] 2xl:text-lg ">
                {lesson.description}
              </div>
            </div>
            <VideoElement
              lesson={lesson}
              element={activeElement}
              handleCompleteVideo={handleCompleteVideo}
            />
          </div>
        ) : (
          !activeElement?.content &&
          activeElement && (
            <div className="flex flex-col gap-3 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[#7C8DA6] text-[0.5rem] 2xl:text-sm font-bold">
                    {lesson.title}
                  </div>
                  <div className="font-semibold font-[Poppins] text-[#080940] t2xl:text-lg ">
                    {lesson.description}
                  </div>
                </div>
              </div>
              <Quizz quizz={activeElement} onQuizzAnswered={onQuizzAnswered} />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Lesson;
