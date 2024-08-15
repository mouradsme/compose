import ParentSection from '@/components/containers/student/supervisors/invite';
import StudentLayout from '@/components/layouts/student';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
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
        <title>Siine - Parents Invitations</title>
      </Head>
      <ParentSection />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <StudentLayout>{page}</StudentLayout>;
};

export default Page;
