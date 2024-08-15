import { getSubscribtions } from '@/lib/subscribtions';
import { GetServerSideProps } from 'next';
import { Plan } from '@/common/types/common';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import Pricing from '@/components/containers/payments/pricing';
import { getUserInfoClient } from '@/lib/common';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const res = await getSubscribtions(locale || 'en');
  const subscribtions = res.data.items;
  return {
    props: {
      subscribtions,
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  subscribtions: Plan[];
}

const Page = ({ subscribtions }: PageProps) => {
  const { t } = useTranslation('plans');

  return (
    <>
      <Head>
        <title>Siine - Pricing</title>
      </Head>
      <div className="py-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-lg lg:text-2xl 2xl:text-3xl text-[#131B2B] font-bold">
            {t('choosePlan')}
          </div>
          <div className="text-sm lg:text-base 2xl:text-lg text-[#C1C2C5] font-[roboto]">
            {t('noContracts')}
          </div>
        </div>
        <Pricing plans={subscribtions} user={getUserInfoClient()} />
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
