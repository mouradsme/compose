import { LOCALS } from '@/common/config';
import { TagUpdate, Tag, TagTypes } from '@/common/types/common';
import Button from '@/components/common/buttons';
import Loading from '@/components/common/elements/loading';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import { useTranslation } from 'next-i18next';
import { useEffect, useReducer } from 'react';

const parseTagType = (element: string) => {
  let name = element.replace(/[^a-zA-Z]/g, ' ');
  name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return { id: element, name };
};

const data = Object.values(TagTypes).map((element) => parseTagType(element));

interface UpdateCategoryState {
  id: string;
  currentLocale: string;
  tagType: string;
  translations: {
    language: string;
    name: string;
    description: string;
  }[];
  parentTagId: string;
  loading: boolean;
  tags: Tag[];
}

const initialState: UpdateCategoryState = {
  translations: [
    {
      language: 'EN',
      name: '',
      description: '',
    },
  ],
  id: '',
  tagType: '',
  currentLocale: 'EN',
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

const updateCategoryReducer = (state: UpdateCategoryState, action: Action): UpdateCategoryState => {
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

    case ActionType.SET_TAG_TYPE:
      return { ...state, tagType: action.payload.tagType };

    case ActionType.SET_LOCALE:
      if (!state.translations.some((tr) => tr.language === action.payload)) {
        updatedTranslations.push({
          language: action.payload,
          name: '',
          description: '',
        });
      }
      return { ...state, currentLocale: action.payload, translations: updatedTranslations };

    case ActionType.SET_TAG_PARENT: {
      return { ...state, parentTagId: action.payload };
    }

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

interface UpdateCategoryProps {
  onSubmit: (category: TagUpdate) => void;
  onCancel: () => void;
  category: Tag;
  parentTag?: Tag;
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

const UpdateCategory = ({
  onSubmit,
  onCancel,
  category,
  parentTag,
  fetchCategories,
}: UpdateCategoryProps) => {
  const { t } = useTranslation('courses');
  const [state, dispatch] = useReducer(updateCategoryReducer, {
    ...initialState,
    ...category,
    currentLocale: category.translations[0]?.language || 'EN',
  });

  useEffect(() => {
    dispatch({ type: ActionType.SET_LOADING, payload: true });
    fetchCategories(0, 2000).then((data: any) => {
      dispatch({ type: ActionType.SET_TAGS, payload: data.categories });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentTranslation = state.translations.find((tr) => tr.language === state.currentLocale);

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
        value={state.currentLocale}
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
        value={currentTranslation?.name}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) => dispatch({ type: ActionType.SET_NAME, payload: event.target.value })}
        placeholder={t('categoryNamePlaceholder') as string}
      />
      <label className="block mt-4 text-sm font-medium text-gray-700 text-left w-full">
        {t('categoryDescriptionPlaceholder')}
      </label>
      <textarea
        value={currentTranslation?.description}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
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
        data={state.tags.filter((t) => t.tagType !== category.tagType)}
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full "
        valueKey={'name'}
        valueId={'id'}
        placeholder={t('parentTagPlaceholder') as string}
        type={'text'}
        name={'parent-tag'}
        disabled={false}
        defaultValue={parentTag}
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
        name={'category type'}
        disabled={false}
        defaultValue={parseTagType(state.tagType)}
      />
      <div className="flex flex-row flew-wrap gap-4">
        <Button
          onClick={() => {
            onSubmit(state);
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

export default UpdateCategory;
