import { BACKEND_URL } from '@/common/config';
import { TagCreate, TagUpdate } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const fetchTags = async (
  tagTypes?: string[],
  parentTagId?: string,
  token?: string,
  offset?: number,
  limit?: number
) => {
  const queryParams = [
    tagTypes !== undefined && `tagTypes=${tagTypes.join(',')}`,
    parentTagId !== undefined && `parentTagId=${parentTagId}`,
    offset !== undefined && `offset=${offset}`,
    limit !== undefined && `limit=${limit}`,
  ].filter(Boolean);

  const queryString = queryParams.length > 0 ? `${queryParams.join('&')}` : '';
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.tags.list}?${queryString}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const createTags = async (tag: TagCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.tags.list}`,
    method: 'POST',
    data: tag,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateTag = async (tag: TagUpdate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.tags.list}/${tag.id}`,
    method: 'PUT',
    data: tag,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteTag = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.tags.list}/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getTag = async (id: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.tags.list}/${id}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { fetchTags, createTags, deleteTag, updateTag, getTag };

export default Object.freeze({
  fetchTags,
  createTags,
  deleteTag,
  updateTag,
  getTag,
});
