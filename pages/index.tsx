import Login from '@/components/containers/student/login';
import { Profile, StudentLogin, UserSessionData } from '@/common/types/common';
import { singinStudentClient } from '@/lib/auth/login';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import getProfile from '@/lib/profile/get';
import { GetServerSideProps } from 'next';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ query, res, locale }) => {
  const { token } = query as { token: string };
  if (!token) {
    return {
      props: {
        message: { message: '', type: '' },
        ...(await serverSideTranslations(locale as string, ['common', 'login'], nextI18NextConfig)),
      },
    };
  }
  const profileRes = await getProfile(token);
  if (!profileRes.ok) {
    return {
      props: {
        message: { message: 'Someting went wrong, could not login', type: 'error' },
        ...(await serverSideTranslations(locale as string, ['common', 'login'], nextI18NextConfig)),
      },
    };
  }
  const profile: Profile = await profileRes.json();
  const user: UserSessionData = {
    accessToken: token,
    fullName: profile.fullName,
    email: profile.email,
    language: 'EN',
    phoneNumber: profile.phoneNumber,
    authorities: ['ROLE_STUDENT'],
  };
  res.setHeader(
    'Set-Cookie',
    `${ACCESS_TOKEN_NAME}=${JSON.stringify(user)}; SameSite=Strict; Path=/`
  );
  return {
    props: {
      message: {
        message: 'Successfully logged in! Redirecting you to the dashboard shortly.',
        type: 'success',
      },
      ...(await serverSideTranslations(locale as string, ['common', 'login'], nextI18NextConfig)),
    },
  };
};

interface PageProps {
  message: { message: string; type: string } | undefined;
}

const Page = ({ message }: PageProps) => {
  const handleLogin = async (student: StudentLogin): Promise<any> => {
    const res = await singinStudentClient(student);
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
        <title>Siine - Login</title>
      </Head>
      <Login handleLogin={handleLogin} message={message} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
