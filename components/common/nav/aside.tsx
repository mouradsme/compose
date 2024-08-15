import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const AdminSideNav = ({ isNavOpen, setIsNavOpen, links }: any) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState(router.route);

  const activePoint = (
    <span className="relative flex h-2 w-2">
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white opacity-50 "></span>
    </span>
  );
  const inActivePoint = (
    <span className="relative flex items-center justify-center h-3 w-3">
      <span className=" absolute inline-flex h-full w-full rounded-full bg-white opacity-25"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-white opacity-75"></span>
    </span>
  );

  const renderSideLinks = links.map((item: any, index: number) => {
    return (
      <div
        key={index}
        className={`text-[#7C8DA6] text-xs 2xl:text-lg ${
          selectedLink === item.url ||
          item.children?.some((child: any) => selectedLink === child.url)
            ? 'bg-[#2686FF] text-white '
            : ''
        } 
            my-1 hover:bg-[#2699ff] rounded-lg hover:text-white px-4 w-full`}
      >
        <div
          onClick={() => {
            if (item.children) {
              const selected = item.children?.some((child: any) => selectedLink === child.url);
              if (selected) {
                return;
              }
              const url = item.children[0].url;
              setSelectedLink(url);
              router.push(url);
              return;
            }
            setSelectedLink(item.url);
            router.push(item.url);
          }}
          className={'text-xs 2xl:text-lg flex gap-2 py-2 cursor-pointer'}
        >
          <div className="w-5">
            {typeof item.logo === 'function' ? (
              <item.logo
                width="24"
                height="24"
                fill={`${selectedLink === item.url ? '#fff' : '#767676'}`}
              />
            ) : (
              <Image
                src={item.logo.src}
                alt={t(item.label)}
                width={15}
                height={15}
                className={`hover:turn-white mt-0.75 2xl:mt-1 w-5 ${
                  selectedLink === item.url ? 'turn-white' : ''
                }`}
              />
            )}
          </div>
          <div className="flex flex-col gap-3 w-full ">
            <div className="flex gap-6 justify-between items-center  ">
              <div>{t(item.label)}</div>
            </div>
            {item.children &&
              item.children?.some((child: any) => selectedLink === child.url) &&
              item.children.map((child: any, childIndex: number) => (
                <div key={childIndex} className="flex gap-2 items-center">
                  {selectedLink === child.url ? activePoint : inActivePoint}
                  <Link
                    href={child.url}
                    onClick={() => setSelectedLink(child.url)}
                    className={'text-xs 2xl:text-lg flex gap-2 py-2 cursor-pointer'}
                  >
                    {t(child.label)}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      className={`flex flex-col h-screen bg-white   ${
        isNavOpen ? ' border-r   w-[17vw]' : 'w-0'
      } absolute z-[100] top-0   transition-all duration-500 ease-in-out overflow-hidden `}
    >
      <div className="fixed h-full w-2/12 overflow-hidden  ">
        <button
          className="flex items-center justify-center w-12 h-12 text-white focus:outline-none"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isNavOpen ? (
              <path fill="#292D32" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            ) : (
              <path fill="#292D32" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            )}
          </svg>
        </button>

        <div
          className={`  flex flex-col justify-between overflow-hidden 
                          h-[95vh] w-full p-3
                          ${!isNavOpen && '-translate-x-full'}
                          transition-all duration-500 ease-in-out
                          
                `}
        >
          <nav className="flex flex-col mt-2  ">{renderSideLinks}</nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSideNav;
