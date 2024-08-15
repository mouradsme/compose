import image from '@/public/images/all.svg';

import l_svg from '@/public/images/l_svg.svg';
import r_svg from '@/public/images/r_svg.svg';
import { HOME_PAGE_THUMBNAIL_VIDEO } from '@/common/config';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';
import { Video } from '@/components/common/elements/videoFrame';

function Hero() {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  return (
    <div className="bg-white py-12 w-full " style={{ backgroundImage: `url(${image.src})` }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8  ">
        <div className="flex flex-col justify-center items-center  ">
          <div className="text-center sm:w-10/12 lg:w-1/2 2xl:w-5/6  ">
            <h1
              className={` text-xl lg:text-4xl 2xl:text-6xl font-bold 
                            text-[#293B52] [&>span]:text-[#0F54EF]
                            font-[Montserrat]
                        `}
            >
              <span>{t('hero.header.prefix')}</span> {t('hero.header.mainText')}
            </h1>

            <div className=" flex justify-center mt-4 text-xs 2xl:text-sm text-[#A0ACBC] ">
              <div className="w-2/3 lg:w-full text-center">{t('hero.description')}</div>
            </div>
          </div>
        </div>
        <div className="relative ">
          <div className="hidden lg:flex 2xl:gap-26 justify-around ">
            <div
              className="w-1/3 h-96 2xl:w-1/2 2xl:h-[28rem] "
              style={{
                backgroundImage: `url(${l_svg.src})`,
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            ></div>

            <div
              className="w-1/3 h-96 2xl:w-1/2 2xl:h-[28rem] "
              style={{
                float: 'right',
                backgroundImage: `url(${r_svg.src})`,
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
            ></div>
          </div>

          <div className="lg:absolute w-full inset-0 lg:top-1/4   mt-10 lg:mt-0  min-[300px]:h-64 max-[700px]:h-64 min-[700px]:h-96 max-[1024px]:h-96 ">
            <div className="w-full md:w-3/5 lg:w-3/5 mx-auto h-5/6  2xl:w-3/5  ">
              <Video
                src={HOME_PAGE_THUMBNAIL_VIDEO}
                onEnded={() => console.log('video finished')}
              />
            </div>
          </div>
          <div className="flex justify-center lg:mt-14 2xl:mt-36 text-center  ">
            <div className="text-sm w-3/4 lg:w-full 2xl:text-md font-bold text-[#283845] text-gray-900">
              {t('hero.contentDescription')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
