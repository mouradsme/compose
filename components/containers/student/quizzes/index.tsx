import { BACKEND_URL } from '@/common/config';
import Question from '@/components/common/elements/question';
import { Answer, Question as QuestionType, Quiz } from '@/common/types/common';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';
import { createStudentQuestion } from '@/lib/questions';
import { useEffect, useState } from 'react';
import { useMessage } from '@/contexts/message';

interface QuizzProps {
  quizz: Quiz;
  onQuizzAnswered: () => void;
}

const Quizz = ({ quizz, onQuizzAnswered }: QuizzProps) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<QuestionType[]>([]);
  const { showMessage } = useMessage();
  const {
    data: questions,
    mutate,
    error,
  } = useRequest({
    url: `${BACKEND_URL}/${URLS.quizzes.list}/${quizz.id}/${URLS.questions.list}`,
  });

  useEffect(() => {
    if (error) {
      const message = error.response?.data.errors[0].message;
      showMessage(message, 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  const onAnswerSubmit = async (question: QuestionType, answer: Answer) => {
    const res = await createStudentQuestion(question.id, answer);
    if (res.status === 200) {
      const { answeredCorrectly } = res.data;
      if (answeredCorrectly && !answeredQuestions.some((q) => q.id === question.id)) {
        const questions = answeredQuestions;
        questions.push(question);
        setAnsweredQuestions(questions);
      }
      if (answeredQuestions?.length === questions.items.length) {
        onQuizzAnswered();
      }
      mutate();
      return answeredCorrectly as boolean;
    }
    mutate();
    return undefined;
  };

  return (
    <div className="flex flex-col gap-3 overflow-y-scroll scrollbar-hidden h-full lg:h-[60vh] 2xl:h-[75vh]">
      {questions?.items?.map((question: QuestionType, index: number) => (
        <Question question={question} index={index} key={index} onAnswerSubmit={onAnswerSubmit} />
      ))}
    </div>
  );
};

export default Quizz;
