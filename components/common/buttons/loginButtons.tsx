import google from '@/public/images/google.svg';
import facebook from '@/public/images/facebook.svg';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { useTranslation } from 'next-i18next';

const LoginButtons = ({ flex }: any) => {
  const { t } = useTranslation('common');
  const [googleUrl, setGoogleUrl] = useState<string | undefined>();
  const [facebookUrl, setFacebookUrl] = useState<string | undefined>();

  useEffect(() => {
    const origin = window.location.origin;
    const googleUrl = `${BACKEND_URL}/${URLS.oauth2.google}?redirect_uri=${origin}/login`;
    const facebookUrl = `${BACKEND_URL}/${URLS.oauth2.facebook}?redirect_uri=${origin}/login`;
    setGoogleUrl(googleUrl);
    setFacebookUrl(facebookUrl);
  }, []);

  return (
    <>
      <div className={`w-full ${flex ? '' : ' rounded-2xl shadow-lg mb-3 '} bg-white`}>
        <Link
          className={`w-full 
                      flex items-center justify-center    
                      whitespace-nowrap	text-black
                      ${flex ? 'border text-xs' : 'border-2 text-sm'} 
                      border-black  
                      text-sm
                      2xl:text-lg
                      font-bold rounded-xl 
                      py-4 px-10
                      md:py-3 md:px-10
                      
                      `}
          href={googleUrl || ''}
          target="_blank"
        >
          <Image alt={facebook.src} width={60} height={60} src={google.src} className="mr-2 w-5" />
          {t('continueWithGoogle')}
        </Link>
      </div>
      <div className={`w-full ${flex ? '' : ' rounded-2xl shadow-lg  mb-3'} bg-white`}>
        <Link
          className={`w-full 
                      flex items-center justify-center    
                      whitespace-nowrap	text-black
                      ${flex ? 'border text-xs' : 'border-2 text-sm'} 
                      border-black  
                      text-sm
                      2xl:text-lg
                      font-bold rounded-xl 
                      py-4 px-10
                      md:py-3 md:px-10
                      
                      `}
          href={facebookUrl || ''}
          target="_blank"
        >
          <Image
            alt={facebook.src}
            width={60}
            height={60}
            src={facebook.src}
            className="mr-2 w-5"
          />
          {t('continueWithFacebook')}
        </Link>
      </div>
    </>
  );
};

export default LoginButtons;
