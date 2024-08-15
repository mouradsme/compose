import Image from 'next/image';
import AvatarIcon from '@/public/images/path 12046.svg';
import { Student } from '@/common/types/common';
import useRequest from '@/hooks/request';
import { useEffect, useReducer } from 'react';
import { BACKEND_URL, ITEMS_PER_PAGE } from '@/common/config';
import URLS from '@/common/urls';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Pagination from '@/components/common/pagination';

interface StudentsState {
  canFetch: boolean;
  offset: number;
  items: Student[] | undefined;
  isDialogOpen: boolean;
  totalRecords: number;
  totalPages: number;
  pages: number[];
  currentPage: number;
}

const studentsInitialState: StudentsState = {
  canFetch: false,
  offset: 0,
  items: undefined,
  isDialogOpen: false,
  totalRecords: 0,
  totalPages: 0,
  pages: [],
  currentPage: 0,
};

const studentsReducer = (state: StudentsState, action: StudentsAction): StudentsState => {
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

enum ActionType {
  SET_OFFSET = 'SET_OFFSET',
  SET_CAN_FETCH = 'SET_CAN_FETCH',
  SET_ITEMS = 'SET_ITEMS',
  SET_DIALOG_OPEN = 'SET_DIALOG_OPEN',
  SET_TOTAL_RECORDS = 'SET_TOTAL_RECORDS',
  SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
}

type StudentsAction = {
  type: ActionType;
  payload: any;
};

interface StudentsProps {
  students: Student[];
  totalRecords: number;
}

const Students = ({ students, totalRecords }: StudentsProps) => {
  const { t } = useTranslation('students');
  const router = useRouter();
  const [state, dispatch] = useReducer(studentsReducer, studentsInitialState);
  const { data: studentsData } = useRequest({
    url: state.canFetch
      ? `${BACKEND_URL}/${URLS.students.list}?offset=${state.offset}&limit=${ITEMS_PER_PAGE}`
      : undefined,
  });

  const headers = [
    t('fullName'),
    t('email'),
    t('birthday'),
    t('phoneNumber'),
    t('communeID'),
    t('language'),
  ];

  const onPageChange = (offset: number, canFetch: boolean) => {
    dispatch({ type: ActionType.SET_CAN_FETCH, payload: canFetch });
    dispatch({ type: ActionType.SET_OFFSET, payload: offset });
  };

  useEffect(() => {
    dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: totalRecords });
    dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
  }, [totalRecords]);

  useEffect(() => {
    if (studentsData?.totalRecords) {
      dispatch({ type: ActionType.SET_TOTAL_RECORDS, payload: studentsData.totalRecords });
    }
  }, [studentsData?.totalRecords]);

  return (
    <>
      <div className="flex flex-row pl-6 gap-3 mb-3">
        <Image width={25} height={25} src={AvatarIcon.src} alt="avatar_icon" />
        <p className="font-Poppins text-[#080940] text-2xl font-semibold">{t('studentList')}</p>
      </div>
      <div className="flex flex-col justify-start w-11/12 h-full pl-4">
        <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
        <div className="pl-7 pr-5">
          <div className="pl-7 pr-5">
            <Pagination onChange={onPageChange} totalRecords={state.totalRecords || totalRecords} />
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
                  {(state.canFetch ? studentsData?.items : students)?.map(
                    (student: Student, index: number) => (
                      <tr
                        key={student.id}
                        className={`cursor-pointer hover:bg-gray-200 ${
                          index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                        }`}
                        onClick={() => router.push(`students/${student.id}`)}
                      >
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {student.fullName}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {student.email}
                        </td>
                        <td className="text-gray-600 font-Poppins text-sm text-center">
                          {student.birthday}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {student.phoneNumber}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {student.communeId}
                        </td>
                        <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                          {student.language}
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

export default Students;
