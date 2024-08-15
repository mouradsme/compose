import { Course } from '@/common/types/common';
import Button from '@/components/common/buttons';
import Card from '@/components/containers/admin/courses/list/components/card';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

interface ListProps {
  courses: Course[];
  onDisplayMore: () => void;
  canDisplayMore: boolean;
}

function List({ courses, onDisplayMore, canDisplayMore }: ListProps) {
  const { t } = useTranslation('courses');
  return (
    <div className="flex flex-col justify-center ml-4 mt-4 h-100 overflow-y-scroll courses w-11/12  ">
      <div className="grid grid-cols-3 gap-4 p-2 pr-28 pb-10 ">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/admin/dashboard/courses/${course.id}`}
            className="hover:opacity-70"
          >
            <Card course={course} />
          </Link>
        ))}
      </div>
      {canDisplayMore && (
        <div className="pb-10 flex justify-center">
          <Button onClick={onDisplayMore} type="info">
            {t('displayMore')}
          </Button>
        </div>
      )}
    </div>
  );
}

export default List;
