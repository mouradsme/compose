import Image from 'next/image';
import golden_card from '@/public/images/golden-card.svg';
import cib from '@/public/images/cib.png';
import siine_card from '@/public/images/siine_card.svg';
import ccp_card from '@/public/images/ccp_card.svg';
import { Tick } from '@/components/Icons';
import { PaymentMethod, Plan } from '@/common/types/common';
import useRequest from '@/hooks/request';
import config, { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { registerPaymentSatim } from '@/lib/payments';
import ReCAPTCHA from 'react-google-recaptcha';
import { verifyCaptchaClient } from '@/lib/common';
import { useMessage } from '@/contexts/message';
import Link from 'next/link';

interface PaymentsMethodsProps {
  plan?: Plan;
}

const showCardByName = (name: string) => {
  if (name?.toLocaleLowerCase().includes('gold') || name?.toLocaleLowerCase().includes('dahab')) {
    return <Image width={28} height={18} src={golden_card.src} alt={golden_card.src} />;
  } else if (name?.toLocaleLowerCase().includes('siine')) {
    return <Image width={28} height={18} src={siine_card.src} alt={siine_card.src} />;
  }

  return <Image width={28} height={18} src={ccp_card.src} alt={ccp_card.src} />;
};

const showLinkByName = (name?: string) => {
  if (!name) {
    return;
  }

  if (name.toLocaleLowerCase().includes('gold') || name?.toLocaleLowerCase().includes('dahab')) {
    return 'gold';
  } else if (name.toLocaleLowerCase().includes('siine')) {
    return 'serial-number';
  }

  return 'ccp';
};

const PaymentsMethods = ({ plan }: PaymentsMethodsProps) => {
  const { t, i18n } = useTranslation('plans');
  const { showMessage } = useMessage();
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod | undefined>(undefined);
  const [accepted, setAccepted] = useState<boolean>(false);
  const [validCaptcha, setValidCaptcha] = useState<boolean | undefined>(false);
  const { data } = useRequest({
    url: plan?.id ? `${BACKEND_URL}/${URLS.methods.list}` : undefined,
  });

  const onMethodChange = (checked: boolean, method: PaymentMethod) => {
    if (checked) {
      setMethod(method);
      return;
    }
    setMethod(undefined);
  };

  const onMethodSelected = async (method: PaymentMethod) => {
    if (!plan || !method || !accepted || !validCaptcha) {
      showMessage(t<string>('plansRequiredFields'), 'error');
      return;
    }

    const lang = method.translations.find(
      (t) => t.language.toLocaleLowerCase() === i18n.language.toLocaleLowerCase()
    );

    if (!lang) {
      return;
    }
    if (
      lang.name.toLocaleLowerCase().includes('dahab') ||
      lang.name.toLocaleLowerCase().includes('gold')
    ) {
      const res = await registerPaymentSatim(plan.id, method.id);
      const { redirectUrl } = res.data;
      router.push(redirectUrl);
      return;
    }

    router.push(
      `/payments/${showLinkByName(lang.name)}?subscription=${plan.id}&method=${method.id}`
    );
  };

  const handleDisplayCibLogo = (method: PaymentMethod) => {
    if (!method) {
      return '';
    }

    const lang = method.translations.find((t) => t.language.toLocaleLowerCase() === 'en');

    if (!lang) {
      return '';
    }

    if (
      lang.name.toLocaleLowerCase().includes('dahab') ||
      lang.name.toLocaleLowerCase().includes('gold')
    ) {
      return <Image width={56} height={66} src={cib.src} alt={t('continuePaymentCheckout')} />;
    }
  };

  const onAccept = () => {
    if (accepted) {
      setAccepted(false);
    } else {
      setAccepted(true);
    }
  };

  const onCaptchaChange = async (token: string | null) => {
    if (!token) {
      return;
    }
    const res = await verifyCaptchaClient(token);

    if (res.status !== 200) {
      showMessage(t<string>('captchNotValid'), 'error');
      setValidCaptcha(false);
      return;
    }
    setValidCaptcha(true);
  };

  return (
    <>
      <div className="text-[#131B2B] text-center lg:text-left font-bold 2xl:tet-lg font-[roboto]">
        {t('checkoutPayment')}
      </div>

      <div className="flex justify-between items-center border-[1.5px] border-[#A5B4CB] rounded-lg bg-[#F7F9FC] my-4 p-4">
        <div className="flex items-center gap-2">
          <div className="text-[ff0000]">
            <Tick />
          </div>
          <div className="text-[#384364] text-xs 2xl:text-base font-[roboto] font-medium">
            {t('planSelected')}
          </div>
        </div>
        <div className="text-[#384364] text-xs 2xl:text-base font-bold">
          {plan?.translations[0].name}
        </div>
      </div>

      <div className="flex justify-center items-center text-xs  ">
        <div className="flex flex-col lg:flex-row justify-between gap-4 ">
          <div className="text-sm lg:text-xs text-center lg:text-left 2xl:text-base font-medium">
            {t('selectedPaymentMethod')}
          </div>
          <div className="flex flex-col gap-3 2xl:gap-4">
            {data?.items.map((method: PaymentMethod) => (
              <div
                key={method.id}
                className="flex gap-3 items-center lg:gap-1 2xl:gap-2 text-lg 2xl:text-base"
              >
                <input
                  type="radio"
                  name="card"
                  onChange={(event) => onMethodChange(event.target.checked, method)}
                />
                {showCardByName(method.translations[0].name)}
                {method.translations[0].name}
              </div>
            ))}
            <div className="flex gap-3 items-center lg:gap-1 2xl:gap-2 text-lg 2xl:text-base">
              <input type="checkbox" name="card" onChange={onAccept} />
              <Link target="_blank" href="/privacy">
                {t('acceptTermsOfUse')}
              </Link>
            </div>
            <ReCAPTCHA sitekey={config.RECAPTCHA_SITE_KEY} onChange={onCaptchaChange} />,
          </div>
        </div>
      </div>
      <div className="flex mt-6 flex-col-reverse lg:flex-col  ">
        {method ? (
          <button
            className="text-xs 2xl:text-lg text-white bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] rounded-lg 2xl:rounded-xl py-3 2xl:py-5 2xl:mt-5 flex flex-row justify-between content-center"
            onClick={() => onMethodSelected(method)}
          >
            <div className="flex-1"></div>
            <div className="flex-2 px-1">{t('continuePaymentCheckout')}</div>

            <div className="flex-1 flex flex-row justify-end">{handleDisplayCibLogo(method)}</div>
          </button>
        ) : (
          <button
            disabled
            className="text-xs 2xl:text-lg text-white rounded-lg 2xl:rounded-xl py-3 2xl:py-5 2xl:mt-5 bg-[#6B96E9]"
          >
            {t('continuePaymentCheckout')}
          </button>
        )}
      </div>
    </>
  );
};

export default PaymentsMethods;
