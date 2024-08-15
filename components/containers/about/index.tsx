import Link from 'next/link';
import Image from 'next/image';

import program_logo from '@/public/images/program_logo.svg';
import { useState, useEffect, useRef } from 'react';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

function Card({ programm }: any) {
  const { t, ready } = useTranslation('about-us');
  const [active, setActive] = useState(false);
  const [spans, setSpans] = useState(0);
  const textRef: any = useRef();

  useEffect(() => {
    if (textRef?.current?.clientHeight) {
      const height: any = textRef?.current?.clientHeight;
      const spans: any = Math.ceil(height / 10 + 2);
      setSpans(spans);
    }
  }, [textRef]);

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="mx-3 my-3 " style={{ gridRowEnd: `span ${spans}` }}>
      <div ref={textRef} className="p-6 bg-white my-4 rounded-lg shadow ">
        <div className="flex gap-4">
          <div className=" ">
            <Image src={program_logo.src} width={25} height={25} alt={program_logo.src} />
          </div>

          <div>
            <h5 className="mb-2 text-lg 2xl:text-2xl font-semibold font-[Montserrat] tracking-tight text-[#293B52] ">
              {programm.title}
            </h5>
            <div className=" ">
              <div className="mb-3 text-sm 2xl:text-base font-medium font-[Montserrat] text-[#757575] w-2/3">
                {programm.content}
              </div>
            </div>
          </div>
        </div>

        {active ? (
          <div className="flex justify-around">
            <div className="flex gap-1 items-center ">
              <Link
                role="button"
                className=" flex 
                            justify-center 
                            whitespace-nowrap
                            bg-gradient-to-r 
                            from-[#0F54EF] 
                            to-[#2686FF]  
                            hover:bg-blue-500 
                            rounded-full 
                            text-xs
                            mt-4 
                            py-1.5 
                            px-2.5
                            lg:mt-4 
                            lg:py-2
                            lg:px-4
                            lg:text-sm 
                            text-white"
                href="/about-us"
              >
                {t('learnMore')}
                <div className="flex items-center pl-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
              </Link>
            </div>

            <div className="flex items-center ">
              <Link
                role="button"
                className=" flex 
                        
                            justify-center 
                            bg-gray-100
                            text-gray-800
                            hover:bg-blue-500 
                            rounded-full 
                            text-xs
                            mt-4 
                            py-1.5 
                            px-2.5
                            lg:mt-4 
                            lg:py-2
                            lg:px-4
                            lg:text-sm 
                            font-medium
                        "
                href="/signup"
              >
                {t('register')}
                <div className="flex items-center pl-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          ''
        )}

        {!active ? (
          <div className="  float-right cursor-pointer">
            <BsChevronCompactDown
              onClick={() => {
                setActive(true);
              }}
            />
          </div>
        ) : (
          <div className=" float-right cursor-pointer">
            <BsChevronCompactUp
              onClick={() => {
                setActive(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Programs() {
  const { t } = useTranslation('about-us');
  const programs = t('programs', { returnObjects: true }) as any[];

  const renderCards = programs.map((programm, index) => {
    return <Card programm={programm} key={index} />;
  });

  return (
    <div className=" lg:w-4/5 lg:grid lg:grid-cols-2 lg:gap-0.5 lg:auto-rows-[10px]">
      {renderCards}
    </div>
  );
}

export default Programs;
