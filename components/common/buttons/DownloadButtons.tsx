import Image from 'next/image';

import Apple_logo_grey from '@/public/images/Apple_logo_grey.svg';
import google_play from '@/public/images/google_play.svg';

const DownloadButtons = () => {
  return (
    <div className=" flex flex-col font-[Poppins] items-center gap-8 text-sm 2xl:text-lg mb-4 ">
      <div className="flex gap-3 shadow-[0_27px_17px_-25px_rgba(0,0,0,0.3)_inset] cursor-pointer rounded-full py-2 px-12 ">
        <Image
          src={google_play.src}
          alt={google_play.src}
          width={23}
          height={23}
          className={` hover:turn-white ${false ? ' turn-white' : ''}  `}
        />
        <div>
          <div className="text-[0.6rem] 2xl:text-xs ">ontdek het op</div>
          <div className="text-sm 2xl:text-base whitespace-nowrap">Google Play</div>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-[#7C8DA6] cursor-pointer rounded-full py-2 px-12 text-white ">
        <div className="">
          <Image
            src={Apple_logo_grey.src}
            alt={Apple_logo_grey.src}
            width={23}
            height={23}
            className={` hover:turn-white ${false ? ' turn-white' : ''}  `}
          />
        </div>
        <div>
          <div className="text-[0.6rem] 2xl:text-xs ">get on</div>
          <div className="text-sm 2xl:text-base whitespace-nowrap">Apple store</div>
        </div>
      </div>
    </div>
  );
};

export default DownloadButtons;
