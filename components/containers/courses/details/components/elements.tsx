import { Element } from '@/common/types/common';
import Card from '@/components/containers/courses/details/components/card';

interface ElementsProps {
  elements: Element[];
}

const Elements = ({ elements }: ElementsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-2 lg:gap-4 mt-2">
      {elements.length > 0 &&
        elements.map((element: Element) => <Card key={element.id} element={element} />)}
    </div>
  );
};

export default Elements;
