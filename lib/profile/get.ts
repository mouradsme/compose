import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';

const getProfile = async (token: string) => {
  const res = await fetch(`${BACKEND_URL}/${URLS.me.profile}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res;
};

export default getProfile;
