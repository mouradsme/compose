import { useState } from 'react';
import pathIcon from '@/public/images/path.svg';
import Image from 'next/image';
import Link from 'next/link';
import { AdminLogins } from '@/common/types/common';
import { useRouter } from 'next/router';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

interface LoginProps {
  handleLogin: (admin: AdminLogins) => Promise<any>;
}

const AdminLogin = ({ handleLogin }: LoginProps) => {
  const { t } = useTranslation('login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showMessage } = useMessage();

  const onSubmit = async () => {
    const admin: AdminLogins = {
      email: email,
      password: password,
    };
    const signup = await handleLogin(admin);
    const { errors, message } = signup;
    if (errors) {
      showMessage(errors[0].message, 'error');
    } else if (message) {
      showMessage(message, 'success');
      const startTime = new Date().toISOString();
      localStorage.setItem('startTime', startTime);
      router.push('/admin/dashboard/courses/list');
    }
  };

  return (
    <div className="flex flex-row justify-center gap-2 pt-12 pb-3">
      <div className="w-full lg:w-4/12 flex flex-col items-center justify-center">
        <p className="font-semibold text-[#080940] text-sm lg:text-lg font-Poppins border-b border-[#4285F4] 2xl:text-xl">
          {t('administrationManagementCenter')}
        </p>
        <div className="w-7/12 lg:w-8/12 2xl:w-11/12 flex flex-col pt-10 gap-4">
          <div className="w-full">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('phoneUsernameEmail') as string}
              className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 rounded-lg text-xs sm:text-sm w-full"
            />
          </div>
          <div className="w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password') as string}
              className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 rounded-lg text-xs sm:text-sm w-full"
            />
          </div>
          <Button onClick={onSubmit} type="info">
            {t('logIntoAccount')}
          </Button>
        </div>
        <Link
          href="/reset-password"
          className="flex justify-center text-[#9B99AF] font-open-sans text-xs sm:text-sm font-light gap-2 pt-10"
        >
          <Image width={5} height={11} src={pathIcon.src} alt="path_icon" />
          {t('forgetPassword')}
        </Link>
      </div>

      <div className="hidden lg:w-4/12 min-h-fit bg-blue-500 item-center lg:block">
        <div className="grid grid-col justify-items-center gap-8 py-36">
          <div className="text-white font-light">
            <p className="text-white font-light text-2xl sm:text-xl">{t('facedTrouble')}</p>
          </div>
          <p className="text-white font-open-sans font-medium text-xl sm:text-lg">
            {t('contactSupport')}
          </p>
          <div className="hover:bg-blue-400 w-2/3 font-open-sans text-white text-sm cursor-pointer flex justify-center items-center border-2 rounded-lg py-3 mt-5">
            {t('getInTouch')}
          </div>
        </div>
        <div className="pt-74 grid grid-col justify-center text-white font-open-sans font-light pb-10">
          <p className="text-18">{t('supportAvailable')}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
