import { Course } from '@/common/types/common';
import { useTranslation } from 'next-i18next';

interface CoursesProps {
  courses: Course[];
}

const Courses = ({ courses }: CoursesProps) => {
  const { t } = useTranslation('profile');
  return (
    <div className="flex justify-center">
      <table className="table text-gray-400 border-separate space-y-6 text-sm 2xl:text-lg mx-auto">
        <thead className="bg-[#F7F8FA] text-[#292D32]">
          <tr>
            <th className="px-4 lg:px-9 2xl:px-16 py-2.5 text-center ">{t('courseName')}</th>
            <th className="px-4 lg:px-9 2xl:px-16 py-2.5 text-center ">{t('duration')}</th>
            <th className="px-4 lg:px-9 2xl:px-16 py-2.5 text-center hidden md:table-cell">
              {t('description')}
            </th>
            <th className="px-4 lg:px-9 2xl:px-16 py-2.5 text-center ">{t('numberOfElements')}</th>
          </tr>
        </thead>

        <tbody>
          {courses?.map((course: Course) => (
            <tr className="text-[#2C4162] bg-[#F7F8FA] px-2" key={course.id}>
              <td className="text-center text-[#2C4162] font-medium text-sm 2xl:text-base font-[Roboto] py-1.5 font-semibold">
                {course.title}
              </td>
              <td className="text-center text-[#2C4162] font-medium text-sm 2xl:text-base font-[Roboto] py-1.5 font-semibold">
                {course.durationInSeconds}
              </td>
              <td className="text-center text-[#2C4162] font-medium text-sm 2xl:text-base font-[Roboto] py-1.5 font-semibold hidden md:table-cell">
                {course.shortDescription}
              </td>
              <td className="text-center text-[#2C4162] font-medium text-sm 2xl:text-base font-[Roboto] py-1.5 font-semibold">
                {course.numberOfElements}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
