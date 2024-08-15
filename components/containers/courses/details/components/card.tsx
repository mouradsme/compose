import { Element } from '@/common/types/common';
import { Checked, Close } from '@/components/Icons';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface CardProps {
  element: Element;
  completed?: boolean;
}

const Card = ({ element, completed = undefined }: CardProps) => {
  const { t } = useTranslation('courses');
  return (
    <div className="mb-5 h-full rounded-lg overflow-hidden bg-white shadow-lg w-full  text-[0.65rem] 2xl:text-sm text-black card">
      <div className="relative z-40  ">
        <Image
          src={'https://picsum.photos/1500'}
          alt={'Card Image'}
          width={1000}
          height={1000}
          className="w-full h-full object-cover image-container "
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 image-containers ">
          <p className="text-sm font-bold text-white">{element.title}</p>
        </div>
      </div>

      <div className="p-3 w-full relative h-full ">
        <div className="sticky">
          <div className="flex items-center justify-around gap-2 ">
            <div className="w-2/3 text-clip overflow-hidden text-left h-16">
              {element.description}
            </div>
            <div className="border-4 w-1/3 h-16 rounded-full flex flex-col items-center justify-center border-[#2686FF] text-black w-1/2">
              <div className="text-sm font-semibold">
                {(element.durationInSeconds / 60).toFixed(2)}
              </div>
              <div className="text-xs font-semibold ">{t('minutes')}</div>
            </div>
          </div>
          {completed === undefined ? undefined : (
            <div className="flex flex-row content-center items-center p-2">
              <span>{t('completed')}</span>
              {completed === true && <Checked />}
              {completed === false && <Close />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
