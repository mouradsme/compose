import Questions from '@/components/containers/admin/questions/list';
import AdminLayout from '@/components/layouts/admin';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'quizzes'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>Siine - Admins Quizze Management </title>
      </Head>
      <Questions quizId={id as string} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
