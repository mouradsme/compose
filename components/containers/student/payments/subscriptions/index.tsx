import { StudentSubscription } from '@/common/types/common';
import { useEffect, useReducer } from 'react';
import useRequest from '@/hooks/request';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import { formatDate } from '@/common/utils';
import { useTranslation } from 'next-i18next';

interface StudentSubscriptionState {
  canFetch: boolean;
  offset: number;
  items: StudentSubscription[] | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
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
};

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_ITEMS = 'SET_ITEMS',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
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
  const { data: subscriptionsData } = useRequest({
    url: state.canFetch
      ? `${BACKEND_URL}/${URLS.subscribtions.student}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const headers = [
    t('subscriptionPlan'),
    t('price'),
    t('startedAt'),
    t('durationDays'),
    t('paymentMethod'),
    t('proofFile'),
    t('status'),
  ];

  const hiddenHeadersInMobile = [2, 4, 5];

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
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{t('yourSubscriptions')}</h2>
        <div className="border border-r-2 border-gray-300 w-full"></div>
      </div>
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
      <div className="bg-white shadow-md">
        <table className=" w-full ">
          <thead className="text-xs 2xl:text-base text-[#636A7A] uppercase bg-[#F5F7F9]">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`font-[open sans] text-[#767676] text-sm font-semibold py-3 ${
                    hiddenHeadersInMobile.includes(index) ? 'hidden md:table-cell' : ''
                  }`}
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
                >
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                    {sub?.subscriptionPlan?.translations?.[0]?.name}
                  </td>
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                    {t('dzd')} {sub?.subscriptionPlan?.price}
                  </td>
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3 hidden md:table-cell">
                    {formatDate(sub?.activatedAt)}
                  </td>
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                    {sub?.subscriptionPlan?.durationInDays}
                  </td>
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3 hidden md:table-cell">
                    {sub?.paymentMethod?.translations?.[0]?.name}
                  </td>
                  <td className="text-blue-600 font-Poppins text-sm text-center py-3 hidden md:table-cell">
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
    </>
  );
};

export default Subscribtions;
