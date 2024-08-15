import Ccp from '@/components/containers/payments/methods/ccp';
import DefaultLayout from '@/components/layouts/default';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { subscription, method } = query;

  return {
    props: {
      subscription,
      method,
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  subscription: string;
  method: string;
}

const Page = ({ subscription, method }: PageProps) => {
  const { t } = useTranslation('plans');
  return (
    <>
      <Head>
        <title>Siine - CCP Payment</title>
      </Head>
      <div className="py-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-lg lg:text-2xl 2xl:text-3xl text-[#131B2B] font-bold">
            {t('uploadReceipt')}
          </div>
          <div className="text-sm lg:text-base 2xl:text-lg text-[#C1C2C5] font-[roboto] ">
            {t('noContracts')}
          </div>
        </div>
        <Ccp subscription={subscription} method={method} />
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
