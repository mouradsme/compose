import React, { useReducer } from 'react';
import { LOCALS } from '@/common/config';
import { PaymentMethod } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';

interface UpdatePaymentMethodState extends PaymentMethod {
  currentLocale: string;
}

const initialState: UpdatePaymentMethodState = {
  id: '',
  translations: [
    {
      id: '',
      language: 'EN',
      name: '',
      description: '',
      details: {},
    },
  ],
  createdAt: '',
  updatedAt: '',
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

const updatePaymentMethodReducer = (
  state: UpdatePaymentMethodState,
  action: Action
): UpdatePaymentMethodState => {
  const currentTranslationIndex = state.translations.findIndex(
    (tr) => tr.language === state.currentLocale
  );

  const updatedTranslations = [...state.translations];

  switch (action.type) {
    case ActionType.SET_NAME:
      updatedTranslations[currentTranslationIndex].name = action.payload;
      return { ...state, translations: updatedTranslations };

    case ActionType.SET_DESCRIPTION:
      updatedTranslations[currentTranslationIndex].description = action.payload;
      return { ...state, translations: updatedTranslations };

    case ActionType.SET_LOCALE:
      if (!state.translations.some((tr) => tr.language === action.payload)) {
        updatedTranslations.push({
          id: '',
          language: action.payload,
          name: '',
          description: '',
          details: {},
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };

    default:
      return state;
  }
};

interface UpdatePaymentMethodProps {
  onSubmit: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
  onDelete?: (paymentMethod: PaymentMethod) => void;
  paymentMethod: PaymentMethod;
}

const setState = (paymentMethod: PaymentMethod) => {
  if (!paymentMethod) return initialState;
  return { ...paymentMethod, currentLocale: paymentMethod.translations[0].language };
};

const UpdatePaymentMethod = ({
  onSubmit,
  onCancel,
  onDelete,
  paymentMethod,
}: UpdatePaymentMethodProps) => {
  const { t } = useTranslation('plans');
  const [state, dispatch] = useReducer(updatePaymentMethodReducer, setState(paymentMethod));
  const currentTranslation = state.translations.find((tr) => tr.language === state.currentLocale);

  return (
    <>
      <select
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        value={state.currentLocale}
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
        <Button type="info" onClick={async () => await onSubmit(state)}>
          {t('save')}
        </Button>
        {onDelete && (
          <Button type="danger" onClick={async () => await onDelete(state)}>
            {t('delete')}
          </Button>
        )}
        <Button type="neutral" onClick={onCancel}>
          {t('cancel')}
        </Button>
      </div>
    </>
  );
};

export default UpdatePaymentMethod;
