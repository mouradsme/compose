import { ACCESS_TOKEN_NAME } from '@/common/config';
import { StudentSubscription, UserSessionData } from '@/common/types/common';
import Subscribtions from '@/components/containers/admin/payments/subscribtions';
import AdminLayout from '@/components/layouts/admin';
import { getStudentSubscribtionsServer } from '@/lib/subscribtions';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const resSub = await getStudentSubscribtionsServer(user.accessToken);
  const subscribtions = resSub.data.items;
  const totalRecords = resSub.data.totalRecords;
  return {
    props: {
      subscribtions,
      totalRecords,
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  subscribtions: StudentSubscription[];
  totalRecords: number;
}
const Page = ({ subscribtions, totalRecords }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Subscriptions </title>
      </Head>
      <Subscribtions subscriptions={subscribtions} totalRecords={totalRecords} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
