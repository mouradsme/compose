import DefaultLayout from '@/components/layouts/default';
import { verifyPaymentSatim } from '@/lib/payments';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import nextI18NextConfig from '@/next-i18next.config.js';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';
import { FaTimesCircle } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common', 'plans'], nextI18NextConfig)),
    },
  };
};

const Page = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [status, setStatus] = useState<'LOADING' | 'FAILED' | 'VERIFIED' | undefined>(undefined);
  const { t } = useTranslation('plans');

  useEffect(() => {
    if (orderId && typeof orderId === 'string') {
      setStatus('LOADING');
      verifyPaymentSatim(orderId)
        .then((data) => {
          const { orderStatus } = data.data;
          if (orderStatus === 'REJECTED') {
            setStatus('FAILED');
          } else {
            setStatus('VERIFIED');
          }
        })
        .catch(() => {
          setStatus('FAILED');
        });
    }
  }, [orderId]);

  if (status === 'VERIFIED') {
    router.push('/learning-paths');
  }

  return (
    <>
      <Head>
        <title>Siine - Dahabiya Payment Verfication</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#445158] text-sm 2xl:text-2xl font-semibold flex flex-col gap-4">
          {(status === undefined || status === 'LOADING') && (
            <>
              <div className="mb-6">
                <Loading height="h-0" />
              </div>

              <p>{t('satimPleaseWaitMessage')}</p>
            </>
          )}
          {status === 'FAILED' && (
            <>
              <div className="mb-6 flex items-center justify-center">
                <FaTimesCircle className="text-4xl text-red-500" />
              </div>

              <p>{t('satimVerificationErrorMessage')}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default Page;
