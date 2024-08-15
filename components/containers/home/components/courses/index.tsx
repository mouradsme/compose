import l_svg from '@/public/images/l_svg.svg';

import Image from 'next/image';
import { useState } from 'react';

import Course from '@/components/containers/home/components/course';
import SliderCourses from '@/components/containers/home/components/sliders/courses';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

const Courses = () => {
  const { t, ready } = useTranslation('home');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  if (!ready) {
    return <Loading />;
  }

  const COURSES = [
    {
      header: t('courses.physics.header'),
      title: t('courses.physics.title'),
      description: t('courses.physics.description'),
      benifits: t('courses.physics.benefits', { returnObjects: true }) as any[],
      extraBenifits: t('courses.physics.extraBenefits', { returnObjects: true }) as any[],
    },
    {
      header: t('courses.arabic.header'),
      title: t('courses.arabic.title'),
      description: t('courses.arabic.description'),
      benifits: t('courses.arabic.benefits', { returnObjects: true }) as any[],
      extraBenifits: t('courses.arabic.extraBenefits', { returnObjects: true }) as any[],
    },
    {
      header: t('courses.math.header'),
      title: t('courses.math.title'),
      description: t('courses.math.description'),
      benifits: t('courses.math.benefits', { returnObjects: true }) as any[],
      extraBenifits: t('courses.math.extraBenefits', { returnObjects: true }) as any[],
    },
    {
      header: t('courses.english.header'),
      title: t('courses.english.title'),
      description: t('courses.english.description'),
      benifits: t('courses.english.benefits', { returnObjects: true }) as any[],
      extraBenifits: t('courses.english.extraBenefits', { returnObjects: true }) as any[],
    },
  ];

  const renderCourses = COURSES.map((course, index) => (
    <Course
      key={index}
      onClick={setCurrentIndex}
      index={index}
      currentIndex={currentIndex}
      course={course}
    />
  ));

  return (
    <div className=" flex justify-center mt-10 2xl:mt-16 ">
      <div className=" border-2 rounded-xl border-gray-50 shadow w-11/12 lg:w-2/3 py-10  ">
        <div className="text-center text-xl lg:text-3xl text-[#293B52] font-bold font-Montserrat">
          {t('courses.moreThanStudents')}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-3 lg:grid-cols-4 w-11/12 gap-2 lg:gap-5 px-1 lg:px-5 text-sm mt-5">
            {renderCourses}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 px-6 md:py-8 lg:px-12 mt-12  ">
          <div className=" hidden lg:block w-96 h-72 2xl:w-[28rem] 2xl:h-[24rem] ">
            <Image width={500} height={500} alt={l_svg.src} src={l_svg.src} />
          </div>
          <div className="overflow-hidden ">
            <SliderCourses
              items={COURSES}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
