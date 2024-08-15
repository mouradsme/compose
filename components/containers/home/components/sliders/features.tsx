import Image from 'next/image';
import Link from 'next/link';

import bg_features from '@/public/images/bg-features.svg';

import QuoteBox from '@/components/containers/home/components/quote/large';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

const SliderFeatures = ({ items, currentIndex }: any) => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="slider-container ">
      <div className="h-96 w-36 slider-item-container">
        {items.map((item: any, index: any) => (
          <div
            key={index}
            className={`w-full absolute slider-item 
                        ${index > currentIndex ? 'translate-x-full' : '-translate-x-full'}
                        
                        ${index === currentIndex ? 'active' : ''} `}
          >
            <div className="grid grid-cols-2 justify-between gap-12 content-center p-8 ">
              <div className="flex flex-col col-span-1">
                <div className="">
                  <Image
                    src={item.icon_small}
                    alt={item.title}
                    className="w-8 h-8 2xl:w-11 2xl:h-11 mr-2 inline"
                    width={100}
                    height={100}
                  />
                  <span className="inline text-md 2xl:text-lg text-[#283845] font-bold">
                    {item.header}
                  </span>
                </div>
                <h4 className="mt-4 w-3/4 text-2xl  text-[#283442] font-extrabold">
                  {t('sliders.findCourses')}
                </h4>
                <p
                  className=" mt-4                         
                              w-full
                              text-xs
                              text-[#87969B]
                              font-semibold"
                >
                  {item.description}
                  {item.description}
                </p>

                <Link
                  role="button"
                  className=" flex 
                              justify-around
                              w-fit 
                              bg-gradient-to-r 
                              from-[#0F54EF] 
                              to-[#2686FF]  
                              hover:bg-blue-500 
                              rounded-full 
                              mt-4 
                              px-3
                              py-2
                              text-xs 
                              text-white"
                  href="/"
                >
                  {t('sliders.learnMore')}
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

                <div className="mt-4  ">
                  <QuoteBox imageSrc={item.teacher.picture} text={item.teacher.bio} />
                </div>
              </div>

              <div
                style={{
                  backgroundImage: `url(${bg_features.src})`,
                  backgroundPosition: 'bottom center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                }}
              >
                <Image
                  src={item.picture}
                  alt={item.title}
                  className="mt-16 ml-4 2xl:ml-20 rounded"
                  width={430}
                  height={430}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderFeatures;
