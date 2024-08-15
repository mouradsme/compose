import { Section } from '@/common/types/common';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const arrow = (
  <span className="flex items-center pl-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      fill="currentColor"
      className="bi bi-chevron-down"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
      />
    </svg>
  </span>
);

const leftSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    fill="currentColor"
    className="bi bi-arrow-left"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
);

interface SectionsProps {
  sections: Section[];
  onSectionChange: (seciton: Section) => void;
  isDashboard?: boolean;
}

const Sections = ({ sections, onSectionChange, isDashboard = false }: SectionsProps) => {
  const { t } = useTranslation('courses');
  const [isOpen, setIsOpen] = useState(false);
  const [section, setSection] = useState(sections[0]);
  const divEl = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      if (!divEl?.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [divEl]);

  useEffect(() => {
    onSectionChange(section);
  }, [onSectionChange, section]);

  const handleOptionClick = (value: Section) => {
    if (!value) {
      return;
    }

    setIsOpen(false);
    setSection(value);
    onSectionChange(value);
  };

  if (isDashboard) {
    return (
      <div className="w-full shadow-sm p-5 ">
        <div className="flex justify-between 2xl:px-10 ">
          <div className=" flex gap-3 w-full lg:w-1/3">
            <Link
              href="/dashboard/learning-paths"
              className="flex justify-center items-center bg-[#7C8DA61C] w-8 h-8  cursor-pointer rounded-full "
            >
              {leftSvg}
            </Link>
            <div ref={divEl} className=" relative flex flex-col w-full gap-2 z-[60]">
              <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center border rounded border-[#9B99AF] bg-[#FAFAFA] px-3 py-3 cursor-pointer capitalize text-xs ${
                  section.id ? 'text-[#131B2B]' : 'text-[#9B99AF]'
                }`}
              >
                {section.title || t('selectChapter')}
                {arrow}
              </div>

              {isOpen && (
                <div className="absolute bg-white mt-10 w-full">
                  {sections.map((item: Section) => {
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOptionClick(item)}
                        className="w-full border px-3 py-2 cursor-pointer hover:bg-blue-100 text-xs capitalize"
                      >
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 text-[#9BA1A6] text-[0.7rem] 2xl:text-sm">
        <div className="flex flex-col md:flex-row lg:flex-row gap-3">
          <div ref={divEl} className="relative flex flex-col w-full md:w-1/2 gap-2">
            <label className="font-bold text-sm 2xl:text-xl text-[#131B2B]">
              {t('selectSection')}
            </label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className={`flex justify-between items-center border rounded border-[#9B99AF] bg-[#FAFAFA] px-3 py-2 cursor-pointer capitalize text-xs ${
                section.id ? 'text-[#131B2B]' : 'text-[#9B99AF]'
              }`}
            >
              {section.title || t('selectChapter')}
              {arrow}
            </div>
            {isOpen && (
              <div className="absolute bg-white mt-16 w-full">
                {sections.map((item: Section) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleOptionClick(item)}
                      className="w-full border px-3 py-2 cursor-pointer hover:bg-blue-100 text-xs capitalize"
                    >
                      {item.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="ml-6 ">
          <div className="mt-3 ">{section.description}</div>
        </div>
      </div>
    </>
  );
};

export default Sections;
