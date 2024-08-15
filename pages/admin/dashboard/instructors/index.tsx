import { Instructor, UserSessionData } from '@/common/types/common';
import Instructors from '@/components/containers/admin/instructors';
import AdminLayout from '@/components/layouts/admin';
import { fetchInstructorsServer } from '@/lib/instructors';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';
import { ACCESS_TOKEN_NAME } from '@/common/config';

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  const user = JSON.parse(req.cookies[ACCESS_TOKEN_NAME] || '{}') as UserSessionData;
  const instructorsRes = await fetchInstructorsServer(user.accessToken);
  const instructors = instructorsRes?.data?.items;
  const totalRecords = instructorsRes.data.totalRecords;
  return {
    props: {
      instructors,
      totalRecords,
      ...(await serverSideTranslations(
        locale as string,
        ['common', 'supervisors'],
        nextI18NextConfig
      )),
    },
  };
};

interface PageProps {
  instructors: Instructor[];
  totalRecords: number;
}

const Page = ({ instructors, totalRecords }: PageProps) => {
  return (
    <>
      <Head>
        <title>Siine - Admin Instructors</title>
      </Head>
      <Instructors instructors={instructors || []} totalRecords={totalRecords} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
