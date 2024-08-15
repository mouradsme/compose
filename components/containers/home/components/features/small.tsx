import Image from 'next/image';
import Link from 'next/link';
import QuoteBoxPhone from '@/components/containers/home/components/quote/small';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

const FeaturesPhone = ({ index, currentIndex, setCurrentIndex, feature }: any) => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <div
        className={`  flex px-5 py-3 mx-auto w-5/6 lg:full my-1 h-20 text-xs 2xl:text-md font-medium rounded-lg cursor-pointer  ${
          currentIndex !== index ? 'bg-[#97AAC8] ' : 'gradient-transition'
        }`}
        onClick={() => {
          setCurrentIndex(index);
        }}
      >
        <div className="flex items-center ">
          <Image
            src={feature.icon}
            alt={feature.title}
            className="w-7 h-7 2xl:w-9 2xl:h-9 mr-2"
            width={120}
            height={120}
          />
          <span className="text-white w-5/6 text-sm lg:text-lg 2xl:text-lg font-medium ">
            {feature.title}
          </span>
        </div>
      </div>
      {currentIndex === index && (
        <div className="mt-3 transition-all mx-auto w-11/12 duration-500 ease-in-out ">
          <div className="">
            <Image
              src={feature.icon_small}
              alt={feature.title}
              className="w-6 h-6 2xl:w-11 2xl:h-11 mr-2 inline"
              width={100}
              height={100}
            />
            <span className="inline text-sm lg:text-base 2xl:text-lg text-[#283845] font-bold">
              {feature.header}
            </span>
          </div>
          <h4 className="mt-4 text-lg text-[#283442] font-extrabold">
            {t('features.findCourses')}
          </h4>
          <p
            className=" mt-4                         
                        w-full
                        text-xs
                        text-[#87969B]
                        font-semibold"
          >
            {feature.description}
            {feature.description}
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
            {t('features.learnMore')}
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

          <div className="mt-10  ">
            <QuoteBoxPhone text={feature.teacher.bio} />
          </div>

          <Image
            src={feature.picture}
            alt={feature.title}
            className=" mt-10 rounded-lg "
            width={500}
            height={500}
          />
        </div>
      )}
    </>
  );
};

export default FeaturesPhone;
