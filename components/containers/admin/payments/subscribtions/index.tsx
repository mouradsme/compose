import Modal from '@/components/common/elements/modal';
import {
  Plan,
  PlanCreate,
  StudentSubscription,
  StudentSubscriptionUpdate,
} from '@/common/types/common';
import Image from 'next/image';
import BillIcon from '@/public/images/Path 12049.svg';
import { useEffect, useReducer, useState } from 'react';
import Plans from '@/components/common/elements/plans';
import Update from '@/components/containers/admin/payments/subscribtions/components/update';
import Add from '@/components/containers/admin/payments/subscribtions/components/add';
import {
  createSubscription,
  deleteSubscription,
  updateStudentSubscription,
  updateSubscription,
} from '@/lib/subscribtions';
import useRequest from '@/hooks/request';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import Details from '@/components/containers/admin/payments/subscribtions/components/details';
import { useTranslation } from 'next-i18next';
import { ValidationError } from 'yup';
import { planCreateSchema, planUpdateSchema } from '@/common/schemas';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';
import Pagination from '@/components/common/pagination';

interface StudentSubscriptionState {
  canFetch: boolean;
  offset: number;
  items: StudentSubscription[] | undefined; // Assuming there's a type called Subscription
  error: string | undefined;
  success: string | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
  selectedStudentSubscription: StudentSubscription | undefined;
}

const studentSubscriptionInitialState: StudentSubscriptionState = {
  canFetch: false,
  offset: 0,
  items: undefined,
  error: undefined,
  success: undefined,
  isDialogOpen: false,
  totalRecords: 0,
  totalPages: 0,
  pages: [],
  currentPage: 0,
  selectedStudentSubscription: undefined,
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
    default:
      return state;
  }
};

interface SubscriptionsProps {
  subscriptions: StudentSubscription[];
  totalRecords: number;
}

const Subscribtions = ({ subscriptions, totalRecords }: SubscriptionsProps) => {
  const { t } = useTranslation('plans');
  const [state, dispatch] = useReducer(subscriptionsReducer, studentSubscriptionInitialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [subscriptionToUpdate, setSubscriptionToUpdate] = useState<Plan | undefined>(undefined);
  const { showMessage } = useMessage();

  const headers = [
    t('studentName'),
    t('subscriptionPlan'),
    t('price'),
    t('durationDays'),
    t('paymentMethod'),
    t('proofFile'),
    t('status'),
  ];

  const { data: plans, mutate } = useRequest({
    url: `${BACKEND_URL}/${URLS.subscribtions.list}`,
  });

  const { data: subscriptionsData, mutate: mutateSubs } = useRequest({
    url: state.canFetch
      ? `${BACKEND_URL}/${URLS.subscribtions.student}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
  };

  const reset = () => {
    mutate();
    setTimeout(() => {
      handleDialogClose();
    }, 3000);
  };

  const onAddSubscribtion = () => {
    handleDialogOpen();
  };

  const onUpdatesubscribtion = (subscription: Plan) => {
    setSubscriptionToUpdate(subscription);
    setIsUpdateDialogOpen(true);
  };

  const handleAddSubscription = async (subscription: PlanCreate) => {
    try {
      await planCreateSchema.validate(subscription, { context: { isUpdate: false } });
      await createSubscription(subscription);
      showMessage(t('subscriptionCreated') as string, 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('failedToAdd') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleUpdateSubscription = async (subscription: Plan) => {
    try {
      await planUpdateSchema.validate(subscription, { context: { isUpdate: true } });
      const translations: any = subscription.translations.map((translation: any) => {
        delete translation.id;
        return translation;
      });
      const _subscription: any = { ...subscription, translations };
      delete _subscription.id;
      delete _subscription.currentLocale;
      delete _subscription.createdAt;
      delete _subscription.updatedAt;

      await updateSubscription(subscription.id, _subscription);
      showMessage(t('subscriptionUpdated') as string, 'success');
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('failedToUpdate') as string, 'error');
      }
      return;
    }
    reset();
  };

  const handleDeleteSubscription = async (plan: Plan) => {
    try {
      await deleteSubscription(plan.id);
      showMessage(t('subscriptionDeleted') as string, 'success');
      reset();
    } catch (error) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      }
      showMessage(t('failedToDelete') as string, 'error');
    }
  };

  const handleDetailsClick = (subscribtion: StudentSubscription) => {
    if (!subscribtion) {
      return;
    }
    dispatch({ type: ActionType.SET_STUDENT_SUBSCRIPTION, payload: subscribtion });
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
        showMessage(t('failedToUpdate') as string, 'error');
      } else {
        showMessage(t('subscriptionUpdated') as string, 'success');
        dispatch({ type: ActionType.SET_CAN_FETCH, payload: true });
        mutateSubs();
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        dispatch({ type: ActionType.SET_ERROR, payload: error.message });
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('failedToUpdate'), 'error');
      }
    }
  };

  const onPageChange = (offset: number, canFetch: boolean) => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: canFetch });
    dispatch({ type: ActionType.SET_OFFSET, payload: offset });
  };

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: totalRecords });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
  }, [totalRecords]);

  useEffect(() => {
    if (subscriptionsData?.totalRecords) {
      dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: subscriptionsData?.totalRecords });
    }
  }, [subscriptionsData?.totalRecords]);

  return (
    <>
      {isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('addNewSubscription')}</p>
            <Add onSubmit={handleAddSubscription} onCancel={handleDialogClose} />
          </div>
        </Modal>
      )}
      {isUpdateDialogOpen && subscriptionToUpdate && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('updateSubscription')}</p>
            <Update
              subscription={subscriptionToUpdate}
              onSubmit={handleUpdateSubscription}
              onDelete={handleDeleteSubscription}
              onCancel={() => setIsUpdateDialogOpen(false)}
            />
          </div>
        </Modal>
      )}
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
      <div className="flex flex-row w-auto gap-11 mb-3">
        <div className="flex flex-row gap-3 pl-6 w-9/12">
          <div>
            <Image width={25} height={25} src={BillIcon.src} alt={'BillIcon'} />
          </div>
          <div>
            <p className="font-Poppins text-[#080940] text-2xl font-semibold">
              {t('subscriptions')}
            </p>
          </div>
        </div>
        <button
          className="hover:bg-gray-500 bg-[#7C8DA6] rounded-full font-open-sans font-normal text-white text-sm p-2"
          onClick={onAddSubscribtion}
        >
          {t('addNewSubscriptionButton')}
        </button>
      </div>
      <div className="border border-r-2 border-gray-300 w-full ml-6"></div>
      <div className="flex flex-row gap-4 p-7 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Plans
          plans={plans?.items || []}
          onPlanClick={onUpdatesubscribtion}
          buttonText={t('updateSubscription') as string}
        />
      </div>
      <div className="w-full m-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">{t('studentSubscriptions')}</h2>
          <div className="border border-r-2 border-gray-300 w-full"></div>
        </div>
        <div className="pl-7 pr-5">
          <Pagination totalRecords={totalRecords} onChange={onPageChange} />
        </div>
        <div className="bg-white shadow-md">
          <table className=" w-full ">
            <thead className="bg-[#F5F7F9]">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="font-[open sans] text-[#767676] text-sm font-semibold py-3"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(state.canFetch ? subscriptionsData?.items : subscriptions)?.map(
                (sub: StudentSubscription, index: number) => (
                  <tr
                    key={sub.id}
                    className={`cursor-pointer hover:bg-gray-200 ${
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    }`}
                    onClick={() => handleDetailsClick(sub)}
                  >
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.student?.fullName}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.subscriptionPlan?.translations?.[0]?.name}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {t('dzd')} {sub?.subscriptionPlan?.price}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.subscriptionPlan?.durationInDays}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.paymentMethod?.translations?.[0]?.name}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.hasProofFile ? 'Yes' : 'No'}
                    </td>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {sub?.status}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Subscribtions;
