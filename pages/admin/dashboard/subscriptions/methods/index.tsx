import Methods from '@/components/containers/admin/payments/methods';
import AdminLayout from '@/components/layouts/admin';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
  },
});

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Admin Payments Methods</title>
      </Head>
      <Methods />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Siine - Admin Payments Methods</title>
      </Head>
      <AdminLayout>{page}</AdminLayout>
    </>
  );
};

export default Page;
