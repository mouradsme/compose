import { LOCALS } from '@/common/config';
import { PaymentMethodCreate } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useReducer } from 'react';

interface AddPaymentMethodState {
  currentLocale: string;
  translations: {
    language: string;
    name: string;
    description: string;
    details: Record<string, string>;
  }[];
}

const initialState: AddPaymentMethodState = {
  translations: [
    {
      language: 'EN',
      name: '',
      description: '',
      details: {},
    },
  ],
  currentLocale: 'EN',
};

enum ActionType {
  SET_NAME = 'SET_NAME',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_LOCALE = 'SET_LOCALE',
  ADD_TRANSLATION = 'ADD_TRANSLATION',
  SET_DETAILS = 'SET_DETAILS',
}

type Action = {
  type: ActionType;
  payload: any;
};

const addPaymentMethodReducer = (
  state: AddPaymentMethodState,
  action: Action
): AddPaymentMethodState => {
  const currentTranslationIndex = state.translations.findIndex(
    (tr) => tr.language === state.currentLocale
  );

  const updatedTranslations = [...state.translations];

  switch (action.type) {
    case ActionType.SET_NAME:
      updatedTranslations[currentTranslationIndex] = {
        ...updatedTranslations[currentTranslationIndex],
        name: action.payload,
      };
      return { ...state, translations: updatedTranslations };

    case ActionType.SET_DESCRIPTION:
      updatedTranslations[currentTranslationIndex] = {
        ...updatedTranslations[currentTranslationIndex],
        description: action.payload,
      };
      return { ...state, translations: updatedTranslations };

    case ActionType.SET_LOCALE:
      if (!state.translations.some((tr) => tr.language === action.payload)) {
        updatedTranslations.push({
          language: action.payload,
          name: '',
          description: '',
          details: {},
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };

    case ActionType.SET_DETAILS:
      updatedTranslations[currentTranslationIndex] = {
        ...updatedTranslations[currentTranslationIndex],
        details: {
          ...updatedTranslations[currentTranslationIndex].details,
          [action.payload.field]: action.payload.value,
        },
      };
      return { ...state, translations: updatedTranslations };

    default:
      return state;
  }
};

interface AddPaymentMethodProps {
  onSubmit: (paymentMethod: PaymentMethodCreate) => void;
  onCancel: () => void;
}

const AddPaymentMethod = ({ onSubmit, onCancel }: AddPaymentMethodProps) => {
  const [state, dispatch] = useReducer(addPaymentMethodReducer, initialState);
  const currentTranslation = state.translations.find((tr) => tr.language === state.currentLocale);
  const { t } = useTranslation('plans');

  return (
    <>
      <select
        onChange={(event) => dispatch({ type: ActionType.SET_LOCALE, payload: event.target.value })}
      >
        {LOCALS.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        value={currentTranslation?.name}
        onChange={(event) => dispatch({ type: ActionType.SET_NAME, payload: event.target.value })}
        placeholder={t('paymentMethodNamePlaceholder') as string}
      />
      <textarea
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        style={{ minHeight: '100px' }}
        value={currentTranslation?.description}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DESCRIPTION, payload: event.target.value })
        }
        placeholder={t('paymentMethodDescriptionPlaceholder') as string}
      />
      <div className="flex flex-row flew-wrap gap-4">
        <Button
          type="info"
          onClick={async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { currentLocale, ...paymentMethod } = state;
            await onSubmit(paymentMethod);
          }}
        >
          {t('save')}
        </Button>
        <Button type="neutral" onClick={onCancel}>
          {t('cancel')}
        </Button>
      </div>
    </>
  );
};

export default AddPaymentMethod;
