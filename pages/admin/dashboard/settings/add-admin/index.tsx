import AddNewAdmin from '@/components/containers/admin/profile/new';
import AdminLayout from '@/components/layouts/admin';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'profile'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Add Admins </title>
      </Head>
      <AddNewAdmin />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
