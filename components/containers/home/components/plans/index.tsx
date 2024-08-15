import Link from 'next/link';
import Image from 'next/image';

import nav_logo from '@/public/images/nav_logo.svg';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';

const Plans = () => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }

  const plansList = t('plans.items', { returnObjects: true }) as any[];

  const correctIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#4bb543"
      className="bi bi-check text-green-200"
      viewBox="0 0 16 16"
    >
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
    </svg>
  );

  const wrongIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#fc100d"
      className="bi bi-x text-red-200"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );

  return (
    <div className="hidden lg:flex flex-col gap-2 items-center mt-10 2xl:mt-16 mb-10">
      <div className="w-2/3 flex flex-col gap-2 items-center">
        <div className=" text-2xl 2xl:text-4xl text-bold text-[#293B52] font-[Montserrat]">
          {t('plans.compareHeader')}
        </div>
        <div className=" text-xs 2xl:text-sm text-[#87969B] font-semibold w-4/5 2xl:w-3/4  text-center">
          {t('plans.description')}
        </div>

        <div className="shadow-md border-t border-gray-50 text-sm rounded-lg  flex justify-center w-full   py-10  p-10 mt-8 ">
          <div className="grid grid-cols-1 w-4/5 gap-4">
            <div className="grid grid-cols-3 ">
              <div className="pl-5"></div>
              <div className="flex items-center justify-center h-12 ">
                <Image width={100} height={100} alt={nav_logo.src} src={nav_logo.src} />
              </div>
              <div className="flex items-center justify-center font-[Montserrat] 2xl:text-lg font-bold text-[#737F8BAD]">
                {t('plans.otherPlatforms')}
              </div>
            </div>
            {plansList.map((item, index) => (
              <div key={index} className="grid grid-cols-3  ">
                <div className="mt-1 2xl:mt-3 text-[#87969B] font-bold text-xs 2xl:text-sm capitalize ">
                  {item}
                </div>
                <div className="mt-1 2xl:mt-3 flex items-center justify-center ">{correctIcon}</div>
                <div className="mt-1 2xl:mt-3 flex items-center justify-center ">{wrongIcon}</div>
              </div>
            ))}
            <div className="flex justify-around">
              <div className="flex items-center rounded-md mt-5">
                <Link
                  href="/login"
                  className=" bg-orange-500 
                              flex 
                              bg-gradient-to-b from-[#FF8E02] to-[#FF6D00]
                              text-white text-xs 2xl:text-sm font-medium
                              py-2 px-8 
                              rounded-md"
                >
                  {t('plans.tryNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
