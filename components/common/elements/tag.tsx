import { Tag } from '@/common/types/common';
import Loading from './loading';

type TagType = Tag['translations'][0];

interface TagProps {
  tag: Tag;
  selected: boolean;
  onClick: (tag: Tag) => void;
  tagKey?: keyof TagType;
  extraClass?: string;
  isLoading?: boolean;
  language?: string;
}

const Tag = ({
  tag,
  selected,
  onClick,
  extraClass,
  tagKey = 'description',
  isLoading = false,
  language = 'AR',
}: TagProps) => {
  if (isLoading) {
    return (
      <div className="max-h-3">
        <Loading height="" />
      </div>
    );
  }

  return (
    <div key={tag.id}>
      <div
        className={`${
          selected === true ? 'bg-[#6B96E9] text-white' : ' bg-[#F4F4F4] text-[#515E6E]'
        } text-xs 2xl:text-sm font-semibold rounded-2xl flex flex-col justify-center items-center px-2 py-1 2xl:px-3 2xl:py-1.5 2xl:rounded-3xl capitalize cursor-pointer
        ${extraClass ? extraClass : ''}`}
        onClick={() => onClick(tag)}
      >
        {tag.translations?.find((tr) => tr.language === language)?.[tagKey] ||
          tag.translations?.[0][tagKey]}
      </div>
    </div>
  );
};

export { Tag };
