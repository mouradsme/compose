import { BACKEND_URL } from '@/common/config';
import { AdminCreate, StudentSignup } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const registerStudentServer = async (student: StudentSignup) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.auth.register.student}`,
    method: 'POST',
    data: JSON.stringify(student),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
};

const registerAdmin = async (admin: AdminCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.auth.register.admin}`,
    method: 'POST',
    data: admin,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res;
};

const registerStudentClient = async (student: StudentSignup): Promise<Response> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ student }),
  });
  return res;
};

export { registerStudentServer, registerStudentClient, registerAdmin };

export default Object.freeze({
  registerStudentServer,
  registerStudentClient,
  registerAdmin,
});
