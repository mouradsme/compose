import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { getUserInfoClient } from '@/lib/common';
import { CourseCreate } from '@/common/types/common';
import { httpHandler } from '@/common/utils';

const fetchCourses = async (offset: number, token: string, limit: number = ITEMS_PER_PAGE) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createCourse = async (course: CourseCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}`,
    method: 'POST',
    data: course,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateCourse = async (id: string, course: CourseCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${id}`,
    method: 'PUT',
    data: course,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const fetchCourseServer = async (id: string, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${id}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createCourseCover = async (courseId: string, file: File) => {
  const token = getUserInfoClient().accessToken;
  const formData = new FormData();
  formData.append('file', file);
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.courses.cover}`,
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

const getCourseCover = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.courses.cover}`,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

const deleteCourse = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const enrollCourse = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;

  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/enroll`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getEnrolledCourses = async (offset = 0, limit = 200) => {
  const token = getUserInfoClient().accessToken;

  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${URLS.courses.enrolled}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getEnrolledCoursesServer = async (token: string, offset = 0, limit = 200) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${URLS.courses.enrolled}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getProgressCourse = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;

  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.courses.progress}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export {
  fetchCourses,
  createCourse,
  updateCourse,
  fetchCourseServer,
  createCourseCover,
  getCourseCover,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getProgressCourse,
  getEnrolledCoursesServer,
};

export default Object.freeze({
  fetchCourses,
  createCourse,
  updateCourse,
  fetchCourseServer,
  createCourseCover,
  getCourseCover,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getProgressCourse,
  getEnrolledCoursesServer,
});
