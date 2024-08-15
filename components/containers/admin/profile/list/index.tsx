import Image from 'next/image';
import AvatarIcon from '@/public/images/path 12046.svg';
import { Admin } from '@/common/types/common'; // Adjust this import based on your type structure
import useRequest from '@/hooks/request';
import { useEffect, useReducer } from 'react';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import { useTranslation } from 'next-i18next';
import Modal from '@/components/common/elements/modal';
import Button from '@/components/common/buttons';
import { deleteAdmin } from '@/lib/admins';

interface AdminsState {
  canFetch: boolean;
  offset: number;
  items: Admin[] | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
  openDeleteModal: boolean;
  deleteId: string | undefined;
}

const adminsInitialState: AdminsState = {
  canFetch: false,
  offset: 0,
  items: undefined,
  isDialogOpen: false,
  totalRecords: 0,
  totalPages: 0,
  pages: [],
  currentPage: 0,
  openDeleteModal: false,
  deleteId: undefined,
};

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_ITEMS = 'SET_ITEMS',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  SET_OPEN_DELETE_MODAL = 'SET_OPEN_DELETE_MODAL',
}

const adminsReducer = (state: AdminsState, action: AdminsAction): AdminsState => {
  switch (action.type) {
    case ActionType.SET_OFFSET:
      return { ...state, offset: action.payload };
    case ActionType.SET_ITEMS:
      return { ...state, items: action.payload };
    case ActionType.SET_CAN_FETCH:
      return { ...state, canFetch: action.payload };
    case ActionType.SET_TOTAL_RECORDS:
      const totalRecords = action.payload;
      const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      return { ...state, pages, totalPages, totalRecords };
    case ActionType.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ActionType.SET_OPEN_DELETE_MODAL:
      return {
        ...state,
        openDeleteModal: action.payload.open,
        deleteId: action.payload.id,
      };
    default:
      return state;
  }
};

type AdminsAction = {
  type: ActionType;
  payload: any;
};

interface AdminsProps {
  admins: Admin[];
  totalRecords: number;
}

const Admins = ({ admins, totalRecords }: AdminsProps) => {
  const { t } = useTranslation('profile');
  const [state, dispatch] = useReducer(adminsReducer, adminsInitialState);
  const { data: adminsData, mutate } = useRequest({
    url: state.canFetch
      ? `${BACKEND_URL}/${URLS.admin.list}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const headers = [
    t('fullName'),
    t('email'),
    t('birthday'),
    t('phoneNumber'),
    t('communeID'),
    t('actions'),
  ];

  const onPageChange = (page: number) => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
    dispatch({ type: ActionType.SET_OFFSET, payload: page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0 });
  };

  const handleGoBack = () => {
    if (state.currentPage <= 1) return;
    const newPage = state.currentPage - 1;
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: newPage });
    onPageChange(newPage);
  };

  const handleGoNext = () => {
    if (state.currentPage >= state.totalPages) return;
    const newPage = state.currentPage + 1;
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: newPage });
    onPageChange(newPage);
  };

  const handlePageClick = (i: number) => {
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: i });
    onPageChange(i);
  };

  const onAdminDelete = async () => {
    if (!state.deleteId) {
      return;
    }
    await deleteAdmin(state.deleteId);
    dispatch({
      type: ActionType.SET_OPEN_DELETE_MODAL,
      payload: { id: undefined, open: false },
    });
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
    mutate();
  };

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: totalRecords });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
  }, [totalRecords]);

  useEffect(() => {
    if (adminsData?.totalRecords) {
      dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: adminsData.totalRecords });
    }
  }, [adminsData?.totalRecords]);

  return (
    <>
      {state.openDeleteModal && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('admin') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={onAdminDelete}>
                {t('delete')}
              </Button>
              <Button
                type="neutral"
                onClick={() => dispatch({ type: ActionType.SET_OPEN_DELETE_MODAL, payload: false })}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex flex-row gap-3 mb-3">
        <Image width={25} height={25} src={AvatarIcon.src} alt="avatar_icon" />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('adminsList')}</p>
      </div>
      <div className="flex flex-col justify-start w-11/12 h-full pl-4">
        <div className="border border-r-2 border-gray-300 w-full "></div>
        <div className="pl-7 pr-5">
          <div className="pl-7 pr-5">
            {state.totalRecords > ITEMS_PER_PAGE && (
              <div className="flex gap-4 mt-4 items-center justify-center">
                <div
                  className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                  onClick={handleGoBack}
                >
                  <ChevronLeft />
                </div>
                <div className="flex gap-2 font-[Montserrat]">
                  {state.pages.map((i) => (
                    <div
                      key={i}
                      className={`${
                        i === state.currentPage ? 'underline text-blue-500' : ''
                      } cursor-pointer`}
                      onClick={() => handlePageClick(i)}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div
                  className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                  onClick={handleGoNext}
                >
                  <ChevronRight />
                </div>
              </div>
            )}
          </div>
          <div className="w-full pt-3 py-10">
            <div className="bg-white shadow-md">
              <table className="w-full">
                <thead className="bg-[#F5F7F9]">
                  <tr>
                    {headers.map((header) => (
                      <th
                        className="font-[open sans] text-[#767676] text-sm font-semibold py-3"
                        key={header}
                      >
                        <div className="flex items-center gap-2 justify-center">{header}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(state.canFetch ? adminsData?.items : admins)?.map(
                    (admin: Admin, index: number) => (
                      <tr
                        key={admin.id}
                        className={`cursor-pointer hover:bg-gray-200 ${
                          index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                        }`}
                      >
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {admin.fullName}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {admin.email}
                        </td>
                        <td className="text-gray-600 font-Poppins text-sm text-center">
                          {admin.birthday}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {admin.phoneNumber}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {admin.communeId}
                        </td>
                        <td>
                          <Button
                            type="danger"
                            onClick={() =>
                              dispatch({
                                type: ActionType.SET_OPEN_DELETE_MODAL,
                                payload: { id: admin.id, open: true },
                              })
                            }
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
  );
};

export default Admins;
