import { Plan, SerialNumberCreate, Tag } from '@/common/types/common';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import { useReducer } from 'react';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { getUserInfoClient } from '@/lib/common';

interface AddSerialNumberState {
  quantity: number | undefined;
  expireAfterDays: number | undefined;
  subscriptionPlanId: string | undefined;
}

const initialState: AddSerialNumberState = {
  quantity: undefined,
  expireAfterDays: undefined,
  subscriptionPlanId: undefined,
};

enum ActionType {
  SET_QUANTITY = 'SET_QUANTITY',
  SET_EXPIRE_AFTER_DAYS = 'SET_EXPIRE_AFTER_DAYS',
  SET_PLAN_ID = 'SET_PLAN_ID',
}

type Action = {
  type: ActionType;
  payload: any;
};

const addSerialNumberReducer = (
  state: AddSerialNumberState,
  action: Action
): AddSerialNumberState => {
  switch (action.type) {
    case ActionType.SET_QUANTITY: {
      return {
        ...state,
        quantity: action.payload,
      };
    }
    case ActionType.SET_EXPIRE_AFTER_DAYS: {
      return {
        ...state,
        expireAfterDays: action.payload,
      };
    }
    case ActionType.SET_PLAN_ID: {
      return {
        ...state,
        subscriptionPlanId: action.payload,
      };
    }
    default:
      return state;
  }
};

interface AddProps {
  onSubmit: (serialNumber: SerialNumberCreate) => void;
  onCancel: () => void;
  plans: Plan[];
}

const Add = ({ onCancel, onSubmit, plans }: AddProps) => {
  const user = getUserInfoClient();
  const { t } = useTranslation('plans');
  const [state, dispatch] = useReducer(addSerialNumberReducer, initialState);

  return (
    <>
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_QUANTITY, payload: event.target.value })
        }
        placeholder={t('serialNumbersQuantity') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_EXPIRE_AFTER_DAYS, payload: event.target.value })
        }
        placeholder={t('expireAfterDays') as string}
      />
      <AutoCompleteInput
        onChange={(value) => dispatch({ type: ActionType.SET_PLAN_ID, payload: value.id })}
        data={plans}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
        valueKey={'name'}
        valueId={'id'}
        placeholder={t('subscriptionPlan')}
        type={'text'}
        name={'subscription plan'}
        disabled={false}
        getDisplayValue={(tag: Tag) =>
          tag?.translations?.find((t) => t.language === user.language)?.name || ''
        }
      />
      <div className="flex flex-row flew-wrap gap-4">
        <Button
          onClick={async () => {
            await onSubmit(state as SerialNumberCreate);
          }}
          type="info"
        >
          {t('save')}
        </Button>
        <Button onClick={onCancel} type="neutral">
          {t('cancel')}
        </Button>
      </div>
    </>
  );
};

export default Add;
