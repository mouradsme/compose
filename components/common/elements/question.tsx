import { Answer, Question } from '@/common/types/common';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

interface QuestionProps {
  question: Question;
  index: number;
  onAnswerSubmit: (question: Question, answer: Answer) => Promise<boolean | undefined>;
}

const Question = ({ question, index, onAnswerSubmit }: QuestionProps) => {
  const { t } = useTranslation('quizzes');
  const { showMessage } = useMessage();
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | undefined>(undefined);

  const onClick = (question: Question, answer: Answer) => {
    if (!question || !answer) {
      return;
    }
    setSelectedAnswer(answer);
  };

  const onSubmit = async () => {
    if (!selectedAnswer) {
      return;
    }

    const res = await onAnswerSubmit(question, selectedAnswer);
    handleAnswerMsg(res);
  };

  const handleAnswerMsg = (value: boolean | undefined) => {
    switch (value) {
      case true: {
        showMessage(t('goodJob'), 'success');
        break;
      }
      case false: {
        showMessage(t('wrongAnswer'), 'error');
        break;
      }
      default: {
        showMessage(t('answerSaveError'), 'error');
        break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 px-8 py-4 border rounded-xl text-xs">
      <div className="text-[#7C8DA6] font-medium">
        {t('question')} {index + 1}
      </div>
      <div className="font-bold text-[#273B54] w-2/3">{question.content}</div>
      <div>
        {question.suggestedAnswers.map((answer: Answer, index: number) => (
          <div
            className={`flex gap-6 mt-3 cursor-pointer ${
              selectedAnswer?.id === answer?.id
                ? 'hover:bg-green-300 bg-green-200 text-white'
                : 'hover:bg-gray-100'
            }`}
            key={answer.id}
            onClick={() => onClick(question, answer)}
          >
            <div className="flex justify-center items-center shadow-md  w-8 h-8 text-gray-400">
              {index + 1}
            </div>
            <div className="flex items-center text-gray-400 text-[0.7rem] w-full h-8 text-gray-400">
              {answer.answer}
            </div>
          </div>
        ))}
      </div>
      <button
        className="font-bold text-[#6B96E9] hover:text-[#6B70E0] hover:bg-gray-200 p-2 w-fit rounded-md disabled:bg-gray-200 disabled:text-[#6B96E9]"
        disabled={!selectedAnswer?.id}
        onClick={onSubmit}
      >
        {t('submitAnswer')}
      </button>
    </div>
  );
};

export default Question;
