import { confirmInviteSupervisor } from '@/lib/supevisors';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMessage } from '@/contexts/message';

const Confirm = () => {
  const { t } = useTranslation(['common', 'supervisors']);
  const { showMessage } = useMessage();
  const router = useRouter();
  const token = router.query['confirmation-token'];

  const onSubmit = async () => {
    if (!token) {
      showMessage(t('invalidToken', { ns: 'supervisors' }) as string, 'error');
      return;
    }
    try {
      await confirmInviteSupervisor(token as string);
    } catch (err: any) {
      showMessage(err.message, 'error');
      return;
    }
    showMessage(t('successMessage', { ns: 'supervisors' }) as string, 'success');
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen">
        <div className="grid gap-8 w-1/3">
          <div className="text-2xl 2xl:text-4xl text-[#131B2B] font-bold">
            {t('acceptInvitation', { ns: 'supervisors' })}
          </div>
          <button
            onClick={onSubmit}
            className="text-[0.7rem] text-white cursor-pointer flex justify-center items-center  bg-gradient-to-r from-[#0F54EF]
                      to-[#6B96E9] 
                      rounded-lg 
                      2xl:rounded-2xl
                      py-2
                      my-2 
                      2xl:text-base
                      2xl:py-4
                      w-full
                      font-[roboto]
                      "
          >
            {t('submit')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Confirm;
