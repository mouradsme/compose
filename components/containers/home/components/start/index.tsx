import Loading from '@/components/common/elements/loading';
import { useTranslation } from 'next-i18next';

const StartNow = () => {
  const { t, ready } = useTranslation('home');

  if (!ready) {
    return <Loading />;
  }
  return (
    <section className="flex flex-col justify-around items-center bg-blue-500 py-10 h-[25vh]">
      <h3 className="text-lg min-[300px]:text-xl lg:text-4xl w-full min-[300px]:w-11/12 lg:w-2/3 2xl:w-1/3 font-medium text-white text-center mb-4 font-roboto">
        {t('start.getSuccessfulPath')}
      </h3>
      <button className="bg-[#FF6E00] font-semibold hover:bg-orange-600 text-white text-xs lg:text-base py-3 px-14 lg:py-3 lg:px-20 rounded-md">
        {t('start.tryItNow')}
      </button>
    </section>
  );
};

export default StartNow;
