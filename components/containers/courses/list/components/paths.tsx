import Image from 'next/image';
import { Path } from './card';
import siine_gray_logo from '@/public/images/siine_gray_logo.svg';
import { useTranslation } from 'next-i18next';

function Paths() {
  const numbers = [1, 9, 0, 2, 3, 9];
  const { t } = useTranslation('courses');
  const renderNumbers = numbers.map((number, index) => {
    return (
      <div
        key={index}
        className="text-center px-2 w-8 py-2 text-[#293B52] font-[Montserrat] text-2xl font-semibold bg-white rounded-lg"
      >
        {number}
      </div>
    );
  });

  const renderCards = (
    <>
      <Path level={'high school'} />
      <Path level={'middle school'} />
      <Path level={'starter school'} />
    </>
  );
  return (
    <div className="flex justify-center items-center mt-10 mb-10 ">
      <div className="flex flex-col justify-center items-center w-5/6 ">
        <div className="text-center lg:text-left text-sm lg:text-xl 2xl:text-2xl text-[#293B52] font-[Montserrat] font-semibold my-8">
          {t('findRightProgram')}
        </div>
        <div className="grid lg:w-4/5 lg:grid-cols-3 gap-8 capitalize">{renderCards}</div>
        <div className="grid lg:grid-cols-2 bg-[#ECF5FC] rounded-3xl lg:w-4/5 mt-10 p-8">
          <div>
            <div className="mb-4">
              <Image width={70} height={70} alt={siine_gray_logo.src} src={siine_gray_logo.src} />
            </div>
            <div className="text-xl lg:text-2xl tet-[#293B52] font-[Montserrat] font-semibold">
              {t('trustedBy')} <br />
              {t('mostStudents')}
            </div>
            <div className="text-[#757575] font-[Montserrat] font-medium mt-3 ">
              {t('descriptionPart1')}
              <span className="hidden lg:inline">{t('descriptionPart2')}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center float-right p-4 gap-2">
            <div className="text-[#273B54] whitespace-nowrap font-[Montserrat] font-semibold text-sm 2xl:text-base ">
              {t('peopleUsing')}
            </div>
            <div className="flex gap-2">{renderNumbers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Paths;
