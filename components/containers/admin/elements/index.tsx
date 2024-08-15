import { elementSchema } from '@/common/schemas';
import { RecordFromFields, Element, ElementCreate } from '@/common/types/common';
import { createElement, getElements, updateElement } from '@/lib/elements';
import { useEffect, useReducer } from 'react';
import { ValidationError } from 'yup';
import AddContent from '@/components/common/cards/add';
import ShowContent from '@/components/common/cards/show';
import Quizzes from '../quizzes';
import Modal from '@/components/common/elements/modal';
import Button from '@/components/common/buttons';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

interface ElementProps {
  lessonId: string;
}

interface ElementState {
  title: string;
  description: string;
  elementOrder: number;
  content: string;
  durationInSeconds: number;
  isFree: boolean;
  errors: Error[] | undefined;
  success: string | undefined;
  selectedElement: Element | undefined;
  elements: Element[] | undefined;
  editElement: Element | undefined;
}

enum ActionType {
  SET_TITLE = 'SET_TITLE',
  SET_DESCRIPTION = 'SET_DESCRIPTION',
  SET_ELEMENT_ORDER = 'SET_ELEMENT_ORDER',
  SET_CONTENT = 'SET_CONTENT',
  SET_DURATION = 'SET_DURATION',
  SET_IS_FREE = 'SET_IS_FREE',
  SET_SELECTED_ELEMENT = 'SET_SELECTED_ELEMENT',
  SET_ELEMENTS = 'SET_ELEMENTS',
  SET_EDIT_ELEMENT = 'SET_EDIT_ELEMENT',
}

type Action = {
  type: ActionType;
  payload: any;
};

const initialState: ElementState = {
  title: '',
  description: '',
  elementOrder: 0,
  content: '',
  durationInSeconds: 0,
  isFree: true,
  errors: undefined,
  success: undefined,
  selectedElement: undefined,
  elements: undefined,
  editElement: undefined,
};

const ElementsReducer = (state: ElementState, action: Action): ElementState => {
  switch (action.type) {
    case ActionType.SET_TITLE:
      return { ...state, title: action.payload };
    case ActionType.SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case ActionType.SET_ELEMENT_ORDER:
      return { ...state, elementOrder: parseInt(action.payload, 10) };
    case ActionType.SET_CONTENT:
      return { ...state, content: action.payload };
    case ActionType.SET_DURATION:
      return { ...state, durationInSeconds: parseInt(action.payload, 10) };
    case ActionType.SET_IS_FREE:
      return { ...state, isFree: action.payload };
    case ActionType.SET_SELECTED_ELEMENT:
      return { ...state, selectedElement: action.payload };
    case ActionType.SET_ELEMENTS:
      return { ...state, elements: action.payload };
    case ActionType.SET_EDIT_ELEMENT:
      return { ...state, editElement: action.payload };
    default:
      return state;
  }
};

const Elements = ({ lessonId }: ElementProps) => {
  const { t } = useTranslation('courses');
  const [state, dispatch] = useReducer(ElementsReducer, initialState);
  const { showMessage } = useMessage();

  useEffect(() => {
    getElements(lessonId).then((data) => {
      dispatch({ type: ActionType.SET_ELEMENTS, payload: data.data.items });
    });
  }, [lessonId]);

  const listElements = () => {
    getElements(lessonId).then((data) => {
      dispatch({ type: ActionType.SET_ELEMENTS, payload: data.data.items });
    });
  };

  const validateElement = (content: ElementCreate) => {
    try {
      elementSchema.validateSync(content);
      return true;
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      }
      return false;
    }
  };

  const onElementSubmit = async (content: RecordFromFields) => {
    if (!lessonId) {
      return;
    }

    const _content = content as unknown as ElementCreate;
    const isValid = validateElement(_content);
    if (!isValid) {
      return;
    }
    const res = await createElement(lessonId, _content);
    if (res.status === 201) {
      showMessage('Element added successfully', 'success');
      listElements();
    } else {
      showMessage('Something went wrong, element could not be created', 'error');
    }
  };

  const onElementUpdate = async (content: Element | undefined) => {
    if (!content) {
      return;
    }
    if (!lessonId) {
      return;
    }

    const _content: ElementCreate = {
      content: content.content,
      description: content.description,
      durationInSeconds: content.durationInSeconds,
      elementOrder: content.elementOrder,
      isFree: content.isFree,
      title: content.title,
    };
    const isValid = validateElement(_content);
    if (!isValid) {
      return;
    }
    const res = await updateElement(content);
    if (res.status === 202) {
      showMessage('Element updated successfully', 'success');
      dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: undefined });
      listElements();
    } else {
      showMessage('Something went wrong, element could not be updated', 'error');
    }
  };

  return (
    <>
      {state.editElement?.id && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4 ">
            <p className="text-lg font-bold font-Poppins">{t('updateElement')}</p>
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={'Section title'}
              name={'title'}
              value={state.editElement.title}
              onChange={(event) => {
                const title = event.target.value;
                const element = { ...state.editElement, title };
                dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: element });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type={'text'}
              placeholder={'Section description'}
              name={'description'}
              value={state.editElement.description}
              onChange={(event) => {
                const description = event.target.value;
                const element = { ...state.editElement, description };
                dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: element });
              }}
            />
            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type="number"
              placeholder="Enter Element Order"
              name="elementOrder"
              value={state.editElement.elementOrder}
              onChange={(event) => {
                const elementOrder = parseInt(event.target.value, 10);
                const element = { ...state.editElement, elementOrder };
                dispatch({
                  type: ActionType.SET_EDIT_ELEMENT,
                  payload: element,
                });
              }}
            />

            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type="url"
              placeholder="Enter Element Content"
              name="content"
              value={state.editElement.content}
              onChange={(event) => {
                const content = event.target.value;
                const element = { ...state.editElement, content };
                dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: element });
              }}
            />

            <input
              className="w-full bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2 mb-2"
              type="number"
              placeholder="Enter Duration in Seconds"
              name="durationInSeconds"
              value={state.editElement.durationInSeconds}
              onChange={(event) => {
                const durationInSeconds = parseInt(event.target.value, 10);
                const element = { ...state.editElement, durationInSeconds };
                dispatch({
                  type: ActionType.SET_EDIT_ELEMENT,
                  payload: element,
                });
              }}
            />
            <label className="flex w-full justify-left align-center">
              <input
                className="bg-[#B4B4C124] outline-none rounded-md placeholder-gray-400::placeholder font-normal text-sm text-gray-400 p-2"
                type="checkbox"
                placeholder={t('isThisElementFree') as string}
                name="isFree"
                checked={state.editElement.isFree}
                onChange={(event) => {
                  const isFree = event.target.checked;
                  const element = { ...state.editElement, isFree };
                  dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: element });
                }}
              />
              <span className="mx-2">{t('isFreeLabel')}</span>
            </label>

            <Button onClick={() => onElementUpdate(state.editElement)}>{t('update')}</Button>
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between items-center gap-2 pt-5">
        <p className="font-open-sans font-semibold text-[#000000] text-lg">{t('elementsHeader')}</p>
      </div>

      <div className="w-full">
        <AddContent
          type={t('element')}
          fields={[
            {
              name: 'title',
              placeholder: t('enterElementTitle'),
              value: state.title,
              type: 'text',
            },
            {
              name: 'description',
              placeholder: t('enterElementDescription'),
              value: state.description,
              type: 'text',
            },
            {
              name: 'elementOrder',
              placeholder: t('enterElementOrder') as string,
              value: undefined,
              type: 'number',
            },
            {
              name: 'content',
              placeholder: t('enterElementContent') as string,
              value: state.content,
              type: 'url',
            },
            {
              name: 'durationInSeconds',
              placeholder: t('enterDurationInSeconds') as string,
              value: undefined,
              type: 'number',
            },
            {
              name: 'isFree',
              placeholder: t('isThisElementFree') as string,
              value: `${state.isFree}`,
              type: 'checkbox',
            },
          ]}
          onSubmit={onElementSubmit}
        />
        {state.elements &&
          state.elements.map((element) => (
            <ShowContent key={element.id} title={element.title} content={element.description}>
              <>
                <div className="mt-2">
                  <p>
                    {t('orderLabel')}: {element.elementOrder}
                  </p>
                  <p>
                    {t('contentLable')}: {element.content}
                  </p>
                  <p>
                    {t('durationLabel')}: {element.durationInSeconds} {t('secondsLabel')}
                  </p>
                  <p>{element.isFree ? t('isFreeYes') : t('isFreeNo')}</p>
                </div>
                <Button
                  onClick={() => dispatch({ type: ActionType.SET_EDIT_ELEMENT, payload: element })}
                >
                  {t('editButton')}
                </Button>
                <Quizzes elementId={element.id} />
              </>
            </ShowContent>
          ))}
      </div>
    </>
  );
};

export default Elements;
