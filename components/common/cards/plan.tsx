import { Plan } from '@/common/types/common';
import { Checked } from '@/components/Icons';
import { useTranslation } from 'next-i18next';

interface PlansCardProps {
  plan: Plan;
  children: JSX.Element;
  selected?: boolean;
}

const PlanCard = ({ plan, children, selected = false }: PlansCardProps) => {
  const { t } = useTranslation('plans');
  const _plan =
    plan.translations.find((t) => t.language.toLowerCase() === 'en') || plan.translations[0];
  if (!_plan) {
    return <></>;
  }
  return (
    <div
      className={`flex flex-col p-4 rounded-lg gap-3 2xl:gap-4 md:min-w-[300px] md:max-w-[300px] xl:min-w-[400px] xl:max-w-[450px] ${
        selected ? 'border-t-8 border-l-2 border-r-2 border-[#2686FF]' : 'border border-[#CCCED2]'
      }`}
    >
      <div
        className={
          'mt-3 text-2xl 2xl:text-3xl text-[#384364] font-extrabold break-words whitespace-normal'
        }
      >
        {_plan?.name}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-base text-wrap 2xl:text-lg text-[#3C3F46] font-bold">{t('price')}</div>
        <div className="text-md 2xl:w-10/12 text-[#4A5460] font-medium">
          {plan.price} {t('dzd')}
        </div>
      </div>

      <div className="text-base text-wrap 2xl:text-lg text-[#3C3F46] font-bold break-words">
        {t('planIncludes')}
      </div>
      <div className="text-xs 2xl:text-sm 2xl:w-10/12 text-[#4A5460] font-medium break-words whitespace-normal">
        {_plan?.description}
      </div>
      <div className="flex flex-col flex-grow gap-3 2xl:gap-4">
        {_plan?.features.map((feature: string) => {
          return (
            <div
              className="flex items-center text-[#3C3F46] text-xs 2xl:text-sm gap-2 font-[Poppins] font-medium break-words whitespace-normal"
              key={feature}
            >
              <div>
                <Checked />
              </div>
              {feature}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export default PlanCard;
