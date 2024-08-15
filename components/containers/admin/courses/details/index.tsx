import CaseIcon from '@/public/images/Path 12043.svg';
import Image from 'next/image';
import { useEffect, useReducer, useState } from 'react';
import TextAlignIcon from '@/public/images/textalign.svg';
import CalendarIcon from '@/public/images/celendar.svg';
import { TagTypes, Tag as TagType, Instructor, CourseCreate, Course } from '@/common/types/common';
import AutoCompleteInput from '@/components/common/inputs/autoComplete';
import useRequest from '@/hooks/request';
import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { Tag } from '@/components/common/elements/tag';
import { createCourse, createCourseCover, deleteCourse, updateCourse } from '@/lib/courses';
import { courseSchema } from '@/common/schemas';
import { ValidationError } from 'yup';
import Sections from '@/components/containers/admin/sections';
import { getCourseInstructors } from '@/lib/instructors';
import CoverUpload from './components/cover';
import { useRouter } from 'next/router';
import Quizzes from '@/components/containers/admin/quizzes';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import Modal from '@/components/common/elements/modal';
import { useMessage } from '@/contexts/message';
import { AxiosError } from 'axios';

interface CreateCourseState {
  title: string;
  shortDescription: string;
  description: string;
  objectives: string[];
  price: number;
  startDate: string;
  endDate: string;
  instructorsIds: string[];
  selectedLevel: TagType | undefined;
  selectedYear: TagType | undefined;
  selectedPath: TagType[] | undefined;
  clickedPath: TagType | undefined;
  selectedSubject: TagType[] | undefined;
  createdCourseId: string | undefined;
  file: File | undefined;
  openDeleteModal: boolean;
  isFeatured: boolean;
}

const initialState: CreateCourseState = {
  title: '',
  shortDescription: '',
  description: '',
  objectives: [''],
  price: 0,
  startDate: '',
  endDate: '',
  instructorsIds: [],
  selectedLevel: undefined,
  selectedYear: undefined,
  selectedPath: undefined,
  clickedPath: undefined,
  selectedSubject: undefined,
  createdCourseId: undefined,
  file: undefined,
  openDeleteModal: false,
  isFeatured: false,
};

enum ActionType {
  SET_LEVEL = 'SET_LEVEL',
  SET_YEAR = 'SET_YEAR',
  SET_PATH = 'SET_PATH',
  SET_CLICKED_PATH = 'SET_CLICKED_PATH',
  SET_SUBJECT = 'SET_SUBJECT',
  SET_TITLE = 'SET_TITLE',
  SET_SHORT_DESCRIPTION = 'SET_SHORT_DESCRIPTION',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_OBJECTIVES = 'SET_OBJECTIVES',
  SET_PRICE = 'SET_PRICE',
  SET_START_DATE = 'SET_START_DATE',
  SET_END_DATE = 'SET_END_DATE',
  SET_INSTRUCTORS_IDS = 'SET_INSTRUCTORS_IDS',
  SET_CREATED_COURSE = 'SET_CREATED_COURSE',
  SET_FILE = 'SET_FILE',
  SET_OPEN_DELETE_MODAL = 'SET_OPEN_DELETE_MODAL',
  SET_IS_FEATURED = 'SET_IS_FEATURED',
}

type Action = {
  type: ActionType;
  payload: any;
};

const AddCourseReducer = (state: CreateCourseState, action: Action): CreateCourseState => {
  switch (action.type) {
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
    case ActionType.SET_PATH:
      return {
        ...state,
        selectedPath: action.payload,
      };
    case ActionType.SET_CLICKED_PATH:
      return {
        ...state,
        clickedPath: action.payload,
      };
    case ActionType.SET_SUBJECT:
      return {
        ...state,
        selectedSubject: action.payload,
      };
    case ActionType.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    case ActionType.SET_SHORT_DESCRIPTION:
      return {
        ...state,
        shortDescription: action.payload,
      };
    case ActionType.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };
    case ActionType.SET_OBJECTIVES:
      return {
        ...state,
        objectives: action.payload,
      };
    case ActionType.SET_PRICE:
      return {
        ...state,
        price: action.payload,
      };
    case ActionType.SET_START_DATE:
      return {
        ...state,
        startDate: action.payload,
      };
    case ActionType.SET_END_DATE:
      return {
        ...state,
        endDate: action.payload,
      };
    case ActionType.SET_INSTRUCTORS_IDS:
      return {
        ...state,
        instructorsIds: action.payload,
      };
    case ActionType.SET_CREATED_COURSE:
      return {
        ...state,
        createdCourseId: action.payload,
      };
    case ActionType.SET_FILE:
      return {
        ...state,
        file: action.payload,
      };
    case ActionType.SET_OPEN_DELETE_MODAL:
      return {
        ...state,
        openDeleteModal: action.payload,
      };
    case ActionType.SET_IS_FEATURED:
      return {
        ...state,
        isFeatured: action.payload,
      };
    default:
      return state;
  }
};

interface NewCourseProps {
  instructors: Instructor[];
  course?: Course;
}

interface FullNameInstructor extends Instructor {
  fullName: string;
}

const addFullName = (instructor: Instructor): FullNameInstructor => {
  const _instructor: FullNameInstructor = {
    ...instructor,
    fullName: `${instructor.firstName} ${instructor.lastName}`,
  };

  return _instructor;
};

const fillTheState = (initialState: CreateCourseState, course?: Course) => {
  if (!course) {
    return initialState;
  }

  const selectedLevel = course.tags.filter((tag) => tag.tagType === TagTypes.LEVEL)?.[0];
  const selectedYear = course.tags.filter((tag) => tag.tagType === TagTypes.STUDY_YEAR)?.[0];
  const selectedPath = course.tags.filter((tag) => tag.tagType === TagTypes.PATH)?.[0];
  const selectedSubject = course.tags.filter((tag) => tag.tagType === TagTypes.SUBJECT)?.[0];
  const createdCourseId = course.id;
  const courseCover = course.coverUrl ? 'Image Uploaded' : undefined;
  const _course: Partial<CreateCourseState> = {
    ...course,
    selectedLevel,
    selectedYear,
    ...selectedPath,
    ...selectedSubject,
    createdCourseId,
    file: { name: courseCover } as File,
  };
  const state: CreateCourseState = { ...initialState, ..._course };

  return state;
};

const NewCourse = ({ instructors, course }: NewCourseProps) => {
  const { t } = useTranslation('courses');
  const { showMessage } = useMessage();
  const router = useRouter();
  const [instructorsList] = useState<FullNameInstructor[]>(() => instructors.map(addFullName));
  const [editInstructor, setEditInstructor] = useState<FullNameInstructor | undefined>(undefined);
  const [state, dispatch] = useReducer(AddCourseReducer, fillTheState(initialState, course));
  const { data: levels, isLoading: loadingLevels } = useRequest({
    url: `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.LEVEL}`,
  });
  const { data: years, isLoading: loadingYears } = useRequest({
    url: state.selectedLevel
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.STUDY_YEAR}&parentTagId=${state.selectedLevel.id}`
      : undefined,
  });
  const { data: paths, isLoading: loadingPaths } = useRequest({
    url: state.selectedYear
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.PATH}&parentTagId=${state.selectedYear.id}`
      : undefined,
  });
  const { data: subjects, isLoading: loadingSubjects } = useRequest({
    url: state.selectedYear
      ? `${BACKEND_URL}/${URLS.tags.list}?tagTypes=${TagTypes.SUBJECT}&parentTagId=${
          state.clickedPath?.id || state.selectedYear.id
        }`
      : undefined,
  });

  useEffect(() => {
    if (course && course.id) {
      getCourseInstructors(course.id).then((data) => {
        dispatch({
          type: ActionType.SET_INSTRUCTORS_IDS,
          payload: data.data.items?.map((item: Instructor) => item.id),
        });
        if (data.data.items?.[0]) {
          const instructor = addFullName(data.data.items?.[0]);
          setEditInstructor(instructor);
        }
      });
    }
  }, [course]);

  const validateCourse = (state: CreateCourseState) => {
    try {
      courseSchema.validateSync(state);
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      }
      return false;
    }
    return true;
  };

  const getCourseFromState = (isPublished = true): CourseCreate | undefined => {
    const isValid = validateCourse(state);
    if (!isValid) {
      return undefined;
    }

    const {
      title,
      shortDescription,
      description,
      objectives,
      price,
      startDate,
      endDate,
      selectedLevel,
      selectedPath,
      selectedSubject,
      selectedYear,
      instructorsIds,
      isFeatured,
    } = state;

    const tags = [selectedLevel, ...(selectedPath || []), ...(selectedSubject || []), selectedYear]
      .filter((e) => e !== undefined)
      .map((e) => e?.id) as string[];

    return {
      title,
      shortDescription,
      description,
      objectives,
      price,
      startDate,
      endDate,
      tagsIds: tags,
      instructorsIds,
      isPublished,
      isFeatured,
    };
  };

  const onCourseSave = async () => {
    const course = getCourseFromState();
    if (!course) {
      return;
    }

    if (state.createdCourseId) {
      await handleCourseUpdate(course);
      return;
    }

    await handleCourseCreation(course);
  };

  const onCourseDraft = async () => {
    const course = getCourseFromState(false);

    if (!course) {
      return;
    }

    if (state.createdCourseId) {
      await handleCourseUpdate(course);
      return;
    }

    await handleCourseCreation(course);
  };

  const onCourseDelete = async () => {
    if (!state.createdCourseId) {
      return;
    }
    try {
      showMessage(t('courseDeleted') as string, 'success');
      await deleteCourse(state.createdCourseId);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongDeleted') as string, 'error');
        router.push('/admin/dashboard/courses/list');
      }
    }
  };

  const handleCourseCreation = async (course: CourseCreate) => {
    try {
      const res = await createCourse(course);
      if (state.file) {
        await createCourseCover(res.data.id, state.file);
      }

      showMessage(t('courseCreated') as string, 'success');

      dispatch({
        type: ActionType.SET_CREATED_COURSE,
        payload: res.data.id,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongCreated') as string, 'error');
      }
    }
  };

  const handleCourseUpdate = async (course: CourseCreate) => {
    if (!state.createdCourseId) {
      return;
    }

    try {
      await updateCourse(state.createdCourseId, course);
      if (state.file && state.file.name !== 'Image Uploaded') {
        await createCourseCover(state.createdCourseId, state.file);
      }
      showMessage(t('courseUpdated') as string, 'success');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongUpdated') as string, 'error');
      }
    }
  };

  const handlePathClick = (path: TagType) => {
    if (
      path.childTags &&
      !state.selectedSubject?.some((subject) => path.childTags?.find((s) => s.id === subject.id))
    ) {
      const updatedPath = state.selectedPath?.filter((tag) => tag.id !== path.id);
      dispatch({
        type: ActionType.SET_PATH,
        payload: updatedPath,
      });
    } else {
      const updatedPath = [...(state.selectedPath || []), path];
      dispatch({
        type: ActionType.SET_PATH,
        payload: updatedPath,
      });
    }

    dispatch({
      type: ActionType.SET_CLICKED_PATH,
      payload: state.clickedPath?.id === path.id ? undefined : path,
    });
  };

  const handleSubjectClick = (subject: TagType) => {
    const isSelected = state.selectedSubject?.some((subj) => subj.id === subject.id);
    if (isSelected) {
      const updatedSubjects = state.selectedSubject?.filter((subj) => subj.id !== subject.id);
      dispatch({
        type: ActionType.SET_SUBJECT,
        payload: updatedSubjects,
      });
      if (
        !updatedSubjects?.some((subject) =>
          state.clickedPath?.childTags?.find((s) => s.id === subject.id)
        )
      ) {
        const updatedPath = state.selectedPath?.filter((tag) => tag.id !== state.clickedPath?.id);
        dispatch({
          type: ActionType.SET_PATH,
          payload: updatedPath,
        });
      }
    } else {
      const updatedSubjects = [...(state.selectedSubject || []), subject];
      dispatch({
        type: ActionType.SET_SUBJECT,
        payload: updatedSubjects,
      });
      if (!state.selectedSubject?.some((s) => s.id === subject.parentTagId)) {
        const updatedPath = [...(state.selectedPath || []), state.clickedPath];
        dispatch({
          type: ActionType.SET_PATH,
          payload: updatedPath,
        });
      }
    }
  };

  const onImageChange = (file: File) => {
    dispatch({ type: ActionType.SET_FILE, payload: file });
  };

  return (
    <>
      {state.openDeleteModal && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('course') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={onCourseDelete}>
                {t('delete')}
              </Button>
              <Button
                type="neutral"
                onClick={() => dispatch({ type: ActionType.SET_OPEN_DELETE_MODAL, payload: false })}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex">
        <div className="flex flex-col w-7/12 gap-8">
          <div className="flex flex-row  gap-3">
            <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
            <p className="font-Poppins text-[#080940] text-2xl font-semibold">
              {t('publishNewCourse')}
            </p>
          </div>
          <div className="flex flex-row gap-5">
            <p className="font-open-sans  font-semibold text-lg">{t('courseTitle')}</p>
            <input
              className="border-b-2 border-[#477DEE]  w-2/3 outline-none placeholder-gray-400::placeholder font-semibold text-xl text-gray-400 pl-2"
              placeholder={t('courseTitle') as string}
              value={state.title}
              onChange={(event) =>
                dispatch({ type: ActionType.SET_TITLE, payload: event.target.value })
              }
            />
          </div>
          <div className="flex flex-row w-10/12 gap-1 ">
            <p className="font-open-sans  font-semibold text-lg">{t('levels')}</p>
            <div className="pl-10 flex flex-row w-full gap-2">
              {loadingLevels
                ? [1, 2, 3, 4].map((el) => (
                    <Tag
                      key={el}
                      onClick={() => console.log('')}
                      tag={el as unknown as TagType}
                      selected={false}
                      tagKey="name"
                      isLoading={true}
                    />
                  ))
                : levels?.items.map((level: TagType) => (
                    <Tag
                      onClick={() => {
                        dispatch({
                          type: ActionType.SET_LEVEL,
                          payload: state.selectedLevel?.id === level.id ? undefined : level,
                        });
                      }}
                      tag={level}
                      selected={level.id === state.selectedLevel?.id}
                      key={level.id}
                      tagKey="name"
                    />
                  ))}
            </div>
          </div>
          <div className="flex flex-row w-10/12 gap-1 ">
            <p className="font-open-sans  font-semibold text-lg">{t('years')}</p>
            <div className="pl-10 flex flex-row w-full gap-2">
              {loadingYears
                ? [1, 2, 3, 4].map((el) => (
                    <Tag
                      key={el}
                      onClick={() => console.log('')}
                      tag={el as unknown as TagType}
                      selected={false}
                      tagKey="name"
                      isLoading={true}
                    />
                  ))
                : years?.items.map((year: TagType) => (
                    <Tag
                      onClick={() => {
                        dispatch({
                          type: ActionType.SET_YEAR,
                          payload: state.selectedYear?.id === year.id ? undefined : year,
                        });
                      }}
                      tag={year}
                      selected={year.id === state.selectedYear?.id}
                      key={year.id}
                      tagKey="name"
                    />
                  ))}
            </div>
          </div>
          <div className="flex flex-row w-10/12 gap-1 ">
            <p className="font-open-sans  font-semibold text-lg">{t('paths')}</p>
            <div className="pl-10 flex flex-row w-full gap-2">
              {loadingPaths
                ? [1, 2, 3, 4].map((el) => (
                    <Tag
                      key={el}
                      onClick={() => console.log('')}
                      tag={el as unknown as TagType}
                      selected={false}
                      tagKey="name"
                      isLoading={true}
                    />
                  ))
                : paths?.items.map((path: TagType) => (
                    <Tag
                      onClick={() => handlePathClick(path)}
                      tag={path}
                      selected={!!state.selectedPath?.find((p) => p.id == path.id)}
                      key={path.id}
                      tagKey="name"
                    />
                  ))}
            </div>
          </div>
          <div className="flex flex-row w-10/12 gap-1 ">
            <p className="font-open-sans  font-semibold text-lg">{t('subjects')}</p>
            <div className="pl-10 flex flex-row w-full gap-2">
              {loadingSubjects
                ? [1, 2, 3, 4].map((el) => (
                    <Tag
                      key={el}
                      onClick={() => console.log('')}
                      tag={el as unknown as TagType}
                      selected={false}
                      tagKey="name"
                      isLoading={true}
                    />
                  ))
                : subjects?.items.map((subject: TagType) => (
                    <Tag
                      onClick={() => handleSubjectClick(subject)}
                      tag={subject}
                      selected={!!state.selectedSubject?.find((s) => s.id === subject.id)}
                      key={subject.id}
                      tagKey="name"
                    />
                  ))}
            </div>
          </div>
          <div className="flex flex-row  gap-12 items-center w-12/12">
            <div className="rounded-full p-5 bg-white shadow-md">
              <Image width={20} height={20} src={CalendarIcon.src} alt="Upload Icon" />
            </div>
            <p className="font-open-sans w-3/12 font-semibold text-lg">{t('isFeatured')}</p>
            <input
              type="checkbox"
              checked={state.isFeatured}
              onChange={(event) =>
                dispatch({ type: ActionType.SET_IS_FEATURED, payload: event.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-row gap-12 items-center">
            <div className="rounded-full p-5 bg-white shadow-md">
              <Image width={20} height={20} src={CalendarIcon.src} alt="Upload Icon" />
            </div>
            <CoverUpload onImageChange={onImageChange} image={state.file?.name} />
          </div>
          <div className="flex flex-row  gap-12 items-center w-12/12">
            <div className="rounded-full p-5 bg-white shadow-md">
              <Image
                width={18}
                height={18}
                src={CaseIcon.src} //messing icon
                alt="VectorIcon"
              />
            </div>

            <p className="font-open-sans w-3/12 font-semibold text-lg">{t('instructors')}</p>
            {/* TODO: adapt the component below so we can select mutiple instrutors */}
            <AutoCompleteInput
              onChange={(value) =>
                dispatch({ type: ActionType.SET_INSTRUCTORS_IDS, payload: [value.id] })
              }
              data={instructorsList}
              valueKey="fullName"
              valueId="id"
              className="border-l-2 border-[#477DEE]  w-8/12 outline-none placeholder-gray-400::placeholder font-semibold text-xl text-gray-400 pl-2"
              placeholder={t('selectInstructors') as string}
              type="text"
              name="name"
              disabled={false}
              defaultValue={editInstructor}
            />
          </div>
          <div className="flex flex-row gap-12 items-start">
            <div className="rounded-full p-5 bg-white shadow-md flex ">
              <Image width={20} height={20} src={TextAlignIcon.src} alt="TextAlignIcon" />
            </div>
            <textarea
              className="w-2/3 bg-[#B4B4C124] h-36 outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 pt-5 pl-5"
              value={state.description}
              style={{ minHeight: '100px' }}
              placeholder={t('addDescription') as string}
              onChange={(event) =>
                dispatch({ type: ActionType.SET_DESCRIPTION, payload: event.target.value })
              }
            />
          </div>

          <div className="flex flex-row gap-12 items-start">
            <div className="rounded-full p-5 bg-white shadow-md flex ">
              <Image width={20} height={20} src={TextAlignIcon.src} alt="TextAlignIcon" />
            </div>
            <input
              onChange={(event) =>
                dispatch({ type: ActionType.SET_SHORT_DESCRIPTION, payload: event.target.value })
              }
              value={state.shortDescription}
              className="w-2/3 bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 py-3 px-4 mt-3"
              placeholder={t('shortDescription') as string}
            />
          </div>

          <div className="flex flex-row gap-12 items-start">
            <div className="rounded-full p-5 bg-white shadow-md flex ">
              <Image width={20} height={20} src={TextAlignIcon.src} alt="TextAlignIcon" />
            </div>
            <div className="flex flex-row flex-wrap gap-1 items-start w-full">
              {state.objectives.map((objective, index) => (
                <div key={index} className="flex flex-row w-1/3 gap-1">
                  <input
                    onChange={(e) => {
                      const newObjectives = [...state.objectives];
                      newObjectives[index] = e.target.value;
                      dispatch({ type: ActionType.SET_OBJECTIVES, payload: newObjectives });
                    }}
                    value={objective}
                    placeholder={t('objective') as string}
                    className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 py-3 px-4 mt-3"
                  />
                  {state.objectives.length - 1 === index && (
                    <button
                      onClick={() =>
                        dispatch({
                          type: ActionType.SET_OBJECTIVES,
                          payload: [...state.objectives, ''],
                        })
                      }
                      className="border hover:bg-blue-600 bg-[#2686FF] cursor-pointer rounded-md font-open-sans font-normal text-white text-sm py-0 px-4 mt-3"
                    >
                      {'+'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-12 items-center">
            <div className="rounded-full p-5 bg-white shadow-md flex ">
              <Image width={20} height={20} src={TextAlignIcon.src} alt="TextAlignIcon" />
            </div>
            <div className="w-2/3 flex flex-row border rounded-lg justify-around items-center bg-[#B4B4C124]">
              <p className="font-open-sans font-semibold text-md w-2/3 text-center">
                {t('priceInDZD')}
              </p>
              <input
                type="number"
                value={state.price}
                onChange={(event) =>
                  dispatch({ type: ActionType.SET_PRICE, payload: event.target.value })
                }
                className="w-full pl-16 bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 py-3 px-4"
                placeholder={t('price') as string}
              />
            </div>
          </div>
          <div className="flex flex-row gap-12 items-center pb-10">
            <div className="rounded-full p-5 bg-white shadow-md flex ">
              <Image width={20} height={20} src={TextAlignIcon.src} alt="TextAlignIcon" />
            </div>
            <div className="w-2/3">
              {course?.id || state.createdCourseId ? (
                <Quizzes
                  elementId={(course?.id || state.createdCourseId) as string}
                  type={'courseId'}
                />
              ) : undefined}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-4/12 gap-2">
          <div className="flex flex-row gap-2 pt-10">
            <Button onClick={onCourseDraft} type="neutral">
              {t('saveDraft')}
            </Button>
            <Button onClick={onCourseSave} type="info">
              {course?.id ? t('update') : t('publish')}
            </Button>
            {state.createdCourseId && (
              <Button
                type="danger"
                onClick={() => dispatch({ type: ActionType.SET_OPEN_DELETE_MODAL, payload: true })}
              >
                {t('delete')}
              </Button>
            )}
          </div>
          {state.createdCourseId && <Sections courseId={state.createdCourseId} />}
        </div>
      </div>
    </>
  );
};

export default NewCourse;
