import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const getAdminsServer = async (token: string, offset = 0, limit = ITEMS_PER_PAGE) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.admin.list}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteAdmin = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.admin.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { getAdminsServer, deleteAdmin };

export default Object.freeze({
  getAdminsServer,
  deleteAdmin,
});
