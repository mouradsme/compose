import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const fetchSupervisors = async (token: string) => {
  const res = await httpHandler(`${BACKEND_URL}/${URLS.supervisors.list}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getStudentSupervisorsServer = async (
  studentId: string,
  token: string,
  offset = 0,
  limit = ITEMS_PER_PAGE
) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.students.list}/${studentId}/${URLS.supervisors.list}&offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const inviteSupervisor = async (
  fullName: string,
  email: string,
  phoneNumber: string,
  supervisorType = 'PARENT'
) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.supervisors.invitation}`,
    method: 'POST',
    data: {
      fullName,
      email,
      phoneNumber,
      supervisorType,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const confirmInviteSupervisor = async (token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.supervisors.confirm}/${token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { fetchSupervisors, getStudentSupervisorsServer, inviteSupervisor, confirmInviteSupervisor };

export default Object.freeze({
  fetchSupervisors,
  getStudentSupervisorsServer,
  inviteSupervisor,
  confirmInviteSupervisor,
});
