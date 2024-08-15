import Categories from '@/components/containers/admin/courses/categories';
import AdminLayout from '@/components/layouts/admin';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'courses'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Courses Categories </title>
      </Head>
      <Categories />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
