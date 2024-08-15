import { Course } from '@/common/types/common';
import { blurImageUrl } from '@/common/utils';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface CardProps {
  course: Course;
}
const Card = ({ course }: CardProps) => {
  const { t } = useTranslation('courses');
  return (
    <div className="w-full p-1 ">
      <div className="w-full h-36 lg:h-40 2xl:h-56 bg-[#F4F4F4] flex flex-col shadow-md transform translate-y-2 gap-3 rounded-xl justify-center  xl:px-7">
        <div className="flex flex-row w-full gap-2 ">
          <p className="font-Poppins text-[#080940] font-semibold text-sm flex self-center">
            {course.title || 'Untitled'}
          </p>
          <div>
            {course.coverUrl ? (
              <Image
                width={200}
                height={200}
                src={course.coverUrl}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            ) : (
              <Image
                width={200}
                height={200}
                src={'https://picsum.photos/400/250'}
                alt={course.shortDescription}
                className="image block"
                placeholder="blur"
                blurDataURL={blurImageUrl}
              />
            )}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="30"
            fill="blue"
            className="bi bi-exclamation-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
          </svg>
        </div>
        <div className="flex flex-row gap-12 justify-around">
          <p className="font-Poppins font-normal text-xs text-[#767F8B]">
            {course.numberOfElements || 0} {t('element')}
          </p>
          <p className="font-Poppins font-normal text-xs text-[#767F8B]">
            {course.numberOfEnrolled || 0} {t('applicants')}
          </p>
        </div>

        <div className="border  border-r-4 border-[#2686FF] "></div>
      </div>
    </div>
  );
};

export default Card;
