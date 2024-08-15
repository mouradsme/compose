import Image from 'next/image';
import bluePaper from '@/public/images/blue-paper.svg';
import { Course, Quiz } from '@/common/types/common';
import { useEffect, useState } from 'react';
import Quizz from '@/components/containers/student/quizzes';
import { useRouter } from 'next/router';
import { getLessons } from '@/lib/lessons';
import { getSections } from '@/lib/sections';
import { useTranslation } from 'next-i18next';

interface StartQuizzProps {
  quiz: Quiz;
  course: Course;
}

const StartQuizz = ({ quiz, course }: StartQuizzProps) => {
  const { t } = useTranslation('quizzes');
  const router = useRouter();
  const [start, setStart] = useState(false);

  const onStartNow = () => {
    setStart(true);
  };

  const onQuizzAnswered = async () => {
    const sections = await getSections(course.id);
    const sectionId = sections?.data?.items?.[0].id;
    const lessons = await getLessons(sectionId);
    router.push(`/lessons/${lessons.data?.items?.[0].id}?course=${course.id}&section=${sectionId}`);
  };

  useEffect(() => {
    if (!quiz) {
      onQuizzAnswered();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  if (start) {
    return (
      <div className="flex justify-around items-center mt-16 lg:mt-8 2xl:mt-20">
        <div className="flex w-full lg:w-2/3 lg:h-3/4 shadow-md gap-3 p-2 ">
          <div className="flex flex-col w-full p-2">
            <div className="flex gap-2 text-xl 2xl:text-3xl text-[#41454E] font-[Poppins] font-medium md:my-4">
              {quiz?.title} : {quiz?.description}
            </div>
            <Quizz quizz={quiz} onQuizzAnswered={onQuizzAnswered} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-[calc(100vh-5rem)] w-screen justify-center items-center bg-[#FAFAFC]">
      <div className="flex items-center justify-center flex-col w-2/3 h-3/4 ">
        <Image width={85} height={85} src={bluePaper.src} alt={bluePaper.src} />
        <div className="text-xl 2xl:text-3xl text-[#41454E] font-semibold mt-6 text-center">
          {t('readyToTakeTest')}
        </div>

        <div className="text-xs 2xl:text-base text-center text-[#7C8DA6] font-[roboto] font-medium mt-4 w-3/5 2xl:w-1/2">
          {quiz?.description}
        </div>
        <div className="w-full lg:w-1/2">
          <div className="w-full p-5 bg-[#F4F6F8] rounded-lg mt-4 ">
            <div className="text-[#41454E] font-[Poppins] font-bold text-sm 2xl:text-base mb-3">
              {t('include')}
            </div>
            <div className="flex justify-between ">
              <div className="text-[0.7rem] 2xl:text-base 2xl:text-sm text-[#7C8DA6] font-[roboto]">
                {course.title}
              </div>
              <div className="text-[0.7rem] 2xl:text-base 2xl:text-sm text-[#2686FF] rounded-full px-2 md:px-4 py-1 bg-[#CCDCFF]">
                {t('evaluatedByResult')}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="flex justify-center items-center py-2 px-4 md:px-16 
                              bg-[#0F54EF] text-white rounded-md l text-lg"
              onClick={onStartNow}
            >
              {t('startTestNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartQuizz;
