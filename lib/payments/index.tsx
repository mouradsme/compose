import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import { httpHandler } from '@/common/utils';
import { getUserInfoClient } from '@/lib/common';

const createPaymentProof = async (file: File, method: string, subscription: string) => {
  const token = getUserInfoClient().accessToken;
  const formData = new FormData();
  formData.append('file', file);
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.proof.create}?subscriptionPlanId=${subscription}&paymentMethodId=${method}`,
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

const createPaymentSerialNumber = async (serialNumber: string, paymentMethodId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.serials.subscribe}`,
    method: 'POST',
    data: { serialNumber, paymentMethodId },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const registerPaymentSatim = async (subscriptionPlanId: string, paymentMethodId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.satim.register}`,
    method: 'POST',
    data: { subscriptionPlanId, paymentMethodId },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const verifyPaymentSatim = async (orderId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.satim.verify}`,
    method: 'POST',
    data: { orderId },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const refundPaymentSatim = async (orderId: string) => {
  const token = getUserInfoClient().accessToken;
  const res = await httpHandler({
    url: `${BACKEND_URL}/${URLS.satim.refund}`,
    method: 'POST',
    data: { orderId },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

export {
  createPaymentProof,
  createPaymentSerialNumber,
  registerPaymentSatim,
  verifyPaymentSatim,
  refundPaymentSatim,
};

export default Object.freeze({
  createPaymentProof,
  createPaymentSerialNumber,
  registerPaymentSatim,
  verifyPaymentSatim,
  refundPaymentSatim,
});
