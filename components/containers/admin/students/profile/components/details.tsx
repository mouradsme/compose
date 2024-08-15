import {
  StudentSubscription,
  StudentSubscriptionUpdate,
  SubscriptionStatus,
} from '@/common/types/common';
import React, { useState } from 'react';
import Image from 'next/image';
import useRequest from '@/hooks/request';
import URLS from '@/common/urls';
import { BACKEND_URL } from '@/common/config';
import { useTranslation } from 'next-i18next';

interface DetailsProps {
  subscription: StudentSubscription;
  onSubmit: (sub: StudentSubscriptionUpdate) => void;
  onCancel: () => void;
}

const Details = ({ subscription, onCancel, onSubmit }: DetailsProps) => {
  const { t } = useTranslation('students');
  const [status, setStatus] = useState(subscription.status);
  const [comment, setComment] = useState('');

  const { data } = useRequest({
    url: subscription.hasProofFile
      ? `${BACKEND_URL}/${URLS.subscribtions.student}/${subscription.id}/${URLS.subscribtions.proof}`
      : undefined,
  });

  const handleStatusChange = (value: SubscriptionStatus) => {
    setStatus(value);
  };

  const handleCommentChange = (value: string) => {
    setComment(value);
  };

  const handleSubmit = async () => {
    const subUpdate: StudentSubscriptionUpdate = { status, comment };
    onSubmit(subUpdate);
  };

  return (
    <div className="flex flex-col gap-5">
      <p>
        <strong>{t('studentName')}</strong> {subscription.student.fullName}
      </p>
      <p>
        <strong>{t('subscriptionPlan')}</strong>
        {subscription.subscriptionPlan.translations?.[0]?.name}
      </p>
      <p>
        <strong>{t('price')}</strong> ${subscription.subscriptionPlan.price}
      </p>
      <p>
        <strong>{t('duration')}</strong> {subscription.subscriptionPlan.durationInDays} {t('days')}
      </p>
      <p>
        <strong>{t('paymentMethod')}</strong> {subscription.paymentMethod.translations?.[0]?.name}
      </p>
      <div>
        <label>
          <strong>{t('statusAdd')}</strong>
          <select
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            value={status}
            onChange={(event) => handleStatusChange(event.target.value as SubscriptionStatus)}
          >
            <option value="PENDING">{t('pending')}</option>
            <option value="APPROVED">{t('approved')}</option>
            <option value="REJECTED">{t('rejected')}</option>
            <option value="SUSPENDED">{t('suspended')}</option>
            <option value="EXPIRED">{t('expired')}</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <strong>{t('comment')}</strong>
          <textarea
            value={comment}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            style={{ minHeight: '100px' }}
            placeholder="Comment"
            onChange={(event) => handleCommentChange(event.target.value)}
          ></textarea>
        </label>
      </div>
      {false && (
        <div>
          <h3>{t('proofFile')}</h3>
          <Image src={data} alt="Proof" />
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-1/3 flex justify-center cursor-pointer"
      >
        <p className="font-open-sans font-normal text-sm text-white">{t('save')}</p>
      </button>
      <button
        onClick={onCancel}
        className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md w-1/3 flex justify-center cursor-pointer"
      >
        <p className="font-open-sans font-normal text-sm text-white">{t('cancel')}</p>
      </button>
    </div>
  );
};

export default Details;
