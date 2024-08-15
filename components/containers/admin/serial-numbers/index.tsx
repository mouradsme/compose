import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import { Plan, SerialNumber, SerialNumberCreate } from '@/common/types/common';
import URLS from '@/common/urls';
import Modal from '@/components/common/elements/modal';
import useRequest from '@/hooks/request';
import { useEffect, useReducer } from 'react';
import Image from 'next/image';
import AddSquareIcon from '@/public/images/Add.svg';
import CaseIcon from '@/public/images/Path 12043.svg';
import Add from '@/components/containers/admin/serial-numbers/components/add';
import UnfoldIcon from '@/public/images/unfold-more.svg';
import { createSerialNumbers, deleteSerialNumbers } from '@/lib/serials';
import { useTranslation } from 'next-i18next';
import Button from '@/components/common/buttons';
import { ValidationError } from 'yup';
import { serialNumberCreateSchema } from '@/common/schemas';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';
import Pagination from '@/components/common/pagination';

interface SerialNumberState {
  canFetch: boolean;
  offset: number;
  items: SerialNumber[] | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
  openDeleteModal: boolean;
  deleteId: string | undefined;
}

const serialNumberInitialState: SerialNumberState = {
  canFetch: false,
  offset: 0,
  items: undefined,
  isDialogOpen: false,
  totalPages: 0,
  pages: [],
  currentPage: 0,
  totalRecords: 0,
  openDeleteModal: false,
  deleteId: undefined,
};

interface SerialNumbersProps {
  serials: SerialNumber[];
  totalRecords: number;
  plans: Plan[];
}

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_ITEMS = 'SET_ITEMS',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  SET_OPEN_DELETE_MODAL = 'SET_OPEN_DELETE_MODAL',
}

type Action = {
  type: ActionType;
  payload: any;
};

const coursesReducer = (state: SerialNumberState, action: Action): SerialNumberState => {
  switch (action.type) {
    case ActionType.SET_DIALOG_OPEN: {
      return {
        ...state,
        isDialogOpen: action.payload,
      };
    }
    case ActionType.SET_OFFSET: {
      return {
        ...state,
        offset: action.payload,
      };
    }
    case ActionType.SET_ITEMS: {
      return {
        ...state,
        items: action.payload,
      };
    }
    case ActionType.SET_CAN_FETCH: {
      return {
        ...state,
        canFetch: action.payload,
      };
    }
    case ActionType.SET_TOTAL_RECORDS: {
      const totalRecords = action.payload;
      const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      return {
        ...state,
        pages,
        totalPages,
        totalRecords,
      };
    }
    case ActionType.SET_CURRENT_PAGE: {
      return {
        ...state,
        currentPage: action.payload,
      };
    }
    case ActionType.SET_OPEN_DELETE_MODAL:
      return {
        ...state,
        openDeleteModal: action.payload.open,
        deleteId: action.payload.id,
      };
    default: {
      return state;
    }
  }
};

const SerialNumbers = ({ serials, totalRecords, plans }: SerialNumbersProps) => {
  const { t } = useTranslation('plans');
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(coursesReducer, serialNumberInitialState);
  const { data: serialNumbers, mutate } = useRequest({
    url: state.canFetch
      ? `${BACKEND_URL}/${URLS.serials.list}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const headers = [t('code'), t('status'), t('creationDate'), t('expirationDate'), t('actions')];

  const onPageChange = (offset: number, canFetch: boolean) => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: canFetch });
    dispatch({ type: ActionType.SET_OFFSET, payload: offset });
  };

  const handleDialogClose = () => {
    dispatch({ type: ActionType.SET_DIALOG_OPEN, payload: false });
  };

  const handleDialogOpen = () => {
    dispatch({ type: ActionType.SET_DIALOG_OPEN, payload: true });
  };

  const reset = () => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
    mutate();
  };

  const handleAddSerialNumber = async (serialNumber: SerialNumberCreate) => {
    try {
      await serialNumberCreateSchema.validate(serialNumber);
      await createSerialNumbers(serialNumber);
      showMessage(t('serialNumbersGenerated'), 'success');
      handleDialogClose();
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('serialNumbersNotGenerated'), 'error');
      }
      return;
    }
    reset();
  };

  const handleDeleteSerialNumber = async () => {
    if (!state.deleteId) {
      return;
    }
    try {
      await deleteSerialNumbers(state.deleteId);
      showMessage(t('serialNumberDeleted'), 'success');
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('serialNumberNotDeleted'), 'error');
      }
    }
  };

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: totalRecords });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
  }, [totalRecords]);

  useEffect(() => {
    if (serialNumbers?.totalRecords) {
      dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: serialNumbers?.totalRecords });
    }
  }, [serialNumbers?.totalRecords]);

  return (
    <>
      {state.isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('generateSerialNumbers')}</p>
            <Add onCancel={handleDialogClose} onSubmit={handleAddSerialNumber} plans={plans} />
          </div>
        </Modal>
      )}
      {state.openDeleteModal && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('serialNumber') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={handleDeleteSerialNumber}>
                {t('delete')}
              </Button>
              <Button
                type="neutral"
                onClick={() =>
                  dispatch({
                    type: ActionType.SET_OPEN_DELETE_MODAL,
                    payload: { open: false, id: undefined },
                  })
                }
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <>
        <div>
          <div className="flex flex-row justify-between mb-3">
            <div className="flex flex-row gap-3">
              <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
              <p className="font-Poppins text-[#080940] text-2xl font-semibold">
                {t('serialNumbers')}
              </p>
            </div>
            <div
              onClick={handleDialogOpen}
              className=" w-3/12 border flex flex-row rounded-full gap-1 h-8 justify-center items-center cursor-pointer bg-gradient-to-r from-[#0F54EF] to-[#2686FF] hover:from-[#0F54EF] hover:to-[#4479D1]"
            >
              <Image
                className="ml-1"
                width={15}
                height={15}
                src={AddSquareIcon.src}
                alt="over-view_icon"
              />
              <p className="font-open-sans text-white text-xs font-normal mx-2">
                {t('generateSerialNumbers')}
              </p>
            </div>
          </div>
          <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
          <div className="pl-7 pr-5">
            <Pagination totalRecords={state.totalRecords || totalRecords} onChange={onPageChange} />
            <div className="w-full pt-3 py-10">
              <div className="bg-white shadow-md ">
                <table className=" w-full ">
                  <thead className="bg-[#F5F7F9] ">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          className="font-[open sans] text-[#767676] text-sm font-semibold py-3"
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
                    {(serialNumbers?.items || serials).map(
                      (serial: SerialNumber, index: number) =>
                        serial.id && (
                          <tr
                            className={index % 2 === 0 ? 'bg-[#F5F7F9]' : 'bg-white'}
                            key={serial.id}
                          >
                            <td className="text-blue-600 font-Poppins text-sm text-center py-3 ">
                              {serial.code}
                            </td>
                            <td className="text-gray-600 font-Poppins text-sm  text-center">
                              {serial.status}
                            </td>
                            <td className="text-gray-600 font-Poppins text-sm  text-center">
                              {serial.createdAt}
                            </td>
                            <td className="text-gray-600 font-Poppins text-sm  text-center">
                              {serial.expirationDate}
                            </td>
                            <td className="text-gray-600 font-Poppins flex flex-row gap-3 justify-center">
                              <Button
                                onClick={() =>
                                  dispatch({
                                    type: ActionType.SET_OPEN_DELETE_MODAL,
                                    payload: { open: true, id: serial.id },
                                  })
                                }
                                type="danger"
                              >
                                {t('delete')}
                              </Button>
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default SerialNumbers;
