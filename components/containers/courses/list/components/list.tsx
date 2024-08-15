import { useState } from 'react';
import { Course as Card } from '@/components/containers/courses/list/components/card';
import { Course } from '@/common/types/common';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import { ITEMS_PER_PAGE } from '@/common/config';
import { useRouter } from 'next/router';

interface ListProps {
  courses: Course[];
  totalRecords: number;
  className: string;
  onPageChange: (page: number) => void;
}

function List({ courses, totalRecords, onPageChange, className }: ListProps) {
  const router = useRouter();
  const path = router.asPath;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleGoBack = () => {
    if (page <= 1) {
      return;
    }
    const newPage = page - 1;
    setPage(newPage);
    onPageChange(newPage);
  };

  const handleGoNext = () => {
    if (page >= totalPages) {
      return;
    }
    const newPage = page + 1;
    setPage(newPage);
    onPageChange(newPage);
  };

  const handlePageClick = (value: number) => {
    setPage(value);
    onPageChange(value);
  };

  return (
    <>
      <div className={className}>
        {courses?.map((course) => (
          <Card key={course.id} course={course} toDashboard={path.includes('dashboard')} />
        ))}
      </div>
      {totalRecords > ITEMS_PER_PAGE && (
        <div className="flex gap-4 mt-4">
          <div
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleGoBack}
          >
            <ChevronLeft />
          </div>
          <div className="flex gap-2 font-[Montserrat]">
            {pages.map((i) => (
              <div
                key={i}
                className={`${i === page ? 'underline text-blue-500' : ''} cursor-pointer`}
                onClick={() => handlePageClick(i)}
              >
                {i}
              </div>
            ))}
          </div>
          <div
            className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            onClick={handleGoNext}
          >
            <ChevronRight />
          </div>
        </div>
      )}
    </>
  );
}

export default List;
