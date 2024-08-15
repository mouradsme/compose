import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';

const getStudentsServer = async (token: string, offset: number, limit: number = ITEMS_PER_PAGE) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.students.list}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getStudentServer = async (studentId: string, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.students.list}/${studentId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { getStudentsServer, getStudentServer };

export default Object.freeze({
  getStudentsServer,
  getStudentServer,
});
