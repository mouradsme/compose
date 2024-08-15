import React, { useReducer } from 'react';
import { LOCALS } from '@/common/config';
import { Plan } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'react-i18next';

interface UpdatePlanState extends Plan {
  currentLocale: string;
}

const initialState: UpdatePlanState = {
  id: '',
  translations: [
    {
      id: '',
      language: 'EN',
      name: '',
      description: '',
      features: [''],
    },
  ],
  price: 0,
  durationInDays: 0,
  currentLocale: 'EN',
  createdAt: '',
  updatedAt: '',
};

enum ActionType {
  SET_NAME = 'SET_NAME',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_PRICE = 'SET_PRICE',
  SET_DURATION = 'SET_DURATION',
  SET_LOCALE = 'SET_LOCALE',
  ADD_FEATURE = 'ADD_FEATURE',
  UPDATE_FEATURE = 'UPDATE_FEATURE',
}

type Action = {
  type: ActionType;
  payload: any;
};

const updateTranslationReducer = (state: UpdatePlanState, action: Action): UpdatePlanState => {
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

    case ActionType.SET_PRICE:
      return { ...state, price: action.payload };

    case ActionType.SET_DURATION:
      return { ...state, durationInDays: action.payload };

    case ActionType.SET_LOCALE:
      if (!state.translations.some((tr) => tr.language === action.payload)) {
        updatedTranslations.push({
          language: action.payload,
          name: '',
          description: '',
          features: [''],
          id: '',
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };

    case ActionType.ADD_FEATURE:
      updatedTranslations[currentTranslationIndex].features.push('');
      return { ...state, translations: updatedTranslations };

    case ActionType.UPDATE_FEATURE:
      updatedTranslations[currentTranslationIndex].features[action.payload.index] =
        action.payload.value;
      return { ...state, translations: updatedTranslations };

    default:
      return state;
  }
};

interface UpdateProps {
  onSubmit: (content: Plan) => void;
  onDelete?: (content: Plan) => void;
  onCancel: () => void;
  subscription: Plan;
}

const setState = (subscription: Plan) => {
  if (!subscription) return initialState;
  return { ...subscription, currentLocale: subscription.translations[0].language };
};

const Update = ({ onSubmit, onCancel, onDelete, subscription }: UpdateProps) => {
  const { t } = useTranslation('plans');
  const [state, dispatch] = useReducer(updateTranslationReducer, setState(subscription));
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
        placeholder={t('namePlaceholder') as string}
      />
      <textarea
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        style={{ minHeight: '100px' }}
        value={currentTranslation?.description}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DESCRIPTION, payload: event.target.value })
        }
        placeholder={t('descriptionPlaceholder') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        type="number"
        value={state.price}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_PRICE, payload: parseFloat(event.target.value) })
        }
        placeholder={t('pricePlaceholder') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        type="number"
        value={state.durationInDays}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DURATION, payload: parseInt(event.target.value) })
        }
        placeholder={t('durationInDaysPlaceholder') as string}
      />
      <div className="flex flex-row flex-wrap">
        {currentTranslation?.features.map((feature, index) => (
          <div className="flex flex-row flew-wrap gap-1" key={index}>
            <input
              className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
              value={feature}
              onChange={(e) =>
                dispatch({
                  type: ActionType.UPDATE_FEATURE,
                  payload: { index, value: e.target.value },
                })
              }
              placeholder={t('featurePlaceholder') as string}
            />
            {currentTranslation.features.length - 1 === index && (
              <button
                onClick={() =>
                  dispatch({
                    type: ActionType.ADD_FEATURE,
                    payload: undefined,
                  })
                }
                className="border hover:bg-blue-600 bg-[#2686FF] cursor-pointer rounded-md font-open-sans font-normal text-white text-sm py-0 px-4 mt-3"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
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

export default Update;
