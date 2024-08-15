import Image from 'next/image';

import user_avatar_svg from '@/public/images/user-avatar.svg';
import { Student } from '@/common/types/common';
import { useTranslation } from 'next-i18next';

interface ProfileProps {
  student: Student;
}
const Profile = ({ student }: ProfileProps) => {
  const { t } = useTranslation('profile');
  return (
    <div className="flex justify-center ">
      <div
        className={
          'flex flex-col gap-3 items-center bg-[#F7F8FA] w-11/12 lg:w-full rounded-lg px-10 2xl:px-14 2xl:py-8 py-6 text-[0.55rem] h-fit  '
        }
      >
        <Image
          width={65}
          height={65}
          src={'https://picsum.photos/600'}
          alt={user_avatar_svg.src}
          className="rounded-full"
        />
        <div className="flex flex-col items-center  gap-1">
          <div className="font-medium text-[#273B54] text-xs 2xl:text-base ">
            {student.fullName}
          </div>
        </div>
        <div className="text-[#273B54] 2xl:text-xs font-semibold font-[Poppins] ">
          {t('contactInformation')}
        </div>

        <div className="flex flex-col text-[#7C8DA6] 2xl:text-xs items-center gap-0.5">
          <div>{student.email}</div>
          <div>{student.phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
