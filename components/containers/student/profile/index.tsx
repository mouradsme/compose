import { useReducer, useState } from 'react';
import Profile from '@/components/containers/student/profile/components/profile';
import Courses from '@/components/containers/student/profile/components/courses';
import { Course, Student } from '@/common/types/common';
import { Password, User } from '@/components/Icons';
import { changePassword } from '@/lib/auth/login';
import { getUserInfoClient, setUserInfoClient } from '@/lib/common';
import { changePasswordSchema, updateProfileSchema } from '@/common/schemas';
import { deleteProfile, setActivity, updateProfile } from '@/lib/profile';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ValidationError } from 'yup';
import { AxiosError } from 'axios';
import { useMessage } from '@/contexts/message';
import Modal from '@/components/common/elements/modal';
import { deleteCookie } from 'cookies-next';
import { ACCESS_TOKEN_NAME } from '@/common/config';

interface StudentProfileState {
  fullName: string;
  email: string;
  password: string;
  newPassword: string;
  language: 'AR' | 'EN' | 'FR';
}

const initialState: StudentProfileState = {
  fullName: '',
  email: '',
  password: '',
  newPassword: '',
  language: 'EN',
};

enum ActionType {
  SET_FULLNAME = 'SET_FULLNAME',
  SET_EMAIL = 'SET_EMAIL',
  SET_PASSWORD = 'SET_PASSWORD',
  SET_NEW_PASSWORD = 'SET_NEW_PASSWORD',
  SET_LANGUAGE = 'SET_LANGUAGE',
}

type CreateAdminAction = {
  type: ActionType;
  payload: any;
};

const reducer = (state: StudentProfileState, action: CreateAdminAction): StudentProfileState => {
  switch (action.type) {
    case ActionType.SET_FULLNAME:
      return { ...state, fullName: action.payload };
    case ActionType.SET_EMAIL:
      return { ...state, email: action.payload };
    case ActionType.SET_PASSWORD:
      return { ...state, password: action.payload };
    case ActionType.SET_NEW_PASSWORD:
      return { ...state, newPassword: action.payload };
    case ActionType.SET_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

interface ProfileProps {
  student: Student;
  courses: Course[];
}

const Settings = ({ student, courses }: ProfileProps) => {
  const router = useRouter();
  const { t, i18n } = useTranslation('profile');
  const { showMessage } = useMessage();
  const user = getUserInfoClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    fullName: user.fullName,
    email: user.email,
    language: user.language,
  });

  const handleProfileSubmit = async () => {
    try {
      await updateProfileSchema.validate(state);
      await updateProfile(state);
    } catch (error: any) {
      showMessage(error.message, 'error');
      return;
    }
    const _user = {
      ...user,
      email: state.email,
      fullName: state.fullName,
      language: state.language,
    };
    setUserInfoClient(_user);
    showMessage(t('profileUpdatedSuccessfully'), 'success');
    i18n.changeLanguage(state.language.toLocaleLowerCase());
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: state.language.toLocaleLowerCase() });
  };

  const handlePasswordSubmit = async () => {
    try {
      await changePasswordSchema.validate(state);
      await changePassword(state.password, state.newPassword);
      showMessage(t('passwordUpdatedSuccessfully'), 'success');
    } catch (error: any) {
      if (error instanceof ValidationError) {
        showMessage(error.message, 'error');
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.errors[0].message;
        showMessage(message, 'error');
      }
      return;
    }
  };

  const handleDeleteModal = async () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProfile = () => {
    const authoroties = user.authorities;
    const isAdmin = authoroties.includes('ROLE_ADMIN');
    sendHeartbeat();
    deleteCookie(ACCESS_TOKEN_NAME);
    if (isAdmin) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  const sendHeartbeat = async () => {
    const startTime = localStorage.getItem('startTime');
    const endTime = new Date().toISOString();

    if (startTime) {
      try {
        await setActivity(startTime, endTime);
        await deleteProfile();
      } catch (error) {
        if (error instanceof AxiosError) {
          const message = error.response?.data.errors[0].message;
          showMessage(message, 'error');
        }
        return;
      }
      localStorage.removeItem('startTime');
    }
  };

  return (
    <>
      {isDeleteDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">
              {t('deleteWarningMessage', { type: t('profile') })}
            </p>
            <div className="flex flex-raw gap-5">
              <Button type="danger" onClick={handleDeleteProfile}>
                {t('delete')}
              </Button>
              <Button type="neutral" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex whitespace-nowrap gap-5 mb-3">
        <User />
        <div className="font-semibold align-bottom font-[Poppins] 2xl:text-xl text-[#080940] ">
          {t('profileInformation')}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 whitespace-nowrap lg:pl-8">
        <Profile student={student} />
        <Courses courses={courses} />
      </div>

      <div className="flex flex-col gap-3 justify-between h-fit">
        <hr className="mt-4" />

        <div className="flex whitespace-nowrap gap-5 mb-3">
          <User />
          <div className="font-semibold font-[Poppins] text-[#080940] 2xl:text-xl">
            {t('updateProfile')}
          </div>
        </div>

        <div className="flex flex-col w-10/12 md:w-9/12 xl:w-4/12 gap-3 mb-3">
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('fullName')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              type="text"
              value={state.fullName}
              onChange={(e) => dispatch({ type: ActionType.SET_FULLNAME, payload: e.target.value })}
              placeholder={t('updateProfile') as string}
            />
          </div>
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('email')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              type="text"
              value={state.email}
              onChange={(e) => dispatch({ type: ActionType.SET_EMAIL, payload: e.target.value })}
              placeholder="name@mail.com"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('language')}</p>
            <select
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              value={state.language}
              onChange={(e) => dispatch({ type: ActionType.SET_LANGUAGE, payload: e.target.value })}
            >
              <option className="text-[#8F9CB2] font-Poppins font-normal text-sm" value="EN">
                {t('english')}
              </option>
              <option className="text-[#8F9CB2] font-Poppins text-normal text-sm" value="FR">
                {t('french')}
              </option>
              <option className="text-[#8F9CB2] font-Poppins text-normal text-sm" value="AR">
                {t('arabic')}
              </option>
            </select>
          </div>
          <Button onClick={handleProfileSubmit}>{t('save')}</Button>
        </div>
        <hr className="mt-4 " />
        <div className="flex whitespace-nowrap gap-5 mb-3">
          <Password />
          <div className="font-semibold align-bottom font-[Poppins] text-[#080940] 2xl:text-xl ">
            {t('updatePassword')}
          </div>
        </div>

        <div className="flex flex-col w-10/12 md:w-9/12 xl:w-4/12 gap-3 mb-3">
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('password')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              value={state.password}
              onChange={(e) => dispatch({ type: ActionType.SET_PASSWORD, payload: e.target.value })}
              type="password"
              placeholder="****************"
            />
          </div>
          <div className="flex flex-col">
            <p className="font-open-sans text-[#273B54] font-semibold">{t('newPassword')}</p>
            <input
              className="border-b border-gray-400 outline-none placeholder-open-sans placeholder-[#7C8DA6] font-normal"
              value={state.newPassword}
              onChange={(e) =>
                dispatch({ type: ActionType.SET_NEW_PASSWORD, payload: e.target.value })
              }
              type="password"
              placeholder="****************"
            />
          </div>
          <div>
            <Button onClick={handlePasswordSubmit}>{t('save')}</Button>
          </div>
          <hr className="mt-4" />
          <div>
            <Button type="danger" onClick={handleDeleteModal}>
              {t('deleteProfile')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
