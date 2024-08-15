import Confirm from '@/components/containers/student/supervisors/confirm';
import DefaultLayout from '@/components/layouts/default';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'supervisors'],
        nextI18NextConfig
      )),
    },
  };
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Supervisor Invitation</title>
      </Head>
      <Confirm />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
