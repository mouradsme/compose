import { EyeClose, EyeOpen } from '@/components/Icons';
import { confirmResetPassword } from '@/lib/auth/login';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';
import { AxiosError } from 'axios';

const Confirm = () => {
  const { t } = useTranslation('reset');
  const { showMessage } = useMessage();
  const router = useRouter();
  const queryParams = new URLSearchParams(router.asPath.split('?')[1]);
  const token = queryParams.get('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async () => {
    console.log(email, password, token);
    if (!email || !token || !password) {
      showMessage(t('invalidInputError') as string, 'error');
      return;
    }
    try {
      await confirmResetPassword(email, password, token as string);
      showMessage(t('passwordResetSuccess'), 'success');
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.errors[0].message;
        showMessage(message, 'error');
      }
      return;
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="grid gap-8 w-1/3">
          <div className="text-2xl 2xl:text-4xl text-[#131B2B] font-bold">
            {t('resetPasswordTitle')}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder') as string}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded-lg text-xs 2xl:text-lg w-full "
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder') as string}
              className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5 rounded-lg text-xs 2xl:text-lg w-full"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOpen /> : <EyeClose />}
            </div>
          </div>
          <button
            onClick={onSubmit}
            disabled={!email}
            className="text-[0.7rem] text-white cursor-pointer flex justify-center items-center  bg-gradient-to-r from-[#0F54EF]
                      to-[#6B96E9] 
                      rounded-lg 
                      2xl:rounded-2xl
                      py-2
                      my-2 
                      2xl:text-base
                      2xl:py-4
                      w-full
                      font-[roboto]
                      "
          >
            {t('submit')}
          </button>
          <Link
            href="/login"
            className=" text-[0.7rem]
                      2xl:text-base
                      text-[#2686FF]
                      cursor-pointer 
                      text-center 
                      underline 
                      w-full
                      font-[roboto]
                      "
          >
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Confirm;
