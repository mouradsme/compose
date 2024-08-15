import white_siine_image from '@/public/images/Group 2105.png';
import Image from 'next/image';

const Payment = () => {
  return (
    <div className="flex flex-col h-64 w-3/12 gap-3  bg-[#2686FF] rounded-lg">
      <div className="px-5 py-5 flex flex-col gap-y-3">
        <Image
          className="flex self-end"
          width={50}
          height={25}
          src={white_siine_image.src}
          alt={'student'}
        />

        <div className="flex flex-col gap-2 pt-3">
          <p className="font-open-sans font-light  text-white text-sm">DESERVED AMOUNT</p>
          <p className="font-Poppins font-bold text-white text-md">1500.00 DZD</p>

          <p className="font-Poppins font-semibold text-white text-sm">High School / Month</p>
          <p className="font-Poppins font-light text-white text-sm">2 Year</p>
        </div>
        <div className="pt-3.5 flex justify-center">
          <div className="rounded-full w-38 flex justify-center self-center items-center w-11/12 h-10 cursor-pointer hover:bg-blue-400 bg-blue-300">
            <p className="font-open-sans font-bold text-white text-xs">Payment At : 12 - 04 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
