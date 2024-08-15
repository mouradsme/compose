import { BACKEND_URL } from '@/common/config';
import { ProfileUpdate } from '@/common/types/common';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const setActivity = async (startTime: string, endTime: string) => {
  const token = getUserInfoClient().accessToken;
  const res = httpHandler({
    url: `${BACKEND_URL}/${URLS.me.activity}`,
    method: 'POST',
    data: {
      startTime: startTime,
      endTime: endTime,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res;
};

const updateProfile = async (profile: ProfileUpdate) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.me.profile}`,
    method: 'PATCH',
    data: profile,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const deleteProfile = async () => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.me.profile}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export { setActivity, updateProfile, deleteProfile };

export default Object.freeze({
  setActivity,
  updateProfile,
  deleteProfile,
});
