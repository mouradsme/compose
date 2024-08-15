import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';

const fetchWilayas = async () => {
  const res = await httpHandler({
    method: 'GET',
    url: `${BACKEND_URL}/${URLS.wilayas.list}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const fetchCommunes = async (code: string) => {
  const res = await httpHandler({
    method: 'GET',
    url: `${BACKEND_URL}/${URLS.wilayas.list}/${code}/${URLS.communes.list}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { fetchWilayas, fetchCommunes };

export default Object.freeze({
  fetchWilayas,
  fetchCommunes,
});
