import { Plan } from '@/common/types/common';
import PlanCard from '@/components/common/cards/plan';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

interface PlansProps {
  onPlanClick?: (plan: Plan) => void;
  buttonText?: string;
  plans: Plan[];
}

const Plans = ({ plans, onPlanClick, buttonText = 'Select Your Plan' }: PlansProps) => {
  const { t } = useTranslation('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const onClick = (plan: Plan) => {
    if (!onPlanClick) {
      return;
    }
    onPlanClick(plan);
    setSelectedPlan(plan);
  };

  return (
    <>
      {plans?.length > 0 &&
        plans?.map((plan: Plan) => (
          <PlanCard key={plan.id} plan={plan} selected={selectedPlan?.id === plan.id}>
            <button
              className={`cursor-pointer text-xs 2xl:text-sm text-[#2686FF] border border-[#2686FF] rounded py-3 m-4 hover:text-white hover:bg-[#2686FF] ${
                selectedPlan?.id === plan.id ? 'bg-[#2686FF] text-white' : ''
              }`}
              onClick={() => onClick(plan)}
            >
              {t(buttonText)}
            </button>
          </PlanCard>
        ))}
    </>
  );
};

export default Plans;
