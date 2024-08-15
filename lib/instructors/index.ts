import { BACKEND_URL } from '@/common/config';
import { Instructor, InstructorCreate } from '@/common/types/common';
import URLS from '@/common/urls';
import { getUserInfoClient } from '@/lib/common';
import { httpHandler } from '@/common/utils';

const fetchInstructors = async () => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.instructors.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const fetchInstructorsServer = async (token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.instructors.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createInstructor = async (instructor: InstructorCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.instructors.list}`,
    method: 'POST',
    data: instructor,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateInstructor = async (instructor: Instructor) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.instructors.list}/${instructor.id}`,
    method: 'PUT',
    data: instructor,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteInstructor = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.instructors.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getCourseInstructors = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.instructors.list}?courseId=${courseId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getCourseInstructorsServer = async (courseId: string, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.instructors.list}?courseId=${courseId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export {
  fetchInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  fetchInstructorsServer,
  getCourseInstructors,
  getCourseInstructorsServer,
};

export default Object.freeze({
  fetchInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  fetchInstructorsServer,
  getCourseInstructors,
  getCourseInstructorsServer,
});
