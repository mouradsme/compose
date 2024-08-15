import { Lesson } from '@/common/types/common';
import Elements from '@/components/containers/courses/details/components/elements';

interface LessonsProps {
  lessons: Lesson[];
}
const Lessons = ({ lessons }: LessonsProps) => {
  return (
    <div className="inline-flex flex-col mt-8 h-screen overflow-y-scroll scrollbar-hidden md:w-full lg:w-full">
      {lessons.length &&
        lessons.map((lesson, index: number) => (
          <div key={lesson.id} className="flex gap-2">
            <div className=" inline-flex flex-col items-center  ">
              <div className="flex justify-center items-center border-2 border-black rounded-full p-2 w-2 h-2 2xl:p-3 2xl:w-3 2xl:h-3">
                {index + 1}
              </div>

              <div className="h-full w-0.5 bg-black"></div>
            </div>
            <div className="w-full px-1 md:p-3">
              <div className="font-bold text-base 2xl:text-lg text-black ">{lesson.title}</div>
              <div>{lesson.description}</div>
              {lesson.elements && lesson.elements.length > 0 && (
                <Elements elements={lesson.elements} />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Lessons;
