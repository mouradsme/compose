import '@/styles/globals.css';
import { appWithTranslation, useTranslation } from 'next-i18next';

import { useEffect, type ReactElement, type ReactNode, useRef, useState } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { getUserInfoClient } from '@/lib/common';
import getProfile from '@/lib/profile/get';
import { setActivity } from '@/lib/profile';
import nextI18NextConfig from '@/next-i18next.config.js';
import ErrorBoundary from '@/components/common/elements/errors';
import { MessageProvider } from '@/contexts/message';
import LoadingOverlay from '@/components/common/elements/loadingOverlay';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [loading, setLoading] = useState(false);
  const heartbeatInterval = useRef<string | number | NodeJS.Timeout | undefined>(undefined);
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeLanguage = async () => {
      const user = getUserInfoClient();
      const token = user?.accessToken;
      if (token) {
        const response = await getProfile(token);
        if (response.ok) {
          const userLanguage = user.language;
          if (user.language !== i18n.language) {
            i18n?.changeLanguage(userLanguage.toLowerCase());
            const { pathname, asPath, query } = router;
            router.push({ pathname, query }, asPath, { locale: userLanguage.toLocaleLowerCase() });
            return;
          }
        }
      }
      const browserLanguage = 'ar';
      if (i18n?.languages.includes(browserLanguage)) {
        i18n?.changeLanguage(browserLanguage.toLocaleLowerCase());
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale: browserLanguage.toLocaleLowerCase() });
      }
    };

    initializeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const user = getUserInfoClient();
    if (!localStorage.getItem('startTime') && user?.email) {
      const startTime = new Date().toISOString();
      localStorage.setItem('startTime', startTime);
    }

    heartbeatInterval.current = setInterval(() => {
      sendHeartbeat();
    }, 5 * 60 * 1000);

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStart = (url: string) => url !== router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const sendHeartbeat = async () => {
    const startTime = localStorage.getItem('startTime');
    const endTime = new Date().toISOString();
    if (startTime) {
      try {
        setActivity(startTime, endTime);
      } catch (error) {
        console.error('Failed to send activity data:', error);
        return;
      }
      localStorage.removeItem('startTime');
      const newStartTime = new Date().toISOString();
      localStorage.setItem('startTime', newStartTime);
    }
  };

  const handleBeforeUnload = async () => {
    await sendHeartbeat();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      sendHeartbeat();
      clearInterval(heartbeatInterval.current);
    } else {
      heartbeatInterval.current = setInterval(() => {
        sendHeartbeat();
      }, 5 * 60 * 1000);
    }
  };

  return getLayout(
    <ErrorBoundary>
      <MessageProvider>
        <>
          {loading && <LoadingOverlay />}
          <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            <Component {...pageProps} />
            <Analytics />
            <SpeedInsights />
          </div>
        </>
      </MessageProvider>
    </ErrorBoundary>
  );
};

export default appWithTranslation(App as any, nextI18NextConfig);
