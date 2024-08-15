import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StudentLogin } from '@/common/types/common';
import { useRouter } from 'next/router';
import Image from 'next/image';
import pathIcon from '@/public/images/path.svg';
import { useTranslation } from 'next-i18next';
import { getUserInfoClient } from '@/lib/common';
import { useMessage } from '@/contexts/message';
import LoadingOverlay from '@/components/common/elements/loadingOverlay';

interface LoginProps {
  handleLogin: (student: StudentLogin) => Promise<any>;
  message: { message: string; type: string } | undefined;
}

const Login = ({ handleLogin, message }: LoginProps) => {
  const { t } = useTranslation('login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  useEffect(() => {
    setTimeout(() => {
      if (message?.type === 'success') {
        router.push('/dashboard/learning-paths');
      }
    }, 3000);
  }, [message, router]);

  const onSubmit = async () => {
    setLoading(true);
    let success = false;
    const student: StudentLogin = {
      email: email,
      password: password,
    };
    const login = await handleLogin(student);
    const { errors, message } = login;
    if (errors) {
      showMessage(errors?.[0].message, 'error');
    } else if (message) {
      showMessage(message, 'success');
      success = true;
      const startTime = new Date().toISOString();
      localStorage.setItem('startTime', startTime);
    }
    setTimeout(() => {
      const { authorities } = getUserInfoClient();
      if (success && authorities?.includes('ROLE_STUDENT')) {
        router.push('/dashboard/learning-paths');
      } else if (success && authorities?.includes('ROLE_ADMIN')) {
        router.push('/admin/dashboard/courses/list');
      }
    }, 3000);
    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-24 gap-4 items-center">
      {isLoading && <LoadingOverlay />}
      <div className="mb-20 text-center">
        <div className="text-4xl 2xl:text-5xl font-medium text-[#131B2B] ">{t('welcomeBack')}</div>
        <div className="text-[#9B99AF] text-sm 2xl:text-base font-[roboto]">
          {t('joinCommunity')}
        </div>
      </div>
      <div
        className="flex flex-col
                        lg:grid lg:grid-cols-2 
                        justify-center items-center  
                        lg:justify-around w-2/3
                        lg:w-1/2 gap-5 lg:gap-8"
      >
        <div className="w-full ">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder') as string}
            className=" border border-[#9B99AF] 
                        placeholder-[#9B99AF] 
                        py-3 px-4 2xl:py-3.5 2xl:px-5  
                        rounded-lg text-xs 2xl:text-lg w-full "
          />
        </div>
        <div className="w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded-lg text-xs 2xl:text-lg  w-full"
          />
        </div>
        <Link
          href="/reset-password"
          className="flex justify-start text-[#9B99AF] font-open-sans text-xs sm:text-sm font-light gap-2"
        >
          <Image width={5} height={11} src={pathIcon.src} alt="path_icon" />
          {t('forgotPassword')}
        </Link>
      </div>

      <div className="flex flex-col gap-6 lg:gap-4 w-full justify-center items-center text-white text-xs 2xl:text-base  font-[roboto]  ">
        <button
          className="cursor-pointer flex justify-center items-center 
                        bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] rounded-lg 2xl:rounded-xl py-4 lg:py-3  2xl:py-4 w-2/3 lg:w-1/3"
          onClick={onSubmit}
        >
          {t('loginButton')}
        </button>

        <Link
          href="/signup"
          className=" cursor-pointer flex justify-center items-center bg-[#273B54] 
                      text-white rounded-lg 2xl:rounded-xl py-4 lg:py-3 2xl:py-4  w-2/3 lg:w-1/3"
        >
          {t('createAccountButton')}
        </Link>
      </div>
      <div className=" lg:flex  justify-center items-center w-3/5 text-[#9B99AF] text-sm 2xl:text-base mb-5">
        {t('termsAgreement')}&nbsp;
        <span className="text-[#0F54EF]">{t('termsOfConditions')}</span>
      </div>
    </div>
  );
};

export default Login;
