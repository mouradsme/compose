import SignUp from '@/components/containers/student/signup';
import { Level, StudentSignup, TagTypes, Wilaya } from '@/common/types/common';
import { registerStudentClient } from '@/lib/auth/register';
import { fetchWilayas, fetchCommunes } from '@/lib/wilayas';
import { fetchTags } from '@/lib/tags';
import DefaultLayout from '@/components/layouts/default';
import { ReactElement } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Head from 'next/head';

interface SignupPageProps {
  wilayas: Wilaya[];
  levels: Level[];
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const wilayasRes = await fetchWilayas();
  const partialWilayas = wilayasRes.data.items || [];
  const wilayasPromises = partialWilayas.map(async (wilaya: Wilaya) => {
    const _wilaya = wilaya;
    const res = await fetchCommunes(_wilaya.code);
    _wilaya.communes = res.data.items;
    return _wilaya;
  });

  const wilayas = await Promise.all<Wilaya>(wilayasPromises);

  const levelsRes = await fetchTags([TagTypes.LEVEL]);

  const levels = levelsRes.data.items;
  return {
    props: {
      wilayas,
      levels,
      ...(await serverSideTranslations(locale as string, ['common', 'signup'], nextI18NextConfig)),
    },
  };
};

const Page = ({ wilayas, levels }: SignupPageProps) => {
  const handleSignup = async (student: StudentSignup): Promise<any> => {
    const res = await registerStudentClient(student);
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
        <title>Siine - Signup</title>
      </Head>
      <SignUp handleSignup={handleSignup} wilayas={wilayas} levels={levels} />
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
