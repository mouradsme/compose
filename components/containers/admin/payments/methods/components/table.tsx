import React from 'react';
import Image from 'next/image';
import UnfoldIcon from '@/public/images/unfold-more.svg';
import { PaymentMethod } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';

interface AdminPaymentMethodsTableProps {
  paymentMethods: PaymentMethod[];
  onDelete: (paymentMethod: PaymentMethod) => void;
  onUpdate: (paymentMethod: PaymentMethod) => void;
}

const AdminPaymentMethodsTable: React.FC<AdminPaymentMethodsTableProps> = ({
  paymentMethods,
  onDelete,
  onUpdate,
}: AdminPaymentMethodsTableProps) => {
  const { t } = useTranslation('plans');
  const headers = [t('name'), t('description'), t('actions')];

  return (
    <div className="w-full pt-3 py-10">
      <div className="bg-white shadow-md">
        <table className="w-full">
          <thead className="bg-[#F5F7F9]">
            <tr>
              {headers.map((header, index) => (
                <th
                  className="font-open-sans text-[#767676] text-sm font-semibold py-3"
                  key={index}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Image width={7} height={7} src={UnfoldIcon.src} alt="unfold_icon" />
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paymentMethods?.map((paymentMethod, index) => (
              <tr className={index % 2 === 0 ? 'bg-[#F5F7F9]' : 'bg-white'} key={paymentMethod.id}>
                <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                  {paymentMethod.translations.find((tr) => tr.language === 'EN')?.name || '-'}
                </td>
                <td className="text-gray-600 font-Poppins text-sm text-center">
                  {paymentMethod.translations.find((tr) => tr.language === 'EN')?.description ||
                    '-'}
                </td>
                <td className="text-gray-600 font-Poppins flex flex-row gap-3 justify-center">
                  <Button type="danger" onClick={() => onDelete(paymentMethod)}>
                    {t('delete')}
                  </Button>
                  <Button type="info" onClick={() => onUpdate(paymentMethod)}>
                    {t('details')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentMethodsTable;
