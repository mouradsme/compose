import { createPaymentSerialNumber } from '@/lib/payments';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

interface SerialNumbersProps {
  method: string;
}

const SerialNumbers = ({ method }: SerialNumbersProps) => {
  const { t } = useTranslation('plans');
  const { showMessage } = useMessage();
  const [serialNumber, setSerialNumber] = useState('');
  const router = useRouter();

  const onSubmit = async () => {
    if (!serialNumber) {
      return;
    }

    try {
      const res = await createPaymentSerialNumber(serialNumber, method);
      if (res.status === 200) {
        showMessage(t('paymentSuccessRedirect') as string, 'success');
        router.push('/dashboard/learning-paths');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.errors[0]?.message;
      showMessage(errorMessage || err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full  mt-10 2xl:mt-20">
      <div className="flex flex-col gap-4 2xl:gap-16  lg:w-1/3 p-2 font-[Poppins]">
        <input
          className="bg-[#FAFAFC] px-2 py-2 2xl:py-8 rounded-lg w-full h-10 placeholder-[#364067] placeholder:text-[0.7rem] 2xl:placeholder:text-base placeholder:text-center"
          placeholder={t('typeYourNumber') as string}
          onChange={(event) => setSerialNumber(event.target.value)}
        />

        <div className="flex justify-center ">
          <button
            onClick={onSubmit}
            className="text-[0.7rem] 2xl:text-base text-white cursor-pointer bg-gradient-to-b lg:bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] rounded-lg 2xl:rounded-xl py-3 my-3 lg:py-2 lg:my-2 2xl:py-3 2xl:my-3 w-2/3 lg:w-full font-[roboto]"
          >
            {t('validateSerialNumber')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SerialNumbers;
