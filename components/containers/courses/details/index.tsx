import video_play_svg from '@/public/images/video-play-svg.svg';
import clock_svg from '@/public/images/clock-svg.svg';
import profile_svg from '@/public/images/profile-svg.svg';
import Teacher from '@/components/containers/courses/details/components/teacher';
import Lessons from '@/components/containers/courses/details/components/lessons';
import Sections from '@/components/containers/courses/details/components/sections';
import { Tag } from '@/components/common/elements/tag';
import { Course, Instructor, Section } from '@/common/types/common';
import Image from 'next/image';
import useRequest from '@/hooks/request';
import URLS from '@/common/urls';
import { BACKEND_URL } from '@/common/config';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { enrollCourse } from '@/lib/courses';
import { getLessons } from '@/lib/lessons';
import { useTranslation } from 'next-i18next';
import { blurImageUrl } from '@/common/utils';
import { useMessage } from '@/contexts/message';

interface DetailsProps {
  course: Course;
  instructor: Instructor;
}

const Details = ({ course, instructor }: DetailsProps) => {
  const { t } = useTranslation('courses');
  const { showMessage } = useMessage();
  const router = useRouter();
  const isDashboard = router.asPath.includes('dashboard');
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

  const onStartNow = async () => {
    try {
      await enrollCourse(course.id);
      router.push(`/courses/${course.id}/quizzes`);
      return;
    } catch (err: any) {
      const errorMessage = err.response.data?.errors?.[0].message;
      const status = err.response.status;
      if (status === 401) {
        showMessage(t('notAuthorized') as string, 'error');
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }
      showMessage(errorMessage ?? err.messag, 'error');
      const sectionId = sections?.items?.[0].id;
      const lessons = await getLessons(sectionId);
      router.push(
        `/lessons/${lessons.data?.items?.[0].id}?course=${course.id}&section=${sectionId}`
      );
    }
  };

  return (
    <>
      {isDashboard ? (
        <>
          {sections?.items?.length > 0 && (
            <Sections
              sections={sections?.items}
              onSectionChange={onSectionChange}
              isDashboard={isDashboard}
            />
          )}
        </>
      ) : undefined}
      {isDashboard ? undefined : (
        <>
          <div className="mt-24 flex flex-col justify-center items-center gap-4">
            <div className="text-center text-bold text-lg lg:text-xl 2xl:text-3xl text-[#273B54]">
              {course.title}
            </div>
            <div className="px-6 md:px-1 md:w-[28vw] md:h-[35vh]">
              {course.coverUrl ? (
                <Image
                  className="rounded-md w-full h-full"
                  width={800}
                  height={800}
                  src={course.coverUrl}
                  alt={`${course.title} details`}
                  placeholder="blur"
                  blurDataURL={blurImageUrl}
                />
              ) : (
                <Image
                  className="rounded-md w-full h-full"
                  width={800}
                  height={800}
                  src={'https://picsum.photos/800/800'}
                  alt={`${course.title} details`}
                  placeholder="blur"
                  blurDataURL={blurImageUrl}
                />
              )}
            </div>

            <div className="flex gap-6 text-xs 2xl:text-base text-[#9BA1A6]">
              <div className="flex gap-1.5 items-center">
                <div>
                  <Image
                    className="rounded-md w-4 h-4 2xl:w-6 2xl:h-6 "
                    width={800}
                    height={800}
                    src={video_play_svg.src}
                    alt={video_play_svg.src}
                  />
                </div>
                <div>
                  {course.numberOfElements} {t('videos')}
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <div>
                  <Image
                    className="rounded-md w-4 h-4 2xl:w-6 2xl:h-6 "
                    width={800}
                    height={800}
                    src={clock_svg.src}
                    alt={`clock icon in ${course.title} details`}
                  />
                </div>
                <div>
                  {' '}
                  {course.durationInSeconds / 60} {t('minutes')}{' '}
                </div>
              </div>

              <div className="flex gap-1 items-center">
                <div>
                  <Image
                    className="rounded-md w-4 h-4 2xl:w-6 2xl:h-6 "
                    width={800}
                    height={800}
                    src={profile_svg.src}
                    alt={`profile icon  in ${course.title} details`}
                  />
                </div>
                <div>
                  {course.numberOfEnrolled} {t('studentsEnrolled')}
                </div>
              </div>
            </div>
          </div>
          <hr className=" mt-4" />
        </>
      )}
      <div
        className={`flex flex-col justify-center items-center ${isDashboard ? '' : 'p-4 mt-10'}`}
      >
        <div
          className={`flex flex-col-reverse md:flex-row justify-center w-full ${
            isDashboard ? 'w-full p-10' : 'md:w-4/5'
          } gap-8`}
        >
          <div
            className={`flex flex-col justify-center w-full ${
              isDashboard ? 'md:w-8/12' : 'md:w-4/6'
            }`}
          >
            {isDashboard ? undefined : (
              <div>
                <div className="text-[#445158] text-sm 2xl:text-2xl font-semibold">
                  {t('descriptionTitle')}
                </div>

                <div className="mt-3 text-[#9BA1A6] text-xs 2xl:text-base ">
                  <div>{course.shortDescription}</div>
                  <div className="mt-3">{course.description}</div>
                  <div className="mt-5">{t('whatYouWillLearn')}</div>
                  <div className="grid  lg:grid-cols-2 gap-2 mt-5">
                    {course.objectives &&
                      course.objectives.map((objective, index) => (
                        <div className="flex gap-1" key={index}>
                          <div className="mt-1">
                            <div className="w-3 h-3">
                              <svg className="svg-icon" viewBox="0 0 20 20">
                                <path
                                  fill="#4BB543"
                                  d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div>{objective}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            <div
              className={`flex flex-col justify-center w-full gap-8 ${isDashboard ? '' : 'mt-8'}`}
            >
              {isDashboard ? undefined : (
                <>
                  {sections?.items?.length > 0 && (
                    <>
                      <div className="text-[#445158] text-lg 2xl:text-2xl font-extrabold">
                        {t('dontKnowWhereToStart')}
                      </div>
                      <Sections sections={sections?.items} onSectionChange={onSectionChange} />
                    </>
                  )}
                </>
              )}
              {lessons?.items?.length > 0 && selectedSection && <Lessons lessons={lessons.items} />}
            </div>
          </div>
          <div className={`flex flex-col w-full ${isDashboard ? 'md:w-4/12' : ' md:w-2/6'}`}>
            <div className="flex flex-col gap-5 justify-center items-center lg:gap-1">
              {lessons?.items?.length > 0 && (
                <button
                  onClick={onStartNow}
                  className="cursor-pointer text-center bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] text-white rounded-lg py-3 px-14 lg:py-1 lg:px-10 font-medium 2xl:py-2 2xl:px-14"
                >
                  {t('startNow')}
                </button>
              )}
              <hr className="lg:mt-8 w-full border-[#9BA1A6]" />
              <hr className="hidden  md:w-full md:block border-[#9BA1A6]" />
            </div>
            {instructor && <Teacher instructor={instructor} />}
            <div className="hidden md:flex flex-wrap capitalize justify-center items-center font-semibold text-[0.75rem] 2xl:text-sm  gap-2 mt-4 ">
              {course.tags.map((tag: Tag) => (
                <>
                  {tag.translations?.[0] ? (
                    <Tag
                      onClick={() => {
                        console.log('clicked');
                      }}
                      tag={tag}
                      selected={false}
                      key={tag.id}
                      tagKey="name"
                    />
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </div>
            {isDashboard ? (
              <div className="mt-10">
                <div className="text-[#445158] text-sm 2xl:text-2xl font-semibold">
                  {t('whatYouWillLearn')}
                </div>

                <div className="mt-3 text-[#9BA1A6] text-xs 2xl:text-base ">
                  <div>{course.shortDescription}</div>
                  <div className="mt-3">{course.description}</div>
                  <div className="mt-5">{t('youWillLearnAbout')}</div>
                  <div className="grid  lg:grid-cols-2 gap-2 mt-5">
                    {course.objectives &&
                      course.objectives.map((objective, index) => (
                        <div className="flex gap-1" key={index}>
                          <div className="mt-1">
                            <div className="w-3 h-3">
                              <svg className="svg-icon" viewBox="0 0 20 20">
                                <path
                                  fill="#4BB543"
                                  d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div>{objective}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : undefined}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
