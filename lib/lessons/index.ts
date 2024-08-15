import { BACKEND_URL } from '@/common/config';
import { Lesson, LessonCreate } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const createLesson = async (sectionId: string, lesson: LessonCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.sections.list}/${sectionId}/${URLS.lessons.list}`,
    method: 'POST',
    data: lesson,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getLessons = async (sectionId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.sections.list}/${sectionId}/${URLS.lessons.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getLessonsDetailed = async (sectionId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.sections.list}/${sectionId}/${URLS.lessons.detailed}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateLesson = async (lesson: Lesson) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.lessons.list}/${lesson.id}`,
    method: 'PUT',
    data: lesson,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const fetchLessonServer = async (lessonId: string, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.lessons.list}/${lessonId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createLesson, getLessons, updateLesson, fetchLessonServer, getLessonsDetailed };

export default Object.freeze({
  createLesson,
  getLessons,
  updateLesson,
  fetchLessonServer,
  getLessonsDetailed,
});
