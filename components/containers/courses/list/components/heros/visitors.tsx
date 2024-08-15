import image from '@/public/images/all.svg';

import { FaSistrix } from 'react-icons/fa';

import { useState } from 'react';
import { Tag } from '@/common/types/common';
import { Tag as TagComponents } from '@/components/common/elements/tag';
import { useTranslation } from 'next-i18next';

interface HearoProps {
  tags: { levels: Tag[]; subjects: Tag[] };
  totalRecords: number;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (value: string) => void;
}

function Hero({ tags, onTagsChange, onSearchChange, totalRecords }: HearoProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const { t } = useTranslation('courses');

  const handleTagClick = (tag: Tag) => {
    const tagExists = selectedTags.find((t) => t === tag.id);
    let tags = selectedTags;
    if (tagExists) {
      tags = tags.filter((t) => t !== tag.id);
    } else {
      tags = [...tags, tag.id];
    }
    setSelectedTags(tags);
    onTagsChange(tags);
  };

  const onChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="bg-white py-12 " style={{ backgroundImage: `url(${image.src})` }}>
      <div className="flex justify-center items-center ">
        <input
          type="text"
          defaultValue={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`${t('searchCourse')}`}
          className="border-2 border-[#6F88A1] w-5/6  lg:w-2/5 p-2 text-center rounded-lg lg:rounded-2xl placeholder-[#737F8B]"
        />

        <FaSistrix className="-ml-10 text-2xl  " />
      </div>
      <div className="hidden lg:flex justify-center items-center mt-4 2xl:mt-8">
        <div className="flex w-3/4 2xl:w-3/5 gap-3 2xl:gap-5 flex-wrap justify-center items-center">
          {tags.levels?.map((level) => (
            <TagComponents
              key={level.id}
              tag={level}
              onClick={() => handleTagClick(level)}
              selected={selectedTags.includes(level.id)}
              tagKey={'name'}
            />
          ))}
          {tags.subjects?.map((subject) => (
            <TagComponents
              key={subject.id}
              tag={subject}
              onClick={() => handleTagClick(subject)}
              selected={selectedTags.includes(subject.id)}
              tagKey={'name'}
            />
          ))}
        </div>
      </div>
      {totalRecords > 24 && (
        <div className="text-center mt-10 text-[#283845] [&>span]:text-[#0F54EF] font-semibold text-xl 2xl:text-2xl ">
          {t('moreThan')} <span>{Math.floor(totalRecords / 10) * 10}+</span> {t('course')}
        </div>
      )}
    </div>
  );
}

export default Hero;
