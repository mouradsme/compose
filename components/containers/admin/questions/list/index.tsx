import { useState } from 'react';
import { BACKEND_URL } from '@/common/config';
import URLS from '@/common/urls';
import Modal from '@/components/common/elements/modal';
import useRequest from '@/hooks/request';
import { Question, QuestionCreate } from '@/common/types/common';
import { createQuestion, updateQuestion, deleteQuestion } from '@/lib/questions';
import Add from '@/components/containers/admin/questions/list/components/add';
import Update from '@/components/containers/admin/questions/list/components/update';
import { ValidationError } from 'yup';
import { questionSchema } from '@/common/schemas';
import Image from 'next/image';
import AddSquareIcon from '@/public/images/Add.svg';
import CaseIcon from '@/public/images/Path 12043.svg';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { AxiosError } from 'axios';
import Button from '@/components/common/buttons';
import { useMessage } from '@/contexts/message';

interface QuestionsProps {
  quizId: string;
}

const Questions = ({ quizId }: QuestionsProps) => {
  const { t } = useTranslation('quizzes');
  const router = useRouter();
  const { showMessage } = useMessage();
  const { courseId } = router.query;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [questionToUpdate, setQuestionToUpdate] = useState<any | undefined>(undefined);
  const { data: questions, mutate } = useRequest({
    url: `${BACKEND_URL}/${URLS.quizzes.list}/${quizId}/${URLS.questions.list}`,
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsUpdateDialogOpen(false);
  };

  const reset = () => {
    mutate();
  };

  const handleAddQuestion = async (question: QuestionCreate) => {
    try {
      await questionSchema.validate(question);
      await createQuestion(quizId, question);
      showMessage(t('questionCreatedSuccessfully') as string, 'success');
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      } else if (err instanceof AxiosError) {
        const message = err.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongQuestionNotCreated') as string, 'error');
      }
      return;
    }
    reset();
    handleDialogClose();
  };

  const handleUpdateQuestion = async (question: Question) => {
    try {
      await questionSchema.validate(question);
      await updateQuestion(question);
      showMessage(t('questionUpdatedSuccessfully') as string, 'success');
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      } else if (err instanceof AxiosError) {
        const message = err.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongQuestionNotUpdated') as string, 'error');
      }
      return;
    }
    reset();
    handleDialogClose();
  };
  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      showMessage(t('questionDeletedSuccessfully') as string, 'success');
    } catch (err) {
      if (err instanceof ValidationError) {
        showMessage(err.errors[0], 'error');
      } else if (err instanceof AxiosError) {
        const message = err.response?.data.errors[0].message;
        showMessage(message, 'error');
      } else {
        showMessage(t('somethingWentWrongQuestionNotDeleted') as string, 'error');
      }
    }
    reset();
  };

  const onUpdateClick = (question: Question) => {
    setQuestionToUpdate(question);
    setIsUpdateDialogOpen(true);
  };

  return (
    <>
      {isDialogOpen && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('addNewQuestion')}</p>
            <Add onCancel={handleDialogClose} onSubmit={handleAddQuestion} />
          </div>
        </Modal>
      )}
      {isUpdateDialogOpen && questionToUpdate && (
        <Modal>
          <div className="bg-white p-4 rounded-lg shadow-lg w-4/12 flex flex-col items-center gap-4">
            <p className="text-lg font-bold font-Poppins">{t('updateQuestion')}</p>
            <Update
              onCancel={handleDialogClose}
              onSubmit={handleUpdateQuestion}
              question={questionToUpdate}
            />
          </div>
        </Modal>
      )}
      <div className="flex flex-row justify-between mb-3">
        <div className="flex flex-row gap-3 w-1/4">
          <Image width={25} height={25} src={CaseIcon.src} alt="over-view_icon" />
          <p className="font-Poppins text-[#080940] text-2xl font-semibold">
            {t('quizzQuestions')}
          </p>
        </div>
        <div className="flex flex-row w-3/4 justify-end gap-1">
          <button
            className="w-3/12 border flex  flex-row rounded-full gap-1 h-8 justify-center items-center cursor-pointer bg-gradient-to-r from-[#0F54EF] to-[#2686FF] hover:from-[#0F54EF] hover:to-[#4479D1] "
            onClick={() => router.push(`/admin/dashboard/courses/${courseId}`)}
          >
            <p className="font-open-sans text-white text-xs font-normal mx-2">
              {t('goBackToCoursePage')}
            </p>
          </button>
          <button
            className="w-3/12 border flex  flex-row rounded-full gap-1 h-8 justify-center items-center cursor-pointer bg-gradient-to-r from-[#0F54EF] to-[#2686FF] hover:from-[#0F54EF] hover:to-[#4479D1] "
            onClick={() => setIsDialogOpen(true)}
          >
            <Image
              className="ml-1"
              width={15}
              height={15}
              src={AddSquareIcon.src}
              alt="over-view_icon"
            />
            <p className="font-open-sans text-white text-xs font-normal mx-2">{t('addQuestion')}</p>
          </button>
        </div>
      </div>
      <div className="border border-r-2 border-gray-300 w-full ml-6 "></div>
      <div className="pl-7 pr-5">
        <div className="w-full pt-3">
          <div className="bg-white shadow-md">
            <table className="w-full">
              <thead className="bg-[#F5F7F9]">
                <tr>
                  {[t('question'), t('suggestedAnswers'), t('actions')].map((header) => (
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
                {questions?.items?.map((question: Question, index: number) => (
                  <tr key={question.id} className={index % 2 === 0 ? 'bg-[#F5F7F9]' : 'bg-white'}>
                    <td className="text-blue-600 font-Poppins text-sm text-center py-3">
                      {question.content[Math.floor(Math.random() * question.content.length)]}
                    </td>
                    <td className="text-gray-600 font-Poppins text-sm text-center">
                      {question.suggestedAnswers.length}
                    </td>
                    <td className="text-gray-600 font-Poppins flex flex-row gap-3 justify-center">
                      <Button type="info" onClick={async () => await onUpdateClick(question)}>
                        {t('update')}
                      </Button>
                      <Button
                        onClick={async () => await handleDeleteQuestion(question.id)}
                        type="danger"
                      >
                        {t('delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questions;
