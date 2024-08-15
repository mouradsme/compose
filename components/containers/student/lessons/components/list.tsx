import { Element as ElementType, Quiz } from '@/common/types/common';
import Element from '@/components/containers/student/lessons/components/elements';

interface ListProps {
  elements: (ElementType & Quiz)[];
  onElementClick: (element: ElementType & Quiz) => void;
  isSubscribed: boolean;
}
const List = ({ elements, onElementClick, isSubscribed }: ListProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-between  w-full overflow-y-scroll scrollbar-hidden">
        {elements?.map((element: ElementType & Quiz, index: number) => (
          <div
            key={element.id}
            className="w-full table-row p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => onElementClick(element)}
          >
            <Element index={index} element={element} isSubscribed={isSubscribed} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
