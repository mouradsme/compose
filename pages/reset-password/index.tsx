import Reset from '@/components/containers/auth/reset';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'reset'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Reset Password</title>
      </Head>
      <Reset />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
