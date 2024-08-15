import Link from 'next/link';
import Image from 'next/image';
import { Course as CourseType } from '@/common/types/common';
import { useTranslation } from 'next-i18next';
import { blurImageUrl } from '@/common/utils';

interface CourseProps {
  course: CourseType;
  toDashboard?: boolean;
}

function Course({ course, toDashboard = false }: CourseProps) {
  const { t } = useTranslation('courses');
  return (
    <>
      <div className="max-w-sm hidden md:flex md:flex-col bg-white rounded-xl overflow-hidden">
        <Link href={`${toDashboard ? '/dashboard/courses/' : '/courses/'}${course.id}`}>
          <div className="container">
            {course.coverUrl ? (
              <Image
                width={500}
                height={500}
                src={course.coverUrl}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            ) : (
              <Image
                width={500}
                height={500}
                src={'https://picsum.photos/400/250'}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            )}
          </div>
        </Link>
        <div className="px-2 py-5 ">
          <h3 className="mb-2 text-[#273B54] text-lg font-semibold font-[Poppins] tracking-tight ">
            {course?.title || `${t('untitled')}`}
          </h3>
          <div className=" h-0.5 bg-[#273B54]"></div>

          <div className="my-4 text-[0.7rem] text-sm text-[#273B54] font-[Poppins] font-medium truncate w-full md:w-3/4 lg:w-full">
            {course.shortDescription}
          </div>
          <div className="flex items-center">
            <Link
              href={`${toDashboard ? '/dashboard/courses/' : '/courses/'}${course.id}`}
              className=" inline-flex items-center 
                          pr-4 py-2 text-base 2xl:text-lg
                          font-medium font-[Poppins] 
                          text-center text-[#0F54EF] 
                          "
            >
              <span className="mr-2">{t('explore')}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#0F54EF"
                className="bi bi-arrow-right-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* for phone  */}
      <div className="flex justify-center mb-2 gap-3 md:hidden overflow-hidden h-36 lg:h-40 2xl:h-56">
        <div className=" flex  gap-3 md:w-4/5  bg-white  overflow-hidden w-full">
          <div className="w-1/2 h-full ">
            {course.coverUrl ? (
              <Image
                width={500}
                height={500}
                src={course.coverUrl}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            ) : (
              <Image
                width={500}
                height={500}
                src={'https://picsum.photos/400/250?blure=5'}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            )}
          </div>
          <div className="px-2 w-1/2 md:w-2/3  ">
            <h3 className="mb-0.5 whitespace-nowrap text-[#273B54]   text-sm md:text-lg font-semibold font-[Poppins] tracking-tight ">
              {course?.title || 'Untitled'}
            </h3>
            <div className="md:min-w-full my-2 md:min-h-full h-0.5 bg-[#273B54]"></div>
            <div className="md:hidden my-1  text-[0.7rem] text-[#273B54] font-[Poppins] font-medium truncate w-3/4 ">
              {course.shortDescription}
            </div>

            <div className="flex items-center">
              <Link
                href={`${toDashboard ? '/dashboard/courses/' : '/courses/'}${course.id}`}
                className=" inline-flex items-center 
                            pr-2 py-2 text-xs md:text-sm 
                            font-medium font-[Poppins] 
                            text-center text-[#0F54EF] 
                            "
              >
                <span className="mr-2">{t('explore')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="#0F54EF"
                  className="bi bi-arrow-right-circle-fill m-6"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Path({ level }: any) {
  const { t } = useTranslation('courses');
  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow ">
      <h5 className="mb-2 text-lg 2xl:text-xl font-[Montserrat] font-semibold tracking-tight text-[#293B52]">
        {level}
      </h5>
      <Link
        href="#"
        className="inline-flex items-center text-[#0F54EF] text-sm 2xl:text-base font-[Montserrat] font-semibold underline"
      >
        {t('tryProgram')}
      </Link>
    </div>
  );
}

export { Course, Path };
