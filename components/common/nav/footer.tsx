import { FooterLogo } from '@/components/Icons';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full flex flex-col md:flex-row text-xs text-white bg-blue-500 justify-between items-center gap-10 p-4 2xl:p-6">
      <FooterLogo />
      <div className="2xl:text-lg">{t('footer.rights')}</div>
      <div className="2xl:text-lg">{t('footer.email')}</div>
    </div>
  );
};

export default Footer;
