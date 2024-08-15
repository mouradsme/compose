import React, { useState } from 'react';
import Image from 'next/image';

import SliderFeatures from '@/components/containers/home/components/sliders/features';

import FeaturesPhone from '@/components/containers/home/components/features/small';
import { useTranslation } from 'next-i18next';
import book_image from '@/public/images/vuesax-bold-book.svg';
import teacher_image from '@/public/images/vuesax-bold-teacher.svg';
import programming_arrows_image from '@/public/images/vuesax-bold-programming-arrows.svg';
import maximize_image from '@/public/images/vuesax-bold-maximize-3.svg';

import book_image_small from '@/public/images/vuesax-bold-book-small.svg';
import teacher_image_small from '@/public/images/vuesax-bold-teacher-small.svg';
import programming_arrows_image_small from '@/public/images/vuesax-bold-programming-arrows-small.svg';
import maximize_image_small from '@/public/images/vuesax-bold-maximize-3-small.svg';
import Loading from '@/components/common/elements/loading';

function Features() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  const FEATURES = [
    {
      header: t('features.features.highSchoolCourse.header'),
      title: t('features.features.highSchoolCourse.title'),
      description: t('features.features.highSchoolCourse.description'),
      icon: book_image.src,
      icon_small: book_image_small.src,
      picture: 'https://picsum.photos/800/500',
      teacher: {
        name: t('features.teachers.johnDoe.name'),
        job: t('features.teachers.johnDoe.job'),
        picture: 'https://picsum.photos/150/150',
        bio: t('features.teachers.johnDoe.bio'),
      },
    },
    {
      header: t('features.features.qualifiedTeachers.header'),
      title: t('features.features.qualifiedTeachers.title'),
      description: t('features.features.qualifiedTeachers.description'),
      icon: teacher_image.src,
      icon_small: teacher_image_small.src,
      picture: 'https://picsum.photos/800/500',
      teacher: {
        name: t('features.teachers.janeSmith.name'),
        job: t('features.teachers.janeSmith.job'),
        picture: 'https://picsum.photos/50/50',
        bio: t('features.teachers.janeSmith.bio'),
      },
    },
    {
      header: t('features.features.followUp.header'),
      title: t('features.features.followUp.title'),
      description: t('features.features.followUp.description'),
      icon: programming_arrows_image.src,
      icon_small: programming_arrows_image_small.src,
      picture: 'https://picsum.photos/800/500',
      teacher: {
        name: t('features.teachers.bobJohnson.name'),
        job: t('features.teachers.bobJohnson.job'),
        picture: 'https://picsum.photos/50/50',
        bio: t('features.teachers.bobJohnson.bio'),
      },
    },
    {
      header: t('features.features.scale.header'),
      title: t('features.features.scale.title'),
      description: t('features.features.scale.description'),
      icon: maximize_image.src,
      icon_small: maximize_image_small.src,
      picture: 'https://picsum.photos/800/500',
      teacher: {
        name: t('features.teachers.sarahLee.name'),
        job: t('features.teachers.sarahLee.job'),
        picture: 'https://picsum.photos/50/50',
        bio: t('features.teachers.sarahLee.bio'),
      },
    },
  ];

  const cards = FEATURES.map((feature, index) => (
    <div
      key={index}
      className={` flex px-5 py-3 text-xs 2xl:text-md font-medium rounded-lg cursor-pointer  ${
        currentIndex !== index ? 'bg-[#97AAC8] ' : 'gradient-transition'
      }`}
      onClick={() => {
        setCurrentIndex(index);
      }}
    >
      <div className="flex items-center ">
        <Image
          src={feature.icon}
          alt={feature.title}
          className="w-6 h-6 2xl:w-9 2xl:h-9 mr-2"
          width={100}
          height={100}
        />
        <span className="text-white 2xl:text-lg font-medium ">{feature.title}</span>
      </div>
    </div>
  ));

  const cardsSmall = FEATURES.map((feature, index) => (
    <FeaturesPhone
      key={index}
      index={index}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      feature={feature}
    />
  ));

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <div className="hidden md:block  py-12  ">
        <div className="max-w-7xl mx-auto w-3/4 2xl:w-5/6 px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-center ">
            <h1
              className={`  text-center 
                          text-2xl
                          2xl:text-4xl 
                          font-bold 
                          text-[#283845]
                          w-1/2
                          2xl:w-2/3
                          [&>span]:text-[#2686FF] 
                          font-[Montserrat]
                          `}
            >
              {t('features.h1MakeStudying')}
              <span>&nbsp;{t('features.intelligence')}</span>
            </h1>
          </div>
          <p
            className={`text-center 
                      mt-4 
                      text-xs
                      2xl:text-sm
                      text-[#87969B]
                      font-semibold
                      mx-auto w-3/4  
                      [&>span]:text-[#2686FF]`}
          >
            {t('features.descriptionSimplified')}
            <span>{t('features.succeed')}</span> {t('features.inPresentFuture')}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-1 ">{cards}</div>

          <div className="mt-10">
            <div className="relative">
              <div className="flex ">
                <SliderFeatures
                  items={FEATURES}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                />
              </div>

              <div className="mt-10 flex justify-center">
                {FEATURES.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full bg-gray-400 mx-2 cursor-pointer w-50 ${
                      currentIndex === index ? 'bg-gray-900' : ''
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block md:hidden py-12  ">
        <div className="max-w-7xl mx-auto lg:w-3/4 2xl:w-5/6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center ">
            <h1
              className={`  text-center 
                            text-lg
                            lg:text-2xl
                            2xl:text-4xl 
                            font-bold 
                            text-[#283845]
                            w-4/5
                            lg:w-1/2
                            2xl:w-2/3
                            [&>span]:text-[#2686FF] 
                            font-[Montserrat]
                            `}
            >
              {t('features.h1MakeStudying')}
              <span>&nbsp;{t('features.intelligence')}</span>
            </h1>
          </div>
          <p
            className={`text-center 
                        mt-4
                        text-xs 
                        lg:text-xs
                        2xl:text-sm
                        text-[#87969B]
                        font-semibold
                        mx-auto 
                        w-4/5
                        lg:w-3/4  
                        [&>span]:text-[#2686FF]`}
          >
            {t('features.descriptionSimplified')}
            <span>{t('features.succeed')}</span> {t('features.inPresentFuture')}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-1 ">{cardsSmall}</div>
        </div>
      </div>
    </>
  );
}

export default Features;
