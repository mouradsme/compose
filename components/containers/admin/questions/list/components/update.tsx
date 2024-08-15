import { Question } from '@/common/types/common';
import { useTranslation } from 'next-i18next';
import { useReducer } from 'react';

enum ActionType {
  SET_CONTENT = 'SET_CONTENT',
  REMOVE_CONTENT = 'REMOVE_CONTENT',
  ADD_ANSWER = 'ADD_ANSWER',
  UPDATE_ANSWER = 'UPDATE_ANSWER',
}

type Action = {
  type: ActionType;
  payload: any;
};

const updateQuestionReducer = (state: Question, action: Action) => {
  switch (action.type) {
    case ActionType.SET_CONTENT:
      return { ...state, content: action.payload };
    case ActionType.REMOVE_CONTENT: {
      if (state.content.length === 1) {
        return state;
      }
      const index = action.payload;
      const newContent = state.content.filter((_, i) => i !== index);
      return { ...state, content: newContent };
    }
    case ActionType.ADD_ANSWER:
      return {
        ...state,
        suggestedAnswers: [...state.suggestedAnswers, { answer: '', isCorrect: false }],
      };
    case ActionType.UPDATE_ANSWER: {
      const index = action.payload.index;
      state.suggestedAnswers[index].answer = action.payload.answer;
      state.suggestedAnswers[index].isCorrect = action.payload.isCorrect;
      return state;
    }
    default:
      return state;
  }
};

interface UpdateQuestionProps {
  onSubmit: (question: Question) => void;
  onCancel: () => void;
  question: Question;
}

const UpdateQuestion = ({ onSubmit, onCancel, question }: UpdateQuestionProps) => {
  const { t } = useTranslation('quizzes');
  const [state, dispatch] = useReducer(updateQuestionReducer, question);

  return (
    <div className="p-5">
      <div className="p-5">
        <h4 className="text-xl font-semibold  mb-1">{t('updateAQuizQuestion')}</h4>
        <p className="text-xs mb-5 text-red-600">{t('clickOnCheckbox')}</p>
        {state.content.map((contentItem: string, index: number) => (
          <div key={index} className="flex flex-row items-center">
            <textarea
              placeholder={`${t('questionContentPlaceholder')} ${index + 1}`}
              className="w-full p-2 border rounded mb-4"
              style={{ minHeight: '100px' }}
              value={contentItem}
              onChange={(e) => {
                const newContent = [...state.content];
                newContent[index] = e.target.value;
                dispatch({ type: ActionType.SET_CONTENT, payload: newContent });
              }}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mx-2 h-fit"
              onClick={() => dispatch({ type: ActionType.REMOVE_CONTENT, payload: index })}
            >
              -
            </button>
          </div>
        ))}
        {state.suggestedAnswers &&
          state.suggestedAnswers.map((ans, index) => (
            <div key={index} className="mb-4 flex flex-row gap-4">
              <input
                type="text"
                placeholder={`${t('answerPlaceholder')} ${index + 1}`}
                className="w-full p-2 border rounded mb-2"
                defaultValue={ans?.answer}
                onChange={(e) =>
                  dispatch({
                    type: ActionType.UPDATE_ANSWER,
                    payload: { index, isCorrect: ans.isCorrect, answer: e.target.value },
                  })
                }
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  defaultChecked={ans?.isCorrect}
                  onChange={(e) =>
                    dispatch({
                      type: ActionType.UPDATE_ANSWER,
                      payload: { index, isCorrect: e.target.checked, answer: ans.answer },
                    })
                  }
                />
              </label>
            </div>
          ))}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => dispatch({ type: ActionType.ADD_ANSWER, payload: undefined })}
        >
          {t('addAnswerButton')}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={() =>
            dispatch({ type: ActionType.SET_CONTENT, payload: [...state.content, ''] })
          }
        >
          {t('addQuestionButton')}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={async () => await onSubmit(state)}
        >
          {t('update')}
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-4" onClick={onCancel}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default UpdateQuestion;
