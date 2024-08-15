// PaginationComponent.tsx
import { ITEMS_PER_PAGE } from '@/common/config';
import { ChevronLeft, ChevronRight } from '@/components/Icons';
import React, { useEffect, useReducer } from 'react';

interface PaginationState {
  pages: number[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  offset: number;
  canFetch: boolean;
}

enum ActionType {
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_OFFSET = 'SET_OFFSET',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
}

type PaginationAction = {
  type: ActionType;
  payload: any;
};

const initialPaginationState: PaginationState = {
  pages: [],
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  offset: 0,
  canFetch: false,
};

const paginationReducer = (state: PaginationState, action: PaginationAction): PaginationState => {
  switch (action.type) {
    case ActionType.SET_OFFSET: {
      return {
        ...state,
        offset: action.payload,
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
    case ActionType.SET_CAN_FETCH: {
      return {
        ...state,
        canFetch: action.payload,
      };
    }
    default:
      return state;
  }
};

interface PaginationProps {
  totalRecords: number;
  onChange: (offset: number, canFetch: boolean) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalRecords, onChange }) => {
  const [state, dispatch] = useReducer(paginationReducer, {
    ...initialPaginationState,
    totalRecords,
  });

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: totalRecords });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
  }, [totalRecords]);

  const onPageChange = (page: number) => {
    const offset = page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0;
    const canFetch = true;
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: canFetch });
    dispatch({ type: ActionType.SET_OFFSET, payload: offset });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: page });
    onChange(offset, canFetch);
  };

  const handleGoBack = () => {
    if (state.currentPage <= 1) {
      return;
    }
    const newPage = state.currentPage - 1;
    onPageChange(newPage);
  };

  const handleGoNext = () => {
    if (state.currentPage >= state.totalPages) {
      return;
    }
    const newPage = state.currentPage + 1;
    onPageChange(newPage);
  };

  const handlePageClick = (i: number) => {
    onPageChange(i);
  };

  return (
    <>
      {totalRecords > ITEMS_PER_PAGE && (
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
    </>
  );
};

export default Pagination;
