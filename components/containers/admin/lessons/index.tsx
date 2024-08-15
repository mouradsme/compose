import { lessonSchema } from '@/common/schemas';
import { RecordFromFields, Lesson, LessonCreate } from '@/common/types/common';
import { createLesson, getLessons, updateLesson } from '@/lib/lessons';
import { useEffect, useReducer } from 'react';
import { ValidationError } from 'yup';
import AddContent from '@/components/common/cards/add';
import ShowContent from '@/components/common/cards/show';
import Elements from '@/components/containers/admin/elements';
import Modal from '@/components/common/elements/modal';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

interface LessonProps {
  sectionId: string;
}

interface LessonState {
  title: string;
  description: string;
  lessonOrder: number | undefined;
  selectedLesson: Lesson | undefined;
  lessons: Lesson[] | undefined;
  editLesson: Lesson | undefined;
}

enum ActionType {
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_SELECTED_LESSON = 'SET_SELECTED_LESSON',
  SET_LESSONS = 'SET_LESSONS',
  SET_EDIT_LESSON = 'SET_EDIT_LESSON',
  SET_LESSON_ORDER = 'SET_LESSON_ORDER',
}

type Action = {
  type: ActionType;
  payload: any;
};

const initialState: LessonState = {
  title: '',
  description: '',
  lessonOrder: undefined,
  selectedLesson: undefined,
  lessons: undefined,
  editLesson: undefined,
};

const LessonsReducer = (state: LessonState, action: Action): LessonState => {
  switch (action.type) {
    case ActionType.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };

    case ActionType.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };

    case ActionType.SET_SELECTED_LESSON:
      return {
        ...state,
        selectedLesson: action.payload,
      };

    case ActionType.SET_LESSONS:
      return {
        ...state,
        lessons: action.payload,
      };
    case ActionType.SET_EDIT_LESSON:
      return {
        ...state,
        editLesson: action.payload,
      };
    default:
      return state;
  }
};

const Lessons = ({ sectionId }: LessonProps) => {
  const { t } = useTranslation('courses');
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(LessonsReducer, initialState);

  useEffect(() => {
    getLessons(sectionId).then((data) => {
      dispatch({ type: ActionType.SET_LESSONS, payload: data.data.items });
    });
  }, [sectionId]);

  const listLessons = () => {
    getLessons(sectionId).then((data) => {
      dispatch({ type: ActionType.SET_LESSONS, payload: data.data.items });
    });
  };

  const validateLesson = (content: LessonCreate) => {
    try {
      lessonSchema.validateSync(content);
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      }
      return false;
    }
    return true;
  };

  const onLessonSubmit = async (content: RecordFromFields) => {
    if (!sectionId) {
      return;
    }

    const _content = content as unknown as LessonCreate;
    const isValid = validateLesson(_content);

    if (!isValid) {
      return;
    }

    const res = await createLesson(sectionId, _content);

    if (res.status === 201) {
      showMessage(t('lessonAdded'), 'success');
      listLessons();
    } else {
      showMessage(t('lessonCreationError'), 'error');
    }
  };

  const onLessonUpdate = async (content: Lesson | undefined) => {
    if (!content) {
      return;
    }

    if (!sectionId) {
      return;
    }

    const _content = {
      title: content.title,
      description: content.description,
      lessonOrder: content.lessonOrder,
    };
    const isValid = validateLesson(_content);

    if (!isValid) {
      return;
    }

    const res = await updateLesson(content);

    if (res.status === 202) {
      showMessage(t('lessonUpdated'), 'success');
      dispatch({ type: ActionType.SET_EDIT_LESSON, payload: undefined });
      listLessons();
    } else {
      showMessage(t('lessonUpdateError'), 'error');
    }
  };

  return (
    <>
      {state.editLesson?.id && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4 ">
            <p className="text-lg font-bold font-Poppins">{t('updateLesson')}</p>
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('lessonTitlePlaceholder') as string}
              name={'title'}
              value={state.editLesson.title}
              onChange={(event) => {
                const title = event.target.value;
                const section = { ...state.editLesson, title };
                dispatch({ type: ActionType.SET_EDIT_LESSON, payload: section });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('lessonDescriptionPlaceholder') as string}
              name={'description'}
              value={state.editLesson.description}
              onChange={(event) => {
                const description = event.target.value;
                const section = { ...state.editLesson, description };
                dispatch({ type: ActionType.SET_EDIT_LESSON, payload: section });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'number'}
              placeholder={t('lessonOrderPlaceholder') as string}
              name={'order'}
              value={state.editLesson.lessonOrder}
              onChange={(event) => {
                const lessonOrder = event.target.value;
                const section = { ...state.editLesson, lessonOrder };
                dispatch({ type: ActionType.SET_EDIT_LESSON, payload: section });
              }}
            />
            <Button onClick={async () => await onLessonUpdate(state.editLesson)}>
              {t('update')}
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between items-center gap-2 pt-5">
        <p className="font-open-sans font-semibold text-[#000000] text-lg">{t('lessonsHeader')}</p>
      </div>

      <div className="w-full">
        <AddContent
          type={t('lesson')}
          fields={[
            {
              name: 'title',
              placeholder: t('enterLessonTitle') as string,
              value: state.title,
            },
            {
              name: 'description',
              placeholder: t('enterLessonDescription') as string,
              value: state.description,
            },
            {
              name: 'lessonOrder',
              placeholder: t('enterLessonOrder') as string,
              value: state.lessonOrder,
            },
          ]}
          onSubmit={onLessonSubmit}
        />
        {state.lessons &&
          state.lessons.map((lesson) => (
            <ShowContent
              key={lesson.id}
              title={`${lesson.title} "${lesson.lessonOrder}"`}
              content={lesson.description}
            >
              <>
                <Button
                  onClick={() => dispatch({ type: ActionType.SET_EDIT_LESSON, payload: lesson })}
                >
                  {t('editButton')}
                </Button>
                <Elements lessonId={lesson.id} />
              </>
            </ShowContent>
          ))}
      </div>
    </>
  );
};

export default Lessons;
