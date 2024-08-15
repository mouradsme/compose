import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navSide } from '@/common/temp';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const SideNavFooter = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState(router.route);

  const renderSideLinks = navSide.map((item: any, index: any) => {
    return (
      <div
        key={index}
        className={` text-[#7C8DA6] text-xs 2xl:text-lg ${
          selectedLink === item.url || selectedLink === item.url1 || selectedLink === item.url2
            ? 'bg-[#2686FF] text-white '
            : ''
        } 
            my-1 hover:bg-[#2699ff] ${
              selectedLink === '/learning-path-discover' ||
              selectedLink === '/learning-path' ||
              selectedLink === '/learning-path-complete'
                ? 'rounded-full'
                : 'rounded-full'
            } hover:text-white px-4 w-full   `}
      >
        <Link
          href={item.url}
          onClick={() => setSelectedLink(item.url)}
          className={' text-xs 2xl:text-lg flex gap-2  py-2  '}
        >
          <div className="w-5 ">
            <Image
              src={item.logo.src}
              alt={item.logo.src}
              width={18}
              height={18}
              className={` hover:turn-white mt-0.75 2xl:mt-1 ${
                selectedLink === item.url ? ' turn-white' : ''
              }  `}
            />
          </div>
          {selectedLink === item.url && (
            <div className="flex flex-col gap-3 w-full ">
              <div className="flex whitespace-nowrap gap-6 justify-between items-center  ">
                <div>{t(item.label)}</div>
              </div>
            </div>
          )}
        </Link>
      </div>
    );
  });

  return (
    <div className={' fixed bottom-0   flex   w-full bg-white z-[100]'}>
      <div className={' flex justify-between overflow-hidden w-full p-3'}>
        <nav className="flex w-full justify-between mt-2  ">{renderSideLinks}</nav>
      </div>
    </div>
  );
};

export default SideNavFooter;
