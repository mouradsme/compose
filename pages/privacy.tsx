import { ReactElement } from 'react';
import DefaultLayout from '@/components/layouts/default';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '@/next-i18next.config.js';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ['home', 'common', 'header', 'privacy'],
      nextI18NextConfig
    )),
  },
});

const Page = ({}: any) => {
  const { t } = useTranslation('privacy');

  return (
    <>
      <Head>
        <title>Siine - Privacy</title>
      </Head>
      <div className="flex flex-col justify-center items-center mt-10 p-4">
        <div className="w-5/6 lg:w-2/3">
          <div className="text-center font-[Poppins] text-[#293B52] text-2xl 2xl:text-4xl font-black mb-6">
            <h1>{t('title')}</h1>
          </div>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('introduction.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('introduction.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('informationCollection.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('informationCollection.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('useOfInformation.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('useOfInformation.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('dataSecurityAndStorage.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('dataSecurityAndStorage.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('userRights.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('userRights.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('childrensPrivacy.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('childrensPrivacy.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('policyChanges.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('policyChanges.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('courseContentDisclaimer.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('courseContentDisclaimer.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('governingLaw.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('governingLaw.content')}
          </p>
          <h3 className="text-center text-base text-[#87969B] font-[Montserrat]">
            {t('contactInformation.title')}
          </h3>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            {t('contactInformation.content')}
          </p>
        </div>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
