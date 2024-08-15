import { LOCALS } from '@/common/config';
import { Tag, TagCreate, TagTypes } from '@/common/types/common';
import Button from '@/components/common/buttons';
import Loading from '@/components/common/elements/loading';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import { useTranslation } from 'next-i18next';
import { useEffect, useReducer } from 'react';

const data = Object.values(TagTypes).map((element) => {
  let name = element.replace(/[^a-zA-Z]/g, ' ');
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return { id: element, name };
});

interface AddCategoryState {
  currentLocale: string;
  tagType: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  parentTagId?: string;
  loading: boolean;
  tags: Tag[];
}
const initialState: AddCategoryState = {
  currentLocale: 'EN',
  translations: [
    {
      language: 'EN',
      name: '',
      description: '',
    },
  ],
  tagType: '',
  parentTagId: '',
  loading: false,
  tags: [],
};

enum ActionType {
  SET_NAME = 'SET_NAME',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_TAG_TYPE = 'SET_TAG_TYPE',
  SET_LOCALE = 'SET_LOCALE',
  SET_TAG_PARENT = 'SET_TAG_PARENT',
  SET_TAGS = 'SET_TAGS',
  SET_LOADING = 'SET_LOADING',
}

type Action = {
  type: ActionType;
  payload: any;
};

const addCategoryReducer = (state: AddCategoryState, action: Action): AddCategoryState => {
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

    case ActionType.SET_TAG_TYPE:
      return { ...state, tagType: action.payload.tagType };
    case ActionType.SET_TAG_PARENT:
      return { ...state, parentTagId: action.payload };
    case ActionType.SET_LOCALE:
      if (!state.translations.some((tr) => tr.language === action.payload)) {
        updatedTranslations.push({
          language: action.payload,
          name: '',
          description: '',
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };
    case ActionType.SET_TAGS: {
      return { ...state, tags: action.payload };
    }

    case ActionType.SET_LOADING: {
      return { ...state, loading: action.payload };
    }
    default:
      return state;
  }
};

interface AddCategoryProps {
  onSubmit: (category: TagCreate) => void;
  onCancel: () => void;
  fetchCategories: (
    offset: number,
    limit: number
  ) => Promise<
    | {
        totalRecords: any;
        categories: Tag[];
      }
    | {
        totalRecords: undefined;
        categories: undefined;
      }
  >;
}

const AddCategory = ({ onSubmit, onCancel, fetchCategories }: AddCategoryProps) => {
  const { t } = useTranslation('courses');
  const [state, dispatch] = useReducer(addCategoryReducer, initialState);
  const currentTranslation = state.translations.find((tr) => tr.language === state.currentLocale);

  useEffect(() => {
    dispatch({ type: ActionType.SET_LOADING, payload: true });
    fetchCategories(0, 2000).then((data: any) => {
      dispatch({ type: ActionType.SET_TAGS, payload: data.categories });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagTypeChange = (tagType: TagTypes) => {
    dispatch({
      type: ActionType.SET_TAG_TYPE,
      payload: { tagType },
    });
  };

  const handleTagParentChange = (id: string) => {
    dispatch({
      type: ActionType.SET_TAG_PARENT,
      payload: id,
    });
  };

  if (state.loading) {
    return (
      <div className="max-h-3">
        <Loading height="" />
      </div>
    );
  }

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
      <label className="block text-sm font-medium text-gray-700 text-left w-full">
        {t('categoryNamePlaceholder')}
      </label>
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        value={currentTranslation?.name}
        onChange={(event) => dispatch({ type: ActionType.SET_NAME, payload: event.target.value })}
        placeholder={t('categoryNamePlaceholder') as string}
      />
      <label className="block mt-4 text-sm font-medium text-gray-700 text-left w-full">
        {t('categoryDescriptionPlaceholder')}
      </label>
      <textarea
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        value={currentTranslation?.description}
        style={{ minHeight: '100px' }}
        onChange={(event) =>
          dispatch({ type: ActionType.SET_DESCRIPTION, payload: event.target.value })
        }
        placeholder={t('categoryDescriptionPlaceholder') as string}
      />
      <label className="block text-sm font-medium text-gray-700 text-left w-full">
        {t('parentTagPlaceholder')}
      </label>
      <AutoCompleteInput
        onChange={(value) => handleTagParentChange(value.id)}
        data={state.tags}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
        valueKey={'name'}
        valueId={'id'}
        placeholder={t('parentTagPlaceholder') as string}
        type={'text'}
        name={'parent-tag'}
        disabled={false}
        getDisplayValue={(tag: Tag) =>
          tag
            ? `${tag?.translations.find((tr) => tr.language === 'EN')?.name} - ${tag?.tagType}`
            : ''
        }
      />

      <label className="block text-sm font-medium text-gray-700 text-left w-full">
        {t('tagTypePlaceholder')}
      </label>
      <AutoCompleteInput
        onChange={(value) => handleTagTypeChange(value.id)}
        data={data}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
        valueKey={'name'}
        valueId={'id'}
        placeholder={t('tagTypePlaceholder') as string}
        type={'text'}
        name={'category-type'}
        disabled={false}
      />
      <div className="flex flex-row flew-wrap gap-4">
        <Button
          type="info"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { currentLocale, ...category } = state;
            onSubmit(category);
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

export default AddCategory;
