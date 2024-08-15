import { ACCESS_TOKEN_NAME } from '@/common/config';
import { Admin, UserSessionData } from '@/common/types/common';
import Admins from '@/components/containers/admin/profile/list';
import AdminLayout from '@/components/layouts/admin';
import { getAdminsServer } from '@/lib/admins';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const resStudents = await getAdminsServer(user.accessToken);
  const admins = resStudents.data?.items;
  const totalRecords = resStudents.data.totalRecords;
  return {
    props: {
      admins,
      totalRecords,
      ...(await serverSideTranslations(locale as string, ['common', 'profile'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  admins: Admin[];
  totalRecords: number;
}

const Page = ({ admins, totalRecords }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admins List</title>
      </Head>
      <Admins admins={admins} totalRecords={totalRecords} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
