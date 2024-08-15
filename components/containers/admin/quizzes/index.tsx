import { quizSchema } from '@/common/schemas';
import { RecordFromFields, Quiz, QuizCreate } from '@/common/types/common';
import { createQuiz, getQuizzes, updateQuiz } from '@/lib/quizzes'; // Assuming getQuiz gets a single quiz
import { useEffect, useReducer } from 'react';
import { ValidationError } from 'yup';
import AddContent from '@/components/common/cards/add';
import ShowContent from '@/components/common/cards/show';
import Modal from '@/components/common/elements/modal';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';
import Button from '@/components/common/buttons';

interface QuizProps {
  elementId: string;
  type?: 'elementId' | 'courseId';
}

interface QuizState {
  title: string;
  description: string;
  quiz: Quiz | undefined;
  questionModal: boolean;
  editQuiz: Quiz | undefined;
}

enum ActionType {
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_QUIZ = 'SET_QUIZ',
  SET_QUESTION_MODAL = 'SET_QUESTION_MODAL',
  SET_EDIT_QUIZ = 'SET_EDIT_QUIZ',
}

type Action = {
  type: ActionType;
  payload: any;
};

const initialState: QuizState = {
  title: '',
  description: '',
  quiz: undefined,
  questionModal: false,
  editQuiz: undefined,
};

const QuizzesReducer = (state: QuizState, action: Action): QuizState => {
  switch (action.type) {
    case ActionType.SET_TITLE:
      return { ...state, title: action.payload };
    case ActionType.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case ActionType.SET_QUIZ:
      return { ...state, quiz: action.payload };
    case ActionType.SET_QUESTION_MODAL:
      return { ...state, questionModal: action.payload };
    case ActionType.SET_EDIT_QUIZ:
      return { ...state, editQuiz: action.payload };
    default:
      return state;
  }
};

const Quizzes = ({ elementId, type = 'elementId' }: QuizProps) => {
  const { showMessage } = useMessage();
  const { t } = useTranslation('quizzes');
  const [state, dispatch] = useReducer(QuizzesReducer, initialState);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    getQuizzes(elementId, type).then((data) => {
      dispatch({ type: ActionType.SET_QUIZ, payload: data.data.items?.[0] });
    });
  }, [elementId, type]);

  const listQuizzes = () => {
    getQuizzes(elementId, type).then((data) => {
      dispatch({ type: ActionType.SET_QUIZ, payload: data.data.items?.[0] });
    });
  };

  const validateQuiz = (content: QuizCreate) => {
    try {
      quizSchema.validateSync(content);
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      }
      return false;
    }
    return true;
  };

  const onQuizSubmit = async (content: RecordFromFields) => {
    if (!elementId) return;

    const _content = content as unknown as QuizCreate;
    const isValid = validateQuiz(_content);

    if (!isValid) {
      return;
    }

    const res = await createQuiz(elementId, type, _content);

    if (res.status === 201) {
      showMessage(t('quizAddedSuccessfully'), 'success');
      dispatch({ type: ActionType.SET_QUIZ, payload: res.data });
    } else {
      showMessage(t('somethingWentWrongQuizNotCreated'), 'error');
    }
  };

  const onQuizUpdate = async (content: Quiz | undefined) => {
    if (!content) {
      return;
    }

    if (!elementId) {
      return;
    }

    const _content = { title: content.title, description: content.description };
    const isValid = validateQuiz(_content);

    if (!isValid) {
      return;
    }

    const res = await updateQuiz(content);

    if (res.status === 202) {
      showMessage(t('quizzUpdatedSuccessfully'), 'success');
      dispatch({ type: ActionType.SET_EDIT_QUIZ, payload: undefined });
      listQuizzes();
    } else {
      showMessage(t('somethingWentWrongQuizNotUpdated'), 'error');
    }
  };

  return (
    <>
      {state.editQuiz?.id && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4 ">
            <p className="text-lg font-bold font-Poppins">{t('updateQuizz')}</p>
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('enterQuizTitle') as string}
              name={'title'}
              value={state.editQuiz.title}
              onChange={(event) => {
                const title = event.target.value;
                const section = { ...state.editQuiz, title };
                dispatch({ type: ActionType.SET_EDIT_QUIZ, payload: section });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('enterQuizDescription') as string}
              name={'description'}
              value={state.editQuiz.description}
              onChange={(event) => {
                const description = event.target.value;
                const section = { ...state.editQuiz, description };
                dispatch({ type: ActionType.SET_EDIT_QUIZ, payload: section });
              }}
            />
            <Button onClick={async () => await onQuizUpdate(state.editQuiz)} type="info">
              {t('update')}
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between items-center gap-2 pt-5">
        <p className="font-open-sans font-semibold text-[#000000] text-lg">{t('quiz')}</p>
      </div>
      <div className="w-full">
        {state.quiz ? (
          <ShowContent
            key={state.quiz.id}
            title={state.quiz.title}
            content={state.quiz.description}
          >
            <>
              <button
                onClick={() => dispatch({ type: ActionType.SET_EDIT_QUIZ, payload: state.quiz })}
                className="border hover:bg-blue-600 bg-[#2686FF] cursor-pointer rounded-md font-open-sans font-normal text-white text-sm p-2 mt-2"
              >
                {t('edit')}
              </button>
              {state.quiz?.id && (
                <button
                  className="text-blue-600 mx-3"
                  onClick={() =>
                    router.push(
                      `/admin/dashboard/quizzes/${state.quiz?.id}?courseId=${id as string}`
                    )
                  }
                >
                  {t('questions')}
                </button>
              )}
            </>
          </ShowContent>
        ) : (
          <AddContent
            type="Quiz"
            fields={[
              { name: 'title', placeholder: t('enterQuizTitle') as string, value: state.title },
              {
                name: 'description',
                placeholder: t('enterQuizDescription') as string,
                value: state.description,
              },
            ]}
            onSubmit={onQuizSubmit}
          />
        )}
      </div>
    </>
  );
};

export default Quizzes;
