import { sectionSchema } from '@/common/schemas';
import { RecordFromFields, Section, SectionCreate } from '@/common/types/common';
import { createSection, getSections, updateSection } from '@/lib/sections';
import { useEffect, useReducer } from 'react';
import { ValidationError } from 'yup';
import AddContent from '@/components/common/cards/add';
import ShowContent from '@/components/common/cards/show';
import Lessons from '@/components/containers/admin/lessons';
import Modal from '@/components/common/elements/modal';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';
import Button from '@/components/common/buttons';

interface SectionProps {
  courseId: string;
}

interface SectionState {
  title: string;
  description: string;
  sectionOrder: number | undefined;
  selectedSection: Section | undefined;
  sections: Section[] | undefined;
  editSection: Section | undefined;
}

enum ActionType {
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_SELECTED_SECTION = 'SET_SELECTED_SECTION',
  SET_SECTIONS = 'SET_SECTIONS',
  SET_EDIT_SECTION = 'SET_EDIT_SECTION',
  SET_SECTION_ORDER = 'SET_SECTION_ORDER',
}

type Action = {
  type: ActionType;
  payload: any;
};

const initialState: SectionState = {
  title: '',
  description: '',
  sectionOrder: undefined,
  selectedSection: undefined,
  sections: undefined,
  editSection: undefined,
};

const SectionsReducer = (state: SectionState, action: Action): SectionState => {
  switch (action.type) {
    case ActionType.SET_TITLE:
      return {
        ...state,
        title: action.payload,
      };

    case ActionType.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };

    case ActionType.SET_SELECTED_SECTION:
      return {
        ...state,
        selectedSection: action.payload,
      };

    case ActionType.SET_SECTIONS:
      return {
        ...state,
        sections: action.payload,
      };
    case ActionType.SET_EDIT_SECTION:
      return {
        ...state,
        editSection: action.payload,
      };
    case ActionType.SET_SECTION_ORDER:
      return {
        ...state,
        sectionOrder: action.payload,
      };
    default:
      return state;
  }
};

const Sections = ({ courseId }: SectionProps) => {
  const { t } = useTranslation('courses');
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(SectionsReducer, initialState);

  useEffect(() => {
    getSections(courseId).then((data) => {
      dispatch({ type: ActionType.SET_SECTIONS, payload: data.data.items });
    });
  }, [courseId]);

  const listSections = () => {
    getSections(courseId).then((data) => {
      dispatch({ type: ActionType.SET_SECTIONS, payload: data.data.items });
    });
  };

  const validateSection = (content: SectionCreate) => {
    try {
      sectionSchema.validateSync(content);
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      }
      return false;
    }
    return true;
  };

  const onSectionSubmit = async (content: RecordFromFields) => {
    if (!courseId) {
      return;
    }

    const _content = content as unknown as SectionCreate;
    const isValid = validateSection(_content);

    if (!isValid) {
      return;
    }

    const res = await createSection(courseId, _content);

    if (res.status === 201) {
      showMessage(t('sectionAdded'), 'success');
      listSections();
    } else {
      showMessage(t('sectionCreationError'), 'error');
    }
  };

  const onSectionUpdate = async (content: Section | undefined) => {
    if (!content) {
      return;
    }

    if (!courseId) {
      return;
    }

    const _content = {
      title: content.title,
      description: content.description,
      sectionOrder: content.sectionOrder,
    };
    const isValid = validateSection(_content);

    if (!isValid) {
      return;
    }

    const res = await updateSection(content);

    if (res.status === 200) {
      showMessage(t('sectionUpdated'), 'success');
      dispatch({ type: ActionType.SET_EDIT_SECTION, payload: undefined });
      listSections();
    } else {
      showMessage(t('sectionUpdateError'), 'error');
    }
  };

  return (
    <>
      {state.editSection?.id && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4 ">
            <p className="text-lg font-bold font-Poppins">{t('updateSection')}</p>
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('enterSectionTitle') as string}
              name={'title'}
              value={state.editSection.title}
              onChange={(event) => {
                const title = event.target.value;
                const section = { ...state.editSection, title };
                dispatch({ type: ActionType.SET_EDIT_SECTION, payload: section });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('enterSectionDescription') as string}
              name={'description'}
              value={state.editSection.description}
              onChange={(event) => {
                const description = event.target.value;
                const section = { ...state.editSection, description };
                dispatch({ type: ActionType.SET_EDIT_SECTION, payload: section });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={t('enterSectionOrder') as string}
              name={'order'}
              value={state.editSection.sectionOrder}
              onChange={(event) => {
                const sectionOrder = event.target.value;
                const section = { ...state.editSection, sectionOrder };
                dispatch({ type: ActionType.SET_EDIT_SECTION, payload: section });
              }}
            />
            <Button type="info" onClick={async () => await onSectionUpdate(state.editSection)}>
              <p className="font-open-sans font-normal text-white text-sm">{t('update')}</p>
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between items-center gap-2 pt-5">
        <p className="font-open-sans font-semibold text-[#000000] text-lg">{t('sectionsHeader')}</p>
      </div>

      <div className="w-full">
        <AddContent
          type={t('section')}
          fields={[
            {
              name: 'title',
              placeholder: t('enterSectionTitle'),
              value: state.title,
            },
            {
              name: 'description',
              placeholder: t('enterSectionDescription'),
              value: state.description,
            },
            {
              name: 'sectionOrder',
              placeholder: t('enterSectionOrder'),
              value: state.sectionOrder,
            },
          ]}
          onSubmit={onSectionSubmit}
        />
        {state.sections &&
          state.sections.map((section) => (
            <ShowContent
              key={section.id}
              title={`${section.title} "${section.sectionOrder}"`}
              content={section.description}
            >
              <>
                <Button
                  onClick={() => dispatch({ type: ActionType.SET_EDIT_SECTION, payload: section })}
                >
                  {t('editButton')}
                </Button>
                <Lessons sectionId={section.id} />
              </>
            </ShowContent>
          ))}
      </div>
    </>
  );
};

export default Sections;
