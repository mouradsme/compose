import { BACKEND_URL } from '@/common/config';
import { QuestionCreate, Question, Answer } from '@/common/types/common'; // Assuming you have a type named QuizCreate
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const createQuestion = async (quizId: string, question: QuestionCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}/${quizId}/${URLS.questions.list}`,
    method: 'POST',
    data: question,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createStudentQuestion = async (questionId: string, answer: Answer) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.questions.list}/${questionId}/${URLS.questions.student}`,
    method: 'POST',
    data: { selectedOptionsIds: [answer.id] },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getQuestions = async (quizId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}/${quizId}/${URLS.questions.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateQuestion = async (question: Question) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.questions.list}/${question.id}`,
    method: 'PUT',
    data: question,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteQuestion = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.questions.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createQuestion, getQuestions, updateQuestion, createStudentQuestion, deleteQuestion };

export default Object.freeze({
  createQuestion,
  getQuestions,
  updateQuestion,
  createStudentQuestion,
  deleteQuestion,
});
