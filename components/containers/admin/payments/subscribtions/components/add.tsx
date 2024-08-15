import { LOCALS } from '@/common/config';
import { Plan, PlanCreate } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useReducer } from 'react';
import { useTranslation } from 'next-i18next';

interface AddPlanState {
  id?: string;
  currentLocale: string;
  translations: {
    language: string;
    name: string;
    description: string;
    features: string[];
  }[];
  price: number;
  durationInDays: number;
}
const initialState: AddPlanState = {
  translations: [
    {
      language: 'EN',
      name: '',
      description: '',
      features: [''],
    },
  ],
  price: 0,
  durationInDays: 0,
  currentLocale: 'EN',
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

const addSubscriptionReducer = (state: AddPlanState, action: Action): AddPlanState => {
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
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };

    case ActionType.ADD_FEATURE:
      updatedTranslations[currentTranslationIndex] = {
        ...updatedTranslations[currentTranslationIndex],
        features: [...updatedTranslations[currentTranslationIndex].features, ''],
      };
      return { ...state, translations: updatedTranslations };

    case ActionType.UPDATE_FEATURE:
      const updatedFeatures = [...updatedTranslations[currentTranslationIndex].features];
      updatedFeatures[action.payload.index] = action.payload.value;
      updatedTranslations[currentTranslationIndex] = {
        ...updatedTranslations[currentTranslationIndex],
        features: updatedFeatures,
      };
      return { ...state, translations: updatedTranslations };

    default:
      return state;
  }
};

interface AddProps {
  onSubmit: (subscription: PlanCreate) => void;
  onDelete?: (subscription: Plan) => void;
  onCancel: () => void;
}

const Add = ({ onSubmit, onCancel }: AddProps) => {
  const { t } = useTranslation('plans');
  const [state, dispatch] = useReducer(addSubscriptionReducer, initialState);
  const currentTranslation = state.translations.find((tr) => tr.language === state.currentLocale);
  return (
    <>
      <select
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
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
        placeholder={t('subscriptionNamePlaceholder') as string}
      />
      <textarea
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        style={{ minHeight: '100px' }}
        value={currentTranslation?.description}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DESCRIPTION, payload: event.target.value })
        }
        placeholder={t('subscriptionDescriptionPlaceholder') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        type="number"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_PRICE, payload: parseFloat(event.target.value) })
        }
        placeholder={t('subscriptionPricePlaceholder') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        type="number"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DURATION, payload: parseInt(event.target.value) })
        }
        placeholder={t('durationInDaysPlaceholder') as string}
      />
      {currentTranslation?.features.map((feature: string, index: number) => (
        <div key={index} className="flex flex-row w-full gap-1">
          <input
            onChange={(e) => {
              dispatch({
                type: ActionType.UPDATE_FEATURE,
                payload: { index, value: e.target.value },
              });
            }}
            value={feature}
            placeholder={t('featurePlaceholder') as string}
            className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 py-3 px-4 mt-3"
          />
          {currentTranslation?.features.length - 1 === index && (
            <button
              onClick={() =>
                dispatch({
                  type: ActionType.ADD_FEATURE,
                  payload: undefined,
                })
              }
              className="border hover:bg-blue-600 bg-[#2686FF] cursor-pointer rounded-md font-open-sans font-normal text-white text-sm py-0 px-4 mt-3"
            >
              {'+'}
            </button>
          )}
        </div>
      ))}
      <div className="flex flex-raw gap-5">
        <Button
          type="info"
          onClick={async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { currentLocale, id, ...plan } = state;
            await onSubmit(plan);
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

export default Add;
