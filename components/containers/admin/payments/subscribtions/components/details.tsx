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
import Button from '@/components/common/buttons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface DetailsProps {
  subscription: StudentSubscription;
  onSubmit: (sub: StudentSubscriptionUpdate) => void;
  onCancel: () => void;
}

const Details = ({ subscription, onCancel, onSubmit }: DetailsProps) => {
  const { t } = useTranslation('plans');
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
        <strong>{t('studentNameLabel')}</strong> {subscription.student.fullName}
      </p>
      <p>
        <strong>{t('subscriptionPlanLabel')}</strong>
        {subscription.subscriptionPlan.translations?.[0]?.name}
      </p>
      <p>
        <strong>{t('priceLabel')}</strong> ${subscription.subscriptionPlan.price}
      </p>
      <p>
        <strong>{t('durationLabel')}</strong> {subscription.subscriptionPlan.durationInDays}{' '}
        {t('days')}
      </p>
      <p>
        <strong>{t('paymentMethodLabel')}</strong>{' '}
        {subscription.paymentMethod.translations?.[0]?.name}
      </p>
      <div>
        <label>
          <strong>{t('statusLabel')}</strong>
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
          <strong>{t('commentLabel')}</strong>
          <textarea
            value={comment}
            className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
            style={{ minHeight: '100px' }}
            placeholder="Comment"
            onChange={(event) => handleCommentChange(event.target.value)}
          ></textarea>
        </label>
      </div>
      {data?.fileUrl && (
        <div>
          <strong>{t('proofFileLabel')}</strong>
          <Link href={data.fileUrl} target="_blank">
            <Image src={data.fileUrl} alt="Proof" width={150} height={100} />
          </Link>
        </div>
      )}
      <div className="flex flex-row flew-wrap gap-5">
        <Button type="info" onClick={handleSubmit}>
          {t('save')}
        </Button>
        <Button onClick={onCancel} type="neutral">
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};

export default Details;
