import { BACKEND_URL } from '@/common/config';
import { Element, ElementCreate } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const createElement = async (lessonId: string, element: ElementCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.lessons.list}/${lessonId}/${URLS.elements.list}`,
    method: 'POST',
    data: element,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getElements = async (lessonId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.lessons.list}/${lessonId}/${URLS.elements.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateElement = async (element: Element) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.elements.list}/${element.id}`,
    method: 'PUT',
    data: element,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const completedElement = async (elementId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.elements.list}/${elementId}/${URLS.elements.completed}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createElement, getElements, updateElement, completedElement };

export default Object.freeze({
  createElement,
  getElements,
  updateElement,
  completedElement,
});
