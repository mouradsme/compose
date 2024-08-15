import { BACKEND_URL } from '@/common/config';
import { Section, SectionCreate } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const createSection = async (courseId: string, section: SectionCreate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.sections.list}`,
    method: 'POST',
    data: section,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const getSections = async (courseId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.courses.list}/${courseId}/${URLS.sections.list}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const updateSection = async (section: Section) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.sections.list}/${section.id}`,
    method: 'PUT',
    data: section,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { createSection, getSections, updateSection };

export default Object.freeze({
  createSection,
  getSections,
  updateSection,
});
