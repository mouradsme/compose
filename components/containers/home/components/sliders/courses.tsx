import Loading from '@/components/common/elements/loading';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const SliderCourses = ({ items, currentIndex }: any) => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  const svgCorrectIcon = (
    <div className="w-3 h-3">
      <svg className="svg-icon" viewBox="0 0 20 20">
        <path
          fill="#4BB543"
          d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"
        ></path>
      </svg>
    </div>
  );

  const enrollButton = (
    <div className="flex items-center rounded-md mt-5">
      <Link
        href="/login"
        className=" bg-gradient-to-b from-[#FF8E02] to-[#FF6D00]
                            flex 
                            hover:bg-orange-700 
                            text-white text-sm font-bold 
                            py-2 px-10 
                            rounded-lg"
      >
        {t('sliders.enrollNow')}
      </Link>
    </div>
  );

  return (
    <div className="h-64 w-64 2xl:h-80 2xl:w-96 w-fit slider-item-container  ">
      {items?.map((item: any, index: any) => (
        <div
          key={index}
          className={`w-fit absolute slider-item   
                                ${
                                  index > currentIndex
                                    ? 'lg:translate-x-full'
                                    : 'lg:-translate-x-full'
                                }
                                ${index === currentIndex ? 'active' : ''} `}
        >
          <div className="w-fit text-sm  ">
            <div className="text-xl 2xl:text-3xl text-[#303D46] font-bold ">{item.title}</div>
            <div className="text-xs 2xl:text-sm text-[#87969B]  mb-2 font-semibold my-5 ">
              {t('sliders.selectCourseBenefits')}
            </div>
            {item.benifits?.map((benifit: any, idx: any) => {
              return (
                <div
                  key={idx}
                  className=" flex items-center gap-2 
                                text-xs 2xl:text-sm text-[#87969B] 
                                font-semibold capitalize mb-1"
                >
                  {svgCorrectIcon}
                  {benifit}
                </div>
              );
            })}

            <div className="text-xs 2xl:text-sm text-[#87969B]  mb-2 font-semibold  my-5 ">
              {t('sliders.selectCourseBenefits')}
            </div>
            {item.extraBenifits?.map((benifit: any, index: any) => {
              return (
                <div
                  key={index}
                  className=" flex items-center gap-2 
                                text-xs 2xl:text-sm text-[#87969B] 
                                font-semibold capitalize mb-1"
                >
                  {svgCorrectIcon}
                  {benifit}
                </div>
              );
            })}

            {enrollButton}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SliderCourses;
