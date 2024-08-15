import DefaultLayout from '@/components/layouts/default';
import Head from 'next/head';
import { ReactElement } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '@/next-i18next.config.js';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['home', 'common', 'header'], nextI18NextConfig)),
  },
});

const Page = () => {
  return (
    <>
      <Head>
        <title>Siine - Terms</title>
      </Head>
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="w-5/6 lg:w-2/3">
          <div className="text-center font-[Poppins] text-[#293B52] text-2xl 2xl:text-4xl font-black mb-6">
            <h1 className="text-center text-base text-[#87969B] font-[Montserrat]">
              Terms of Service
            </h1>
          </div>
          <p className="text-center text-base text-[#87969B] font-[Montserrat] font-medium mb-6">
            Last updated: September 22, 2023 This Terms of Service outlines the rules and
            regulations for the use of Our Service. By accessing this website we assume you accept
            these terms and conditions in full. Do not continue to use our Service if you do not
            accept all of the terms and conditions stated on this page.
          </p>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            The following terminology applies to these Terms of Service: “Client”, “You” and “Your”
            refers to you, the person accessing this Service. “The Company”, “Ourselves”, “We”,
            “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the
            Client and ourselves, or either the Client or ourselves.
          </p>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            All terms refer to the offer, acceptance, and consideration of payment necessary to
            undertake the process of our assistance to the Client in the most appropriate manner,
            whether by formal meetings of a fixed duration, or any other means, for the express
            purpose of meeting the Client’s needs in respect of provision of the Company’s stated
            services, in accordance with and subject to, prevailing law.
          </p>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            Any use of the above terminology or other words in the singular, plural, capitalization
            and/or he/she or they, are taken as interchangeable and therefore as referring to same.
          </p>
          <p className="text-center text-[#757575] font-[Montserrat] font-medium mb-6">
            We employ the use of cookies. By using our Service you consent to the use of cookies in
            accordance with our Privacy Policy.
          </p>
          <div className="text-center font-[Poppins] text-[#293B52] text-2xl 2xl:text-4xl font-black mb-6">
            Contact Us
          </div>
          <p className="text-center text-base text-[#87969B]  font-[Montserrat] font-medium">
            If you have any questions about these Terms of Service, You can contact us: By email:
            contact@siinedz.com
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
