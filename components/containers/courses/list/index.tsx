import List from './components/list';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import { useEffect, useReducer } from 'react';
import useRequest from '@/hooks/request';
import URLS from '@/common/urls';
import { StudentsHero, VisitorsHero } from './components/heros';
import { Course, Tag, TagTypes } from '@/common/types/common';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/elements/loading';
import { debounce } from '@/common/utils';

const URL = `${BACKEND_URL}/${URLS.courses.list}`;

interface CoursesState {
  canFetch: boolean;
  offset: number;
  title: string | undefined;
  tagIds: string[];
  selectedLevel: string | undefined;
  selectedSubject: string | undefined;
  selectedPath: string | undefined;
  selectedYear: string | undefined;
  profilePath: string | undefined;
  profileYear: string | undefined;
  profileLevel: string | undefined;
}

const coursesInitialState: CoursesState = {
  canFetch: false,
  offset: 0,
  title: undefined,
  tagIds: [],
  selectedLevel: undefined,
  selectedPath: undefined,
  selectedSubject: undefined,
  selectedYear: undefined,
  profilePath: undefined,
  profileYear: undefined,
  profileLevel: undefined,
};

interface CoursesProps {
  courses: Course[];
  totalRecords: number;
  isPublic?: boolean;
}

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_TITLE = 'SET_TITLE',
  SET_TAG_IDS = 'SET_TAG_IDS',
  SET_YEAR = 'SET_YEAR',
  SET_SUBJECT = 'SET_SUBJECT',
  SET_PATHS = 'SET_PATH',
  SET_LEVEL = 'SET_LEVEL',
  SET_PROFILE_LEVEL = 'SET_PROFILE_LEVEL',
  SET_PROFILE_YEAR = 'SET_PROFILE_YEAR',
  SET_PROFILE_PATH = 'SET_PROFILE_PATH',
}

type Action = {
  type: ActionType;
  payload: any;
};

const CoursesReducer = (state: CoursesState, action: Action): CoursesState => {
  switch (action.type) {
    case ActionType.SET_OFFSET:
      return {
        ...state,
        canFetch: true,
        offset: action.payload,
      };
    case ActionType.SET_TAG_IDS:
      return {
        ...state,
        canFetch: true,
        tagIds: action.payload,
      };
    case ActionType.SET_TITLE:
      return {
        ...state,
        canFetch: true,
        title: action.payload,
      };
    case ActionType.SET_LEVEL:
      return {
        ...state,
        selectedLevel: action.payload,
      };
    case ActionType.SET_YEAR:
      return {
        ...state,
        selectedYear: action.payload,
      };
    case ActionType.SET_PATHS:
      return {
        ...state,
        selectedPath: action.payload,
      };
    case ActionType.SET_SUBJECT:
      return {
        ...state,
        selectedSubject: action.payload,
      };
    case ActionType.SET_PROFILE_LEVEL:
      return {
        ...state,
        profileLevel: action.payload,
      };
    case ActionType.SET_PROFILE_PATH:
      return {
        ...state,
        profilePath: action.payload,
      };
    case ActionType.SET_PROFILE_YEAR:
      return {
        ...state,
        profileYear: action.payload,
      };
    default:
      return state;
  }
};

const Courses = ({ courses, totalRecords, isPublic = true }: CoursesProps) => {
  const { t } = useTranslation('courses');
  const [state, dispatch] = useReducer(CoursesReducer, coursesInitialState);
  const { data, isLoading } = useRequest({
    url: state.canFetch
      ? `${URL}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}&title=${state.title ?? ''}&tagIds=${
          state.tagIds
        }`
      : undefined,
  });
  const { data: levels } = useRequest({
    url: `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.LEVEL}`,
  });

  const { data: subjects } = useRequest({
    url: state.selectedYear
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.SUBJECT}&parentTagId=${
          state.selectedPath || state.selectedYear
        }`
      : undefined,
  });

  const { data: profile } = useRequest({
    url: isPublic ? undefined : `${BACKEND_URL}/${URLS.me.profile}`,
  });

  useEffect(() => {
    if (!isPublic && profile) {
      const tags: Tag[] = profile.tags;
      const level = tags.find((tag: Tag) => tag.tagType === TagTypes.LEVEL);
      const year = tags.find((tag: Tag) => tag.tagType === TagTypes.STUDY_YEAR);
      const path = tags.find((tag: Tag) => tag.tagType === TagTypes.PATH);

      dispatch({ type: ActionType.SET_LEVEL, payload: level?.id });
      dispatch({ type: ActionType.SET_YEAR, payload: year?.id });
      dispatch({ type: ActionType.SET_PATHS, payload: path?.id });
    }
  }, [profile, isPublic]);

  const onTagsChange = (tags?: string[]) => {
    if (tags) {
      dispatch({ type: ActionType.SET_TAG_IDS, payload: tags });
      return;
    }
  };
  const onPageChange = (page: number) => {
    dispatch({ type: ActionType.SET_OFFSET, payload: page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0 });
  };

  const onSearchChange = debounce((value: string) => {
    dispatch({ type: ActionType.SET_TITLE, payload: value });
  }, 400);

  const onSubjectChange = (id: string | undefined) => {
    dispatch({ type: ActionType.SET_SUBJECT, payload: id });
    dispatch({ type: ActionType.SET_TAG_IDS, payload: [id] });
  };

  return (
    <>
      {isPublic ? (
        <VisitorsHero
          tags={{ levels: levels?.items, subjects: [] }}
          onTagsChange={onTagsChange}
          onSearchChange={onSearchChange}
          totalRecords={totalRecords}
        />
      ) : (
        <StudentsHero
          tags={subjects?.items}
          onSubjectChange={onSubjectChange}
          onSearchChange={onSearchChange}
        />
      )}
      <div className={`flex flex-col mt-10 mb-10 ${isPublic ? 'justify-center items-center' : ''}`}>
        {isPublic && (
          <div className="text-3xl 2xl:text-4xl text-[#293B52] font-[Poppins] font-medium my-8">
            {t('exploreCourses')}
          </div>
        )}
        {isLoading ? (
          <Loading height="min-h-screen w-full" />
        ) : (
          <List
            courses={data?.items || courses}
            totalRecords={data?.totalRecords || totalRecords}
            className={
              isPublic
                ? 'w-11/12 lg:w-3/5 md:grid md:gap-4 grid-cols-3'
                : 'md:grid grid-cols-3 md:gap-4 p-3  max-h-64'
            }
            onPageChange={onPageChange}
          />
        )}
      </div>
    </>
  );
};

export default Courses;
