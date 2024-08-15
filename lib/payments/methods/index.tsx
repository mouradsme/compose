import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { getUserInfoClient } from '@/lib/common';
import { PaymentMethod, PaymentMethodCreate } from '@/common/types/common';
import { httpHandler } from '@/common/utils';

const getPaymentMethods = async () => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.methods.list}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createPaymentMethod = async (method: PaymentMethodCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.methods.list}`,
    method: 'POST',
    data: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      language: 'en',
    },
  });
  return res;
};

const updatePaymentMethod = async (id: string, method: PaymentMethod) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.methods.list}/${id}`,
    method: 'PUT',
    data: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      language: 'en',
    },
  });
  return res;
};

const deletePaymentMethod = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.methods.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createPaymentMethod, getPaymentMethods, updatePaymentMethod, deletePaymentMethod };
export default Object.freeze({
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
});
