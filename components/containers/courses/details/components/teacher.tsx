import { Instructor } from '@/common/types/common';
import { useTranslation } from 'next-i18next';

interface TeacherProps {
  instructor: Instructor;
}

const Teacher = ({ instructor }: TeacherProps) => {
  const { t } = useTranslation('courses');
  return (
    <div className="flex flex-col gap-3 mt-4 justify-center items-center">
      <div className="font-semibold text-base 2xl:text-xl text-[#445158]">{t('teacher')}</div>
      <div className="font-semibold text-base 2xl:text-xl text-[#445158]">
        {instructor.firstName} {instructor.lastName}
      </div>
      <div className="font-medium text-xs 2xl:text-sm text-[#9BA1A6]">{instructor.bio}</div>
    </div>
  );
};

export default Teacher;
