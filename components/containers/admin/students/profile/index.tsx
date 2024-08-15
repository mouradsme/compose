import Image from 'next/image';
import UserAvatarIcon from '@/public/images/user-avatar.svg';
import group_image from '@/public/images/group 12281.svg';
import { useEffect, useReducer } from 'react';
import Student from '@/components/containers/admin/students/profile/components/student';
import Parent from '@/components/containers/admin/students/profile/components/parent';
import { StudentSubscription, StudentSubscriptionUpdate, Supervisor } from '@/common/types/common';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import { Student as StudentType, SubscriptionStatus } from '@/common/types/common';
import URLS from '@/common/urls';
import useRequest from '@/hooks/request';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import Modal from '@/components/common/elements/modal';
import { updateStudentSubscription } from '@/lib/subscribtions';
import Details from '@/components/containers/admin/students/profile/components/details';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

const status = Object.values(SubscriptionStatus).map((element) => {
  const name = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  return { id: element, name };
});

interface StudentSubscriptionState {
  canFetch: boolean;
  offset: number;
  items: StudentSubscription[] | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
  selectedStudentSubscription: StudentSubscription | undefined;
  status: SubscriptionStatus | '';
}

const studentSubscriptionInitialState: StudentSubscriptionState = {
  canFetch: false,
  offset: 0,
  items: undefined,
  isDialogOpen: false,
  totalRecords: 0,
  totalPages: 0,
  pages: [],
  currentPage: 0,
  selectedStudentSubscription: undefined,
  status: '',
};

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_ITEMS = 'SET_ITEMS',
  SET_ERROR = 'SET_ERROR',
  SET_SUCCESS = 'SET_SUCCESS',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  SET_STUDENT_SUBSCRIPTION = 'SET_STUDENT_SUBSCRIPTION',
  SET_STATUS = 'SET_STATUS',
}

type SubscriptionAction = {
  type: ActionType;
  payload: any;
};

const subscriptionsReducer = (
  state: StudentSubscriptionState,
  action: SubscriptionAction
): StudentSubscriptionState => {
  switch (action.type) {
    case ActionType.SET_STUDENT_SUBSCRIPTION:
      return { ...state, selectedStudentSubscription: action.payload };
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
    case ActionType.SET_STATUS: {
      return {
        ...state,
        status: action.payload,
      };
    }
    default:
      return state;
  }
};

interface ProfileProps {
  student: StudentType;
  supervisors: Supervisor[];
}

const Profile = ({ student, supervisors }: ProfileProps) => {
  const { t } = useTranslation('students');
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(subscriptionsReducer, studentSubscriptionInitialState);
  const { data: subscriptionsData, mutate: mutateSubs } = useRequest({
    url: `${BACKEND_URL}/${URLS.subscribtions.student}?offset=${
      state.offset
    }&limit=${ITEMS_PER_PAGE}&studentId=${student.id}${
      state.status ? `&status=${state.status}` : ''
    }`,
  });

  const headers = [
    t('plan'),
    t('payment'),
    t('activatedAt'),
    t('expireAt'),
    t('updatedAt'),
    t('status'),
  ];

  const onPageChange = (page: number) => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
    dispatch({ type: ActionType.SET_OFFSET, payload: page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0 });
  };

  const handleGoBack = () => {
    if (state.currentPage <= 1) {
      return;
    }
    const newPage = state.currentPage - 1;
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: newPage });
    onPageChange(newPage);
  };

  const handleGoNext = () => {
    if (state.currentPage >= state.totalPages) {
      return;
    }
    const newPage = state.currentPage + 1;
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: newPage });
    onPageChange(newPage);
  };

  const handlePageClick = (i: number) => {
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: i });
    onPageChange(i);
  };

  const handleDetailsClick = (subscribtion: StudentSubscription) => {
    if (!subscribtion) {
      return;
    }
    dispatch({ type: ActionType.SET_STUDENT_SUBSCRIPTION, payload: subscribtion });
  };

  const handleStatusChange = (value: SubscriptionStatus) => {
    dispatch({ type: ActionType.SET_STATUS, payload: value });
  };

  const onCancelDetails = () => {
    dispatch({ type: ActionType.SET_STUDENT_SUBSCRIPTION, payload: undefined });
  };

  const handleSaveStudentSub = async (sub: StudentSubscriptionUpdate) => {
    if (!state.selectedStudentSubscription) {
      return;
    }

    try {
      const res = await updateStudentSubscription(state.selectedStudentSubscription.id, sub);
      if (res.status !== 204) {
        showMessage(t('errorMessageNotUploaded') as string, 'error');
      } else {
        showMessage(t('successMessage') as string, 'success');
        dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
        mutateSubs();
      }
    } catch (error) {
      showMessage(t('errorMessageUpdateError') as string, 'error');
    }
  };

  useEffect(() => {
    if (subscriptionsData?.totalRecords) {
      dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: subscriptionsData?.totalRecords });
    }
  }, [subscriptionsData?.totalRecords]);

  return (
    <>
      {state.selectedStudentSubscription && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('studentSubscriptionDetails')}</p>
            <Details
              subscription={state.selectedStudentSubscription}
              onCancel={onCancelDetails}
              onSubmit={handleSaveStudentSub}
            />
          </div>
        </Modal>
      )}
      <div className=" flex-row flex pt-10 pl-6 items-center w-12/12">
        <div className="flex flex-row gap-3 w-8/12 ">
          <Image width={25} height={25} src={UserAvatarIcon.src} alt="UserAvatarIcon" />
          <p className="font-Poppins text-[#080940] text-2xl font-semibold">
            {t('profileInformation')}
          </p>
        </div>
      </div>

      <div className="flex flex-row pl-10  w-12/12">
        <div className="flex flex-row w-10/12 gap-2">
          <Student student={student} />
          {supervisors.map((supervisor) => (
            <Parent key={supervisor.id} supervisor={supervisor} />
          ))}
        </div>
        <div className="flex w-4/12">
          <Image width={270} height={270} src={group_image.src} alt={'student'} />
        </div>
      </div>

      <div className="flex justify-center py-5">
        <div className="flex flex-col justify-start rounded-lg w-11/12 h-full">
          <div className="pt-3 pl-5">
            <p className="font-Poppins font-semibold text-[#080940] text-lg">{t('plansList')}</p>
          </div>

          <div className="flex flex-row pt-3">
            <div className="w-7/12 flex flex-row justify-start gap-3">
              <div>
                <select
                  className=" font-[open sans] text-[#767676] text-sm font-semibold outline-none cursor-pointer bg-[#F4F4F4] border rounded-md px-3 py-1"
                  onChange={(event) => handleStatusChange(event.target.value as SubscriptionStatus)}
                >
                  <option
                    className="font-[open sans] text-[#767676] text-sm font-semibold"
                    value={''}
                  >
                    {t('status')}
                  </option>
                  {status.map((st) => (
                    <option
                      key={st.id}
                      className="font-[open sans] text-[#767676] text-sm font-semibold"
                      value={st.id}
                    >
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-3/12"></div>
          </div>

          <div className="w-full pt-3">
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
            <div className="bg-white shadow-md rounded-md">
              <table className=" w-full">
                <thead className="bg-[#F5F7F9] rounded-md ">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        className={`font-[open sans] text-[#767676] text-sm font-semibold pl-3 py-3 justify-center ${
                          index === headers.length - 1 ? 'items-start' : 'items-center'
                        }`}
                        key={index}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {subscriptionsData?.items?.map((sub: StudentSubscription) => (
                    <tr
                      key={sub.id}
                      className="cursor-pointer hover:bg-gray-200 bg-white"
                      onClick={() => handleDetailsClick(sub)}
                    >
                      <td className="text-blue-600 font-Poppins text-sm text-center py-3 ">
                        {sub.subscriptionPlan.translations?.[0].name}
                      </td>
                      <td className="text-gray-600 font-Poppins text-sm  text-center">
                        {sub.paymentMethod.translations?.[0].name}
                      </td>
                      <td className="text-gray-600 font-Poppins text-sm  text-center">
                        {sub.activatedAt}
                      </td>
                      <td className="text-gray-600 font-Poppins text-sm  text-center">
                        {sub.expireAt}
                      </td>
                      <td className="text-gray-600 font-Poppins text-sm  text-center">
                        {sub.updatedAt}
                      </td>
                      <td className="text-gray-600 font-Poppins text-sm text-center">
                        {sub.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
