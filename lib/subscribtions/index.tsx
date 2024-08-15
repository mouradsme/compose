import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { getUserInfoClient } from '@/lib/common';
import {
  Plan,
  PlanCreate,
  StudentSubscriptionUpdate,
  SubscriptionStatus,
} from '@/common/types/common';
import { httpHandler } from '@/common/utils';

const getSubscribtions = async (language: string) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.list}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      language: language,
    },
  });
  return res;
};

const getStudentSubscribtionsServer = async (
  token: string,
  offset = 0,
  limit: number = ITEMS_PER_PAGE,
  status?: SubscriptionStatus
) => {
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.student}?offset=${offset}&limit=${limit}${
      status ? `&status=${status}` : ''
    }`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createSubscription = async (plan: PlanCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.list}`,
    method: 'POST',
    data: plan,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateSubscription = async (id: string, plan: Plan) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.list}/${id}`,
    method: 'PUT',
    data: plan,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteSubscription = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateStudentSubscription = async (id: string, sub: StudentSubscriptionUpdate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.subscribtions.student}/${id}`,
    method: 'PUT',
    data: sub,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export {
  createSubscription,
  getSubscribtions,
  updateSubscription,
  deleteSubscription,
  getStudentSubscribtionsServer,
  updateStudentSubscription,
};
export default Object.freeze({
  createSubscription,
  getSubscribtions,
  updateSubscription,
  deleteSubscription,
  getStudentSubscribtionsServer,
  updateStudentSubscription,
});
