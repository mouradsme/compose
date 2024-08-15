import { ACCESS_TOKEN_NAME } from '@/common/config';
import { UserSessionData } from '@/common/types/common';
import { getCookie, setCookie } from 'cookies-next';

const getUserInfoClient = () => {
  const cookie = getCookie(ACCESS_TOKEN_NAME);
  if (!cookie) {
    return {} as UserSessionData;
  }

  const data = JSON.parse(cookie.toString());
  if (!data) {
    return {} as UserSessionData;
  }
  return data as unknown as UserSessionData;
};

const setUserInfoClient = (user: UserSessionData) => {
  setCookie(ACCESS_TOKEN_NAME, JSON.stringify(user));
};

const verifyCaptchaClient = async (token: string): Promise<Response> => {
  const res = await fetch('/api/captcha', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return res;
};

export { getUserInfoClient, setUserInfoClient, verifyCaptchaClient };

export default Object.freeze({
  getUserInfoClient,
  setUserInfoClient,
  verifyCaptchaClient,
});
