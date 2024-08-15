import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { getUserInfoClient } from '../common';
import { SerialNumberCreate } from '@/common/types/common';
import { httpHandler } from '@/common/utils';

const fetchSerialNumbersServer = async (
  token: string,
  offset = 0,
  limit: number = ITEMS_PER_PAGE
) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.serials.list}?offset=${offset}&limit=${limit}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createSerialNumbers = async (serialNumber: SerialNumberCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.serials.list}`,
    method: 'POST',
    data: serialNumber,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      language: 'en',
    },
  });
  return res;
};

const deleteSerialNumbers = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.serials.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { fetchSerialNumbersServer, createSerialNumbers, deleteSerialNumbers };

export default Object.freeze({
  fetchSerialNumbersServer,
  createSerialNumbers,
  deleteSerialNumbers,
});
