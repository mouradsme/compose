import { useMessage } from '@/contexts/message';
import { createPaymentProof } from '@/lib/payments';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface CcpProps {
  subscription: string;
  method: string;
}

const Ccp = ({ method, subscription }: CcpProps) => {
  const { t } = useTranslation('plans');
  const { showMessage } = useMessage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const handleUpload = () => {
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 200);
  };

  const handleDragEnter = (event: any) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: any) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    handleUpload();
  };

  const handleFileSelect = (event: any) => {
    setSelectedFile(event.target.files[0]);
    handleUpload();
  };

  const onSubmit = async () => {
    if (!selectedFile?.name) {
      return;
    }

    const res = await createPaymentProof(selectedFile, method, subscription);

    if (res.status === 204) {
      showMessage(t('paymentProofUploaded') as string, 'success');
      router.push('/dashboard/learning-paths');
    } else {
      showMessage(t('paymentProofError') as string, 'error');
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center m-5 lg:m-10 font-[Poppins] ${
          isDragOver ? 'bg-gray-200' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="bg-[#FAFAFC] w-full lg:w-1/3 py-14 lg:py-10 2xl:py-20 flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-[#CBCEDC] ">
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileSelect} />
            {selectedFile?.name?.length ? (
              <>
                <h2 className="text-base lg:text-xl 2xl:text-2xl font-bold mb-2">
                  {t('selectedFile')}
                </h2>
                <p className=" break-all	text-center	 ">{selectedFile?.name}</p>
              </>
            ) : (
              <span className="text-xs 2xl:text-sm font-medium">
                {isDragOver ? (
                  <span>{t('dropFileHere')}</span>
                ) : (
                  <span className="text-[#7C8EA6]">
                    {t('dropFileOr')} &nbsp;
                    <span className="text-[#0F54EF]">{t('browse')}</span>
                  </span>
                )}
              </span>
            )}
          </label>
        </div>
        {selectedFile?.name?.length && uploadProgress < 100 ? (
          <div className="w-full lg:w-1/3 flex items-center gap-2  my-6 ">
            <div className="w-full">
              <div className=" w-full bg-[#2884FF3B] rounded-full">
                <div
                  className="bg-blue-500 text-xs 2xl:text-sm leading-none p-1 text-center text-white rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs 2xl:text-sm font-bold text-[#0F54EF] ">{uploadProgress}%</div>
            <div className="text-gray-300 text-xs 2xl:text-sm whitespace-nowrap	">
              {t('progress')}
            </div>
          </div>
        ) : undefined}
      </div>
      <div className={'flex flex-col items-center justify-center w-full '}>
        <div className={' w-full lg:w-1/3 p-2 2xl:p-3 font-[Poppins]'}>
          <table className="table-auto whitespace-nowrap	text-[#384364] ">
            <tbody>
              <tr>
                <td className="font-semibold text-sm 2xl:text-lg ">{t('ccp')}</td>
                <td className="p-2 2xl:p-3 text-xs 2xl:text-sm text-[#7C8EA6] font-semibold">
                  19250384
                </td>
                <td className="p-2 2xl:p-3 text-xs 2xl:text-sm font-semibold text-[#384364]">
                  {t('key')}
                </td>
                <td className="p-2 2xl:p-3 text-xs 2xl:text-sm text-[#7C8EA6] font-semibold">41</td>
              </tr>
              <tr>
                <td className="font-semibold text-sm 2xl:text-lg  ">{t('name')}</td>
                <td className="p-2 2xl:p-3 text-xs 2xl:text-sm text-[#7C8EA6] font-semibold">
                  Belhacel Omar Tadj Elmoulouk
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-2 2xl:gap-3 justify-center items-center ">
            <div className="whitespace-nowrap text-xs 2xl:text-base text-[#364067] font-medium">
              {t('orByBaridimob')}
            </div>
            <div className="bg-[#707070] w-full h-px"></div>
          </div>

          <table className="table-auto whitespace-nowrap	text-[#384364]">
            <tbody>
              <tr>
                <td className="font-semibold text-sm 2xl:text-lg ">{t('rip')}</td>
                <td className="p-2 2xl:p-3"></td>
                <td className="p-2 2xl:p-3  text-[#7C8EA6] text-sm 2xl:text-lg font-semibold">
                  00799999001925038441
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-center ">
            {selectedFile?.name ? (
              <button
                className="text-[0.7rem] 2xl:text-base text-white cursor-pointer bg-gradient-to-b lg:bg-gradient-to-r from-[#0F54EF] to-[#6B96E9] rounded-lg 2xl:rounded-xl py-3 my-3 lg:py-2 lg:my-2 2xl:py-3 2xl:my-3 w-2/3 lg:w-full font-[roboto]"
                onClick={onSubmit}
              >
                {t('sendReceiptPayment')}
              </button>
            ) : (
              <button
                disabled
                className="text-[0.7rem] 2xl:text-base text-white bg-[#6B96E9] rounded-lg 2xl:rounded-xl py-3 my-3 lg:py-2 lg:my-2 2xl:py-3 2xl:my-3 w-2/3 lg:w-full font-[roboto]"
              >
                {t('sendReceiptPayment')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ccp;
