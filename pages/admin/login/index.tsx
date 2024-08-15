import AdminLogin from '@/components/containers/admin/login';
import { AdminLogins } from '@/common/types/common';
import { singinAdminClient } from '@/lib/auth/login';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import { GetServerSideProps } from 'next';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'login'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  const handleLogin = async (admin: AdminLogins): Promise<any> => {
    const res = await singinAdminClient(admin);
    if (!res.ok) {
      console.log(res.status);
    }
    if (res.status === 400) {
      return await res.json();
    }
    return await res.json();
  };
  return (
    <>
      <Head>
        <title>Siine - Admin Login</title>
      </Head>
      <AdminLogin handleLogin={handleLogin} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
