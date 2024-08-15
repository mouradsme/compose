import Plans from '@/components/common/elements/plans';
import PaymentsMethods from '../methods';
import { Plan, UserSessionData } from '@/common/types/common';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSubscribtions } from '@/lib/subscribtions';
import { getUserInfoClient } from '@/lib/common';

interface PricingProps {
  plans: Plan[];
  user: UserSessionData;
}

const Pricing = ({ plans, user }: PricingProps) => {
  const router = useRouter();
  const [pricingPlans, setPricingPlans] = useState(plans);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(undefined);
  const [username, setUsername] = useState('');

  const onPlanClick = (plan: Plan) => {
    if (!plan) {
      return;
    }
    if (!username) {
      router.push('/login');
      return;
    }
    setSelectedPlan(plan);
  };

  useEffect(() => {
    setUsername(user.fullName);
  }, [user]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!plans?.length) {
        return;
      }
      const user = getUserInfoClient();
      const language = user?.language || 'ar';
      const plansLang = plans[0].translations[0].language;
      if (language !== plansLang) {
        const res = await getSubscribtions(language || 'en');
        const newPlans = res.data.items;
        setPricingPlans(newPlans);
      }
    };

    fetchPlans();
  }, [plans]);

  return (
    <>
      <div className="flex mt-10 justify-center items-center">
        <div className="flex flex-row flex-wrap gap-4 justify-center justify-items-center w-full 2xl:w-4/5">
          <Plans plans={pricingPlans} onPlanClick={onPlanClick} />
        </div>
      </div>
      {selectedPlan && (
        <div className="flex mt-20 justify-center items-center">
          <div className="w-4/5 xl:w-3/5">
            <div className="flex flex-col p-4 gap-6 justify-center items-center ">
              <div className="w-full lg:w-2/3">
                <PaymentsMethods plan={selectedPlan} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pricing;
