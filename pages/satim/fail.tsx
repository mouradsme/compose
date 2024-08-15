import DefaultLayout from '@/components/layouts/default';
import Head from 'next/head';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { FaTimesCircle } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  const { t } = useTranslation('plans');

  return (
    <>
      <Head>
        <title>Siine - Dahabiya Payment Failure</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#445158] text-sm 2xl:text-2xl font-semibold flex flex-col gap-4">
          <div className="mb-6 flex items-center justify-center">
            <FaTimesCircle className="text-4xl text-red-500" />
          </div>

          <p>{t('satimVerificationFailedMessage')}</p>
        </div>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
