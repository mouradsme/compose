import { ReactElement } from 'react';
import StudentLayout from '@/components/layouts/student';
import Subscribtions from '@/components/containers/student/payments/subscriptions';
import { getStudentSubscribtionsServer } from '@/lib/subscribtions';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { GetServerSideProps } from 'next';
import { StudentSubscription, UserSessionData } from '@/common/types/common';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
      user,
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  subscribtions: StudentSubscription[];
  totalRecords: number;
  user: UserSessionData;
}

const Page = ({ subscribtions, totalRecords, user }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Subscriptions {user.fullName} </title>
      </Head>
      <Subscribtions subscriptions={subscribtions} totalRecords={totalRecords} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
