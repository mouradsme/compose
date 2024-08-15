import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Plan, SerialNumber, UserSessionData } from '@/common/types/common';
import SerialNumbers from '@/components/containers/admin/serial-numbers';
import AdminLayout from '@/components/layouts/admin';
import { fetchSerialNumbersServer } from '@/lib/serials';
import { getSubscribtions } from '@/lib/subscribtions';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const serialsRes = await fetchSerialNumbersServer(user.accessToken);
  const serials = serialsRes?.data?.items;
  const totalRecords = serialsRes.data.totalRecords;
  const plansRes = await getSubscribtions(user.language);
  const plans = plansRes?.data?.items;

  return {
    props: {
      serials,
      totalRecords,
      plans,
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  serials: SerialNumber[];
  totalRecords: number;
  plans: Plan[];
}

const Page = ({ serials, totalRecords, plans }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Serial Numbers </title>
      </Head>
      <SerialNumbers serials={serials || []} totalRecords={totalRecords} plans={plans} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
