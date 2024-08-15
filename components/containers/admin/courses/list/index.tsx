import React, { useReducer } from 'react';
import Image from 'next/image';
import CaseIcon from '@/public/images/Path 12043.svg';
import List from '@/components/containers/admin/courses/list/components/list';
import GroupSvg from '@/public/images/Group 2870.svg';
import { Course, Tag, TagTypes } from '@/common/types/common';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import { useTranslation } from 'next-i18next';
import { getUserInfoClient } from '@/lib/common';
import Loading from '@/components/common/elements/loading';

interface CourseListState {
  level: Tag | undefined;
  year: Tag | undefined;
  path: Tag | undefined;
  subject: Tag | undefined;
  courses: Course[] | undefined;
  tags: string[] | undefined;
  items: number | undefined;
  pages: number | undefined;
  error: string | undefined;
  success: string | undefined;
  canDisplayMore: boolean;
}

const initialState: CourseListState = {
  level: undefined,
  year: undefined,
  path: undefined,
  subject: undefined,
  courses: undefined,
  items: undefined,
  pages: undefined,
  tags: undefined,
  error: undefined,
  success: undefined,
  canDisplayMore: true,
};

enum ActionType {
  SET_COURSES = 'SET_COURSES',
  SET_LEVEL = 'SET_LEVEL',
  SET_YEAR = 'SET_YEAR',
  SET_PATH = 'SET_PATH',
  SET_SUBJECT = 'SET_SUBJECT',
  SET_ITEMS = 'SET_ITEMS',
  SET_TAGS = 'SET_TAGS',
  SET_ERROR = 'SET_ERROR',
  SET_SUCCESS = 'SET_SUCCESS',
  SET_DISPLAY_MORE = 'SET_DISPLAY_MORE',
}

type Action = {
  type: ActionType;
  payload: any;
};

const CoursesListReducer = (state: CourseListState, action: Action): CourseListState => {
  switch (action.type) {
    case ActionType.SET_LEVEL:
      return {
        ...state,
        level: action.payload,
        tags: [action.payload?.id],
      };
    case ActionType.SET_YEAR:
      return {
        ...state,
        year: action.payload,
        tags: [action.payload?.id],
      };
    case ActionType.SET_PATH:
      return {
        ...state,
        path: action.payload,
        tags: [action.payload?.id],
      };
    case ActionType.SET_SUBJECT:
      return {
        ...state,
        subject: action.payload,
        tags: [action.payload?.id],
      };
    case ActionType.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case ActionType.SET_TAGS:
      return {
        ...state,
        tags: action.payload as string[],
      };
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionType.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case ActionType.SET_DISPLAY_MORE:
      return {
        ...state,
        canDisplayMore: action.payload,
      };
    default:
      return state;
  }
};

interface CoursesProps {
  courses: Course[];
  pages: number;
}

const Courses = ({ courses, pages }: CoursesProps) => {
  const { t } = useTranslation('courses');
  const user = getUserInfoClient();
  const [state, dispatch] = useReducer(CoursesListReducer, { ...initialState, courses, pages });

  const { data: levels } = useRequest({
    url: `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.LEVEL}`,
  });
  const { data: years } = useRequest({
    url: state.level
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.STUDY_YEAR}${
          state.level ? `&parentTagId=${state.level.id}` : ''
        }`
      : undefined,
  });
  const { data: paths } = useRequest({
    url: state.year
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.PATH}${
          state.year ? `&parentTagId=${state.year.id}` : ''
        }`
      : undefined,
  });
  const { data: subjects } = useRequest({
    url: state.year
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.SUBJECT}${
          state.subject ? `&parentTagId=${state.subject.id}` : ''
        }`
      : undefined,
  });
  const { data: fetchedCourses, isLoading } = useRequest({
    url: state.items
      ? `${BACKEND_URL}/${URLS.courses.list}?offset=${0}&limit=${state.items}&tagIds=${
          state.tags || []
        }`
      : state.tags
      ? `${BACKEND_URL}/${URLS.courses.list}?offset=${0}&limit=${ITEMS_PER_PAGE}&tagIds=${
          state.tags || []
        }`
      : undefined,
  });

  const onDisplayMore = () => {
    let items = 0;
    if (!state.items) {
      items = ITEMS_PER_PAGE * 2;
    } else {
      items = state.items + ITEMS_PER_PAGE;
    }

    dispatch({ type: ActionType.SET_ITEMS, payload: items });

    if (items >= pages) {
      dispatch({ type: ActionType.SET_DISPLAY_MORE, payload: false });
    }
  };

  const onResetFilters = () => {
    dispatch({ type: ActionType.SET_YEAR, payload: undefined });
    dispatch({ type: ActionType.SET_LEVEL, payload: undefined });
    dispatch({ type: ActionType.SET_PATH, payload: undefined });
    dispatch({ type: ActionType.SET_SUBJECT, payload: undefined });
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('courseList')}</p>
      </div>
      <div>
        <div className="flex flex-col gap-2 w-12/12">
          <div className="flex flex-row justify-around h-20">
            <div className="flex flex-row pl-4 gap-4 items-end justify-items-start w-10/12">
              <button
                onClick={onResetFilters}
                className="border hover:bg-blue-600 bg-[#2686FF] cursor-pointer rounded-md p-3 flex items-center"
              >
                <p className="font-open-sans font-normal text-white text-sm">{t('reset')}</p>
              </button>
              <AutoCompleteInput
                onChange={(value) => {
                  dispatch({ type: ActionType.SET_LEVEL, payload: value });
                }}
                data={levels?.items || []}
                className="font-[open sans] text-[#767676] text-sm font-semibold flex flex-row outline-none cursor-pointer bg-[#F4F4F4] border rounded-md p-3 w-full"
                valueKey={'name'}
                valueId={'id'}
                placeholder={t('studyLevel')}
                type={'text'}
                name={'level'}
                disabled={false}
                defaultValue={state.level}
                getDisplayValue={(tag: Tag) =>
                  tag?.translations?.find((t) => t.language === user.language)?.name || ''
                }
              />
              <AutoCompleteInput
                onChange={(value) => {
                  dispatch({ type: ActionType.SET_YEAR, payload: value });
                }}
                data={years?.items || []}
                className="font-[open sans] text-[#767676] text-sm font-semibold flex flex-row outline-none cursor-pointer bg-[#F4F4F4] border rounded-md p-3 w-full"
                valueKey={'name'}
                valueId={'id'}
                placeholder={t('studyYear')}
                type={'text'}
                name={'year'}
                disabled={false}
                defaultValue={state.year}
                getDisplayValue={(tag: Tag) =>
                  tag?.translations?.find((t) => t.language === user.language)?.name || ''
                }
              />
              <AutoCompleteInput
                onChange={(value) => {
                  dispatch({ type: ActionType.SET_PATH, payload: value });
                }}
                data={paths?.items || []}
                className="font-[open sans] text-[#767676] text-sm font-semibold flex flex-row outline-none cursor-pointer bg-[#F4F4F4] border rounded-md p-3 w-full"
                valueKey={'name'}
                valueId={'id'}
                placeholder={t('studyPath')}
                type={'text'}
                name={'path'}
                disabled={false}
                defaultValue={state.path}
                getDisplayValue={(tag: Tag) =>
                  tag?.translations?.find((t) => t.language === user.language)?.name || ''
                }
              />
              <AutoCompleteInput
                onChange={(value) => {
                  dispatch({ type: ActionType.SET_SUBJECT, payload: value });
                }}
                data={subjects?.items || []}
                className="font-[open sans] text-[#767676] text-sm font-semibold flex flex-row outline-none cursor-pointer bg-[#F4F4F4] border rounded-md p-3 w-full"
                valueKey={'name'}
                valueId={'id'}
                placeholder={t('studySubject')}
                type={'text'}
                name={'subject'}
                disabled={false}
                defaultValue={state.subject}
                getDisplayValue={(tag: Tag) =>
                  tag?.translations?.find((t) => t.language === user.language)?.name || ''
                }
              />
            </div>
            <div className="h-20 w-40 2xl:w-52 2xl:h-28  ">
              <div>
                <Image
                  width={250}
                  height={150}
                  src={GroupSvg.src}
                  alt="over-view_icon"
                  className="mr-1"
                />
              </div>
            </div>
          </div>
          <div className="border border-r-2 border-gray-300 w-10/12 ml-6 "></div>
        </div>
        {isLoading ? (
          <Loading height="min-h-screen w-full" />
        ) : (
          <List
            courses={fetchedCourses?.items || courses}
            onDisplayMore={onDisplayMore}
            canDisplayMore={state.canDisplayMore && ITEMS_PER_PAGE < fetchedCourses?.totalRecords}
          />
        )}
      </div>
    </>
  );
};

export default Courses;
