import { Supervisor } from '@/common/types/common';
import mask_group_image from '@/public/images/groupMask.svg';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface ParentProps {
  supervisor: Supervisor;
}
const Parent = ({ supervisor }: ParentProps) => {
  const { t } = useTranslation('students');

  return (
    <div className="flex flex-col justify-center items-center h-64 w-3/12 gap-3  bg-[#F7F8FA] rounded-lg">
      <div className="px-5 py-5 flex flex-col gap-y-2">
        <p className="font-Poppins font-semibold text-black text-sm">{t('supervisorAccount')}</p>
        <div className="w-12 h-12 bg-[#f2f4f8] flex justify-center items-center rounded-full">
          <Image width={80} height={80} src={mask_group_image.src} alt={'student'} />
        </div>

        <p className="font-Poppins font-semibold text-[#273B54] text-sm">{supervisor.fullName} </p>
        <div className="pt-3 flex flex-col justify-center items-center gap-y-1 ">
          <p className="font-Poppins font-normal text-[#273B54] text-sm">
            {t('contactInformation')}
          </p>
          <p className="font-Poppins font-normal text-[#7C8DA6] text-xs">{supervisor.email}</p>
          <p className="font-Poppins font-normal text-[#7C8DA6] text-xs">
            {supervisor.phoneNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Parent;
