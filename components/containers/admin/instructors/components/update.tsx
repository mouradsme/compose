import { Instructor } from '@/common/types/common';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useReducer } from 'react';

enum ActionType {
  SET_FIRST_NAME = 'SET_FIRST_NAME',
  SET_LAST_NAME = 'SET_LAST_NAME',
  SET_EMAIL = 'SET_EMAIL',
  SET_PHONE = 'SET_PHONE',
  SET_BIO = 'SET_BIO',
  SET_TAG_TYPE = 'SET_TAG_TYPE',
}

type Action = {
  type: ActionType;
  payload: any;
};

const updateInstructorReducer = (state: Instructor, action: Action) => {
  switch (action.type) {
    case ActionType.SET_FIRST_NAME:
      return { ...state, firstName: action.payload };
    case ActionType.SET_LAST_NAME:
      return { ...state, lastName: action.payload };
    case ActionType.SET_EMAIL:
      return { ...state, email: action.payload };
    case ActionType.SET_PHONE:
      return { ...state, phone: action.payload };
    case ActionType.SET_BIO:
      return { ...state, bio: action.payload };
    default:
      return state;
  }
};

interface UpdateProps {
  instructor: Instructor;
  onSubmit: (instructor: Instructor) => void;
  onCancel: () => void;
}

const Update = ({ instructor, onSubmit, onCancel }: UpdateProps) => {
  const { t } = useTranslation('supervisors');
  const [state, dispatch] = useReducer(updateInstructorReducer, instructor);
  return (
    <>
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_FIRST_NAME, payload: event.target.value })
        }
        defaultValue={instructor.firstName}
        placeholder={t('firstName') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) =>
          dispatch({ type: ActionType.SET_LAST_NAME, payload: event.target.value })
        }
        defaultValue={instructor.lastName}
        placeholder={t('lastName') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) => dispatch({ type: ActionType.SET_EMAIL, payload: event.target.value })}
        type="email"
        defaultValue={instructor.email}
        placeholder={t('email') as string}
      />
      <input
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        onChange={(event) => dispatch({ type: ActionType.SET_PHONE, payload: event.target.value })}
        type="tel"
        defaultValue={instructor.phone}
        placeholder={t('phone') as string}
      />
      <textarea
        className="border border-[#9B99AF] placeholder-[#9B99AF] py-3 px-4 2xl:py-3.5 2xl:px-5  rounded lg:rounded-lg text-xs 2xl:text-lg w-full"
        style={{ minHeight: '100px' }}
        onChange={(event) => dispatch({ type: ActionType.SET_BIO, payload: event.target.value })}
        defaultValue={instructor.bio}
        placeholder={t('bio') as string}
      />
      <div className="flex flex-row flew-wrap gap-4">
        <Button
          onClick={() => {
            onSubmit(state);
          }}
          type="info"
        >
          {t('save')}
        </Button>
        <Button onClick={onCancel} type="neutral">
          {t('cancel')}
        </Button>
      </div>
    </>
  );
};

export default Update;
