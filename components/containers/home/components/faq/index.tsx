import { useState } from 'react';
import Accordion from '@/components/containers/home/components/accordion';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

const FAQ = () => {
  const { t, ready } = useTranslation('home');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!ready) {
    return <Loading />;
  }

  const list = t('faq.questions', { returnObjects: true }) as any[];

  const renderFAQ = list.map((item: any, index: number) => {
    return (
      <div
        key={index}
        className={`flex p-2 ${activeIndex === index ? 'bg-[#F7F7FD] rounded-xl' : ''} `}
        onClick={() => setActiveIndex(index)}
      >
        <div
          className={`${activeIndex === index ? 'bg-[#006FFF]' : 'bg-white'} h-full p-0.5 mx-2`}
        ></div>
        <div className=" text-[#080940] font-[Montserrat]">
          <div className="mb-4 text-md 2xl:text-lg font-bold w-3/4 ">{item.question}</div>
          <div className="text-[0.7rem] 2xl:text-sm ">{item.answer}</div>
        </div>
      </div>
    );
  });

  const renderFAQPhone = list?.map((item, index) => {
    return (
      <Accordion
        key={index}
        title={item.question}
        content={item.answer}
        activeIndex={activeIndex}
        index={index}
      />
    );
  });

  return (
    <div className=" flex justify-center mt-16">
      <div className="w-full lg:w-7/12 p-4 ">
        <div className="text-center text-2xl 2xl:text-4xl text-[#080940] font-bold">
          {t('faq.title')}
        </div>
        <div className="hidden lg:grid grid-cols-2 gap-10 mt-10 ">{renderFAQ}</div>

        <div className="grid lg:hidden grid-cols-1 gap-4 mt-10 ">{renderFAQPhone}</div>
      </div>
    </div>
  );
};

export default FAQ;
