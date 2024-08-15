import { Element as ElementType, Quiz } from '@/common/types/common';
import { Video, QuizzText } from '@/components/Icons';
import { Lock } from '@/components/Icons';
interface ElementProps {
  element: ElementType & Quiz;
  index: number;
  isSubscribed: boolean;
}

const Element = ({ element, index, isSubscribed }: ElementProps) => {
  return (
    <>
      <div className="table-cell w-1/5 px-2">{element.content ? <Video /> : <QuizzText />}</div>
      <div className="table-cell w-1/5 px-2">{index}</div>
      <div className="table-cell w-2/5">{element.title}</div>
      <div className="table-cell w-1/5">{!element.isFree && !isSubscribed && <Lock />}</div>
    </>
  );
};

export default Element;
