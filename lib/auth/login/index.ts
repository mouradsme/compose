import { BACKEND_URL } from '@/common/config';
import { StudentLogin } from '@/common/types/common';
import { AdminLogins } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';
import axios from 'axios';
import https from 'https';

const singinStudentServer = async (student: StudentLogin) => {
  const res = await axios(`${BACKEND_URL}/${URLS.auth.signin.student}`, {
    method: 'POST',
    data: JSON.stringify(student),
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
};

const singinStudentClient = async (student: StudentLogin): Promise<Response> => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ student }),
  });
  return res;
};

const singinAdminServer = async (admin: AdminLogins) => {
  const res = await axios({
    url: `${BACKEND_URL}/${URLS.auth.signin.student}`,
    method: 'POST',
    data: JSON.stringify(admin),
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
};

const singinAdminClient = async (admin: AdminLogins): Promise<Response> => {
  const res = await fetch('/api/auth/admins/signin', {
    method: 'POST',
    body: JSON.stringify({ admin }),
  });
  return res;
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.auth.password.change}`,
    method: 'POST',
    data: {
      currentPassword,
      newPassword,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const resetPassword = async (email: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.auth.password.reset}`,
    method: 'POST',
    data: {
      email,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const confirmResetPassword = async (email: string, newPassword: string, token: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.auth.password.confirm}`,
    method: 'POST',
    data: {
      email,
      newPassword,
      token,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export {
  singinStudentServer,
  singinStudentClient,
  singinAdminServer,
  singinAdminClient,
  changePassword,
  resetPassword,
  confirmResetPassword,
};

export default Object.freeze({
  singinStudentServer,
  singinStudentClient,
  singinAdminServer,
  singinAdminClient,
  changePassword,
  resetPassword,
  confirmResetPassword,
});
