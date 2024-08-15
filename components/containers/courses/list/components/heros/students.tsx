import { FaSistrix } from 'react-icons/fa';
import { useState } from 'react';
import { Tag } from '@/common/types/common';
import { Tag as TagComponents } from '@/components/common/elements/tag';
import Image from 'next/image';
import category_svg from '@/public/images/category-svg.svg';
import { useTranslation } from 'next-i18next';

interface HearoProps {
  tags: Tag[] | undefined;
  onSubjectChange: (tag: string | undefined) => void;
  onSearchChange: (value: string) => void;
}

const Hero = ({ tags, onSubjectChange, onSearchChange }: HearoProps) => {
  const { t } = useTranslation('courses');
  const [selectedSubject, setSelectedSubject] = useState<Tag | undefined>(undefined);
  const [query, setQuery] = useState<string | undefined>(undefined);
  console.log(tags?.length);
  const handleSubjectClick = (tag: Tag) => {
    if (tag.id === selectedSubject?.id) {
      setSelectedSubject(undefined);
      onSubjectChange(undefined);
      return;
    }
    setSelectedSubject(tag);
    onSubjectChange(tag.id);
  };

  const onChange = (value: string) => {
    setQuery(value);
    onSearchChange(value);
  };
  return (
    <>
      <div className="w-full bg-[#EBF3FF] p-8 grid grid-cols-1 md:grid-cols-9">
        <div className="hidden md:block col-span-5">
          <p className="text-md text-[#273B54] font-bold">{t('whatYourLevel')}</p>
          <div className="flex gap-4 mb-3 mt-3 flex-wrap">
            {!tags
              ? [1, 2, 3, 4].map((el) => (
                  <TagComponents
                    key={el}
                    onClick={() => handleSubjectClick(el as unknown as Tag)}
                    tag={el as unknown as Tag}
                    selected={false}
                    tagKey="name"
                    isLoading={true}
                  />
                ))
              : tags?.map((level) => (
                  <TagComponents
                    key={level.id}
                    tag={level}
                    onClick={() => handleSubjectClick(level)}
                    selected={level.id === selectedSubject?.id}
                    tagKey={'name'}
                    extraClass="text-xs 2xl:text-xs font-light"
                  />
                ))}
          </div>
          <div className="lg:block text-xl 2xl:text-3xl text-[#273B54] font-bold mt-10">
            {t('improveAcademicLevel')}
          </div>
        </div>
        <div className="flex justify-end items-start md:col-span-4">
          <div className="flex items-center items-start w-full mx-3">
            <input
              type="text"
              value={query}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`${t('searchCourse')}`}
              className="border px-3 py-2 2xl:px-4 2xl:py-3.5 rounded-2xl 2xl:text-base 2xl:rounded-4xl placeholder-[#737F8B] w-full text-xs 2xl:text-base"
            />
            <FaSistrix className=" -ml-10 text-2xl  2xl:text-4xl lg:-ml-16 " />
          </div>
        </div>
      </div>
      <div className={'hidden md:flex pl-4 items-center  gap-3 mt-4 2xl:mt-8 '}>
        <Image width={22} height={22} src={category_svg.src} alt={category_svg.src} />
      </div>
    </>
  );
};

export default Hero;
