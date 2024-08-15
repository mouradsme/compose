import CaseIcon from '@/public/images/Path 12043.svg';
import Image from 'next/image';
import AddSquareIcon from '@/public/images/Add.svg';
import { Instructor, InstructorCreate } from '@/common/types/common';
import { useEffect, useState } from 'react';
import Modal from '@/components/common/elements/modal';
import AdminInstructorsTable from '@/components/containers/admin/instructors/components/table';
import Add from '@/components/containers/admin/instructors/components/add';
import Update from '@/components/containers/admin/instructors/components/update';
import { createInstructor, deleteInstructor, updateInstructor } from '@/lib/instructors';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { ValidationError } from 'yup';
import { instructorCreateSchema, instructorUpdateSchema } from '@/common/schemas';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';
import Pagination from '@/components/common/pagination';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';

interface InstructorsProps {
  instructors: Instructor[];
  totalRecords: number;
}

const Instructors = ({ instructors, totalRecords }: InstructorsProps) => {
  const { t } = useTranslation('supervisors');
  const { showMessage } = useMessage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [instructorToUpdate, setInstructorUpdate] = useState<Instructor | undefined>(undefined);
  const [canFetch, setCanFetch] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalItems, setTotalRecords] = useState(totalRecords);

  const { data: newInstructors, mutate } = useRequest({
    url: canFetch
      ? `${BACKEND_URL}/${URLS.serials.list}?offset=${offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const reset = () => {
    setTimeout(() => {
      handleDialogClose();
      mutate();
    }, 3000);
  };

  const handleAddInstructor = async (instructor: InstructorCreate) => {
    try {
      await instructorCreateSchema.validate(instructor);
      await createInstructor(instructor);
      showMessage(t('instructorCreated') as string, 'success');
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

  const handleUpdateInstructor = async (instructor: Instructor) => {
    try {
      await instructorUpdateSchema.validate(instructor);
      await updateInstructor(instructor);
      showMessage(t('instructorUpdated') as string, 'success');
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
      await deleteInstructor(deleteId);
      showMessage(t('instructorDeleted') as string, 'error');
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

  const handleUpdateModal = (instructor: Instructor) => {
    setIsUpdateDialogOpen(true);
    setInstructorUpdate(instructor);
  };

  const handleDeleteModal = async (instructor: Instructor) => {
    if (!instructor) {
      return;
    }
    setDeleteId(instructor.id);
    setIsDeleteDialogOpen(true);
  };

  const onPageChange = (offset: number, canFetch: boolean) => {
    setCanFetch(canFetch);
    setOffset(offset);
  };

  useEffect(() => {
    setTotalRecords(totalRecords);
  }, [totalRecords]);

  useEffect(() => {
    if (newInstructors?.totalRecords) {
      setTotalRecords(newInstructors?.totalRecords);
    }
  }, [newInstructors?.totalRecords]);

  return (
    <div>
      {isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4  ">
            <p className="text-lg font-bold font-Poppins">{t('addNewInstructor')}</p>
            <Add onSubmit={handleAddInstructor} onCancel={handleDialogClose} />
          </div>
        </Modal>
      )}

      {isUpdateDialogOpen && instructorToUpdate && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4  ">
            <p className="text-lg font-bold font-Poppins">{t('instructorDetails')}</p>
            <Update
              onSubmit={handleUpdateInstructor}
              onCancel={handleDialogClose}
              instructor={instructorToUpdate}
            />
          </div>
        </Modal>
      )}

      {isDeleteDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('instructor') })}
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
          <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
          <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('instructors')}</p>
        </div>
        <div
          onClick={handleDialogOpen}
          className=" w-3/12 border flex  flex-row rounded-full gap-1 h-8 justify-center items-center cursor-pointer bg-gradient-to-r from-[#0F54EF] to-[#2686FF] hover:from-[#0F54EF] hover:to-[#4479D1] "
        >
          <Image
            className="ml-1"
            width={15}
            height={15}
            src={AddSquareIcon.src}
            alt="over-view_icon"
          />
          <p className="font-open-sans text-white text-xs font-normal mx-2">{t('addInstructor')}</p>
        </div>
      </div>
      <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
      <div>
        <div className="pl-7 pr-5">
          <Pagination totalRecords={totalItems} onChange={onPageChange} />
          <AdminInstructorsTable
            instructors={instructors}
            onDelete={handleDeleteModal}
            onUpdate={handleUpdateModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Instructors;
