import { BACKEND_URL } from '@/common/config';
import { Quiz, QuizCreate } from '@/common/types/common'; // Assuming you have a type named QuizCreate
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

type IdType = 'elementId' | 'courseId';

const createQuiz = async (id: string, type: IdType, quiz: QuizCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}?${type}=${id}`,
    method: 'POST',
    data: quiz,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getQuizzes = async (id: string, type: IdType) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}?${type}=${id}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateQuiz = async (quiz: Quiz) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}/${quiz.id}`,
    method: 'PUT',
    data: quiz,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getQuizzesServer = async (id: string, type: IdType, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.quizzes.list}?${type}=${id}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createQuiz, getQuizzes, updateQuiz, getQuizzesServer };

export default Object.freeze({
  createQuiz,
  getQuizzes,
  updateQuiz,
  getQuizzesServer,
});
