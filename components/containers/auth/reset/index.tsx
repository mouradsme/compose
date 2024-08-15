import { useMessage } from '@/contexts/message';
import { resetPassword } from '@/lib/auth/login';
import { AxiosError } from 'axios';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { useState } from 'react';

const ResetPassword = () => {
  const { t } = useTranslation('reset');
  const [email, setEmail] = useState('');
  const { showMessage } = useMessage();

  const onSubmit = async () => {
    if (!email) {
      showMessage(t('validEmailError') as string, 'error');
      return;
    }
    try {
      await resetPassword(email);
      showMessage(t('passwordResetStarted'), 'success');
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

export default ResetPassword;
