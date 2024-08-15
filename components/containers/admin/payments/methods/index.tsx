import { PaymentMethod, PaymentMethodCreate } from '@/common/types/common';
import Image from 'next/image';
import AddIcon from '@/public/images/Add.svg';
import Modal from '@/components/common/elements/modal';
import { useState } from 'react';
import {
  createPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
} from '@/lib/payments/methods';
import AddPaymentMethod from './components/add';
import UpdatePaymentMethod from './components/update';
import AdminPaymentMethodsTable from './components/table';
import URLS from '@/common/urls';
import { BACKEND_URL } from '@/common/config';
import useRequest from '@/hooks/request';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { ValidationError } from 'yup';
import { paymentMethodCreateSchema, paymentMethodUpdateSchema } from '@/common/schemas';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';

const Methods = () => {
  const { t } = useTranslation('plans');
  const { data, mutate } = useRequest({
    url: `${BACKEND_URL}/${URLS.methods.list}`,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [methodToUpdate, setMethodUpdate] = useState<PaymentMethod | undefined>(undefined);
  const { showMessage } = useMessage();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const reset = () => {
    mutate();
    setTimeout(() => {
      handleDialogClose();
    }, 2000);
  };

  const handleAddMethod = async (method: PaymentMethodCreate) => {
    try {
      await paymentMethodCreateSchema.validate(method, { context: { isUpdate: false } });
      await createPaymentMethod(method);
      showMessage(t('paymentMethodCreated') as string, 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongCreate') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleUpdateMethod = async (method: PaymentMethod) => {
    try {
      await paymentMethodUpdateSchema.validate(method, { context: { isUpdate: true } });
      await updatePaymentMethod(method.id, method);
      showMessage(t('paymentMethodUpdated') as string, 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongUpdate') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }
    try {
      showMessage(t('paymentMethodDeleted') as string, 'success');
      await deletePaymentMethod(deleteId);
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongDelete') as string, 'error');
      }
    }
    reset();
  };

  const handleUpdateModal = (method: PaymentMethod) => {
    setIsUpdateDialogOpen(true);
    setMethodUpdate(method);
  };

  const handleDeleteModal = async (method: PaymentMethod) => {
    if (!method) {
      return;
    }
    setDeleteId(method.id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      {isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold">{t('addNewPaymentMethod')}</p>
            <AddPaymentMethod onSubmit={handleAddMethod} onCancel={handleDialogClose} />
          </div>
        </Modal>
      )}

      {isUpdateDialogOpen && methodToUpdate && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold">{t('paymentMethodDetails')}</p>
            <UpdatePaymentMethod
              onSubmit={handleUpdateMethod}
              onCancel={handleDialogClose}
              paymentMethod={methodToUpdate}
            />
          </div>
        </Modal>
      )}

      {isDeleteDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('paymentMethodLabel') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={handleDelete}>
                {t('delete')}
              </Button>
              <Button type="neutral" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex flex-row justify-between mb-3">
        <div className="flex flex-row gap-3">
          <Image width={25} height={25} src={AddIcon.src} alt="add-icon" />
          <p className="text-2xl font-semibold">{t('paymentMethods')}</p>
        </div>
        <div
          onClick={handleDialogOpen}
          className="w-3/12 border flex flex-row rounded-full gap-1 h-8 justify-center items-center cursor-pointer bg-gradient-to-r from-[#0F54EF] to-[#2686FF] hover:from-[#0F54EF] hover:to-[#4479D1]"
        >
          <Image className="ml-1" width={15} height={15} src={AddIcon.src} alt="add-icon" />
          <p className="text-white text-xs font-normal mx-2">{t('addMethod')}</p>
        </div>
      </div>
      <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
      <div className="pl-7 pr-5">
        <AdminPaymentMethodsTable
          paymentMethods={data?.items}
          onDelete={handleDeleteModal}
          onUpdate={handleUpdateModal}
        />
      </div>
    </div>
  );
};

export default Methods;
