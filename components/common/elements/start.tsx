import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const GetStarted = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className=" flex justify-center items-center my-4 	 ">
        <div className="grid lg:grid-cols-2 rounded-xl shadow-xl lg:shadow w-5/6 2xl:w-full mt-10 p-8 ">
          <div className=" ">
            <div className="text-xl text-center lg:text-left mb-2 text-[#293B52] font-[Poppins] font-semibold">
              {t('getStarted.ready')}
            </div>
            <div className="text-sm text-center lg:text-left text-[#757575] font-[Montserrat] ">
              {t('getStarted.description')}
            </div>
          </div>
          <div className="flex  items-center justify-center lg:justify-end lg:items-end lg:float-right py-3  lg:p-4 gap-2">
            <Link
              href="#"
              className="   flex items-center 
                            px-4 lg:px-10 py-2 text-xs text-center text-white font-medium 
                            bg-gradient-to-r from-[#0F54EF] to-[#2686FF] rounded-full   
                          "
            >
              {t('getStarted.register')}
              <div className="flex items-center pl-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default GetStarted;
