import Link from 'next/link';
import Image from 'next/image';
import nav_logo from '@/public/images/nav_logo.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserSessionData } from '@/common/types/common';
import LogoutIcon from '@/public/images/Path 12039.svg';
import admin_image from '@/public/images/Ellipse 205.png';
import { deleteCookie } from 'cookies-next';
import { ACCESS_TOKEN_NAME } from '@/common/config';
import { useTranslation } from 'next-i18next';
import { setActivity } from '@/lib/profile';
import { FaTimes } from 'react-icons/fa';

interface HeaderProps {
  links: any;
  user: UserSessionData;
  isNavOpen?: boolean;
}

const SelectItem = ({ link, extraActiveLink, active, ...rest }: any) => {
  const { t } = useTranslation();
  const arrow = (
    <span className="flex items-center pl-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        fill="currentColor"
        className="bi bi-chevron-down"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </span>
  );

  return (
    <Link
      href={link.url}
      {...rest}
      className={`${active ? 'text-blue-500' : 'text-gray-700'} 
                                    flex w-24 px-3 py-2 
                                    rounded-md 
                                    text-sm font-medium 
                                    2xl:text-lg
                                    2xl:w-28
                                    hover:text-gray-900 
                                    hover:bg-gray-50 
                                    focus:outline-none 
                                    whitespace-nowrap 
                                    active:bg-blue-600 active:text-white`}
    >
      {t(link.label)}
      {extraActiveLink && arrow}
    </Link>
  );
};

const Header = ({ links, user, isNavOpen = false }: HeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isDashboard =
    router.pathname.includes('/dashboard/') || router.pathname.includes('/lessons/');
  const extraLinks: any[] = [];
  const normalLinks = links;

  const [activeHeader, setActiveHeader] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(user.fullName);
  }, [user]);

  useEffect(() => {
    const handleStart = () => setActiveHeader(false);

    router.events.on('routeChangeStart', handleStart);

    return () => {
      router.events.off('routeChangeStart', handleStart);
    };
  }, [router]);

  const handleSetExtraActiveLink = () => {
    if (!extraLinks.length) {
      return 1;
    }
    const extraLink = extraLinks.find((l: any) => l.url === router.pathname);

    if (extraLink) {
      return extraLink.id;
    } else {
      return 1;
    }
  };

  const [extraActiveLink, setExtraActiveLink] = useState(handleSetExtraActiveLink);

  const handleLinkClick = (link: any) => {
    setExtraActiveLink(link.id);
  };

  const onProfileClick = () => {
    const authoroties = user.authorities;
    if (authoroties.includes('ROLE_ADMIN')) {
      router.push('/admin/dashboard/courses/list');
      return;
    }
    router.push('/dashboard/learning-paths');
  };

  const onLogout = () => {
    const authoroties = user.authorities;
    const isAdmin = authoroties.includes('ROLE_ADMIN');
    sendHeartbeat();
    deleteCookie(ACCESS_TOKEN_NAME);
    if (isAdmin) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  const sendHeartbeat = async () => {
    const startTime = localStorage.getItem('startTime');
    const endTime = new Date().toISOString();

    if (startTime) {
      try {
        setActivity(startTime, endTime);
      } catch (error) {
        console.error('Failed to send activity data:', error);
        return;
      }
      localStorage.removeItem('startTime');
    }
  };

  const navItemsRenderX = extraLinks.map((link: any) => {
    const active = router.pathname === link.url;

    if (extraActiveLink === link.id || !extraActiveLink)
      return (
        <SelectItem
          key={link.id}
          link={link}
          extraActiveLink={extraActiveLink}
          active={active}
          onClick={() => handleLinkClick(link)}
          onMouseOver={() => setExtraActiveLink(() => null)}
          onMouseLeave={() => setExtraActiveLink(handleSetExtraActiveLink)}
        />
      );
  });

  const navItemsRender = normalLinks.map((link: any) => {
    const active = router.pathname === link.url;
    return (
      <Link
        key={link.id}
        href={link.url}
        className={`${active ? 'text-blue-500' : 'text-gray-700'} 
                            px-3 py-2 rounded-md 
                            text-sm font-medium
                            2xl:text-lg 
                            hover:text-gray-900 
                            hover:bg-gray-50 
                            focus:outline-none 
                            active:bg-blue-600 active:text-white`}
      >
        {t(link.label)}
      </Link>
    );
  });

  const navItemsRenderPhone = links.map((link: any) => {
    const active = router.pathname === link.url;
    return (
      <Link
        key={link.id}
        href={link.url}
        className={`${active ? 'text-blue-500' : 'text-gray-700'} 
                            px-3 py-2 rounded-md 
                            text-sm font-medium
                            2xl:text-lg 
                            text-center
                            hover:text-gray-900 
                            hover:bg-gray-50 
                            focus:outline-none 
                            active:bg-blue-600 active:text-white`}
      >
        {t(link.label)}
      </Link>
    );
  });

  return (
    <div className="mb-14 2xl:mb-16 ">
      <nav
        className={`bg-white border-b-2 border-gray-100 fixed w-full top-0 z-[70] font-open-sans  ${
          isNavOpen ? 'w-full md:max-w-[83vw]' : ''
        }`}
      >
        <div
          className={`flex items-center h-14 2xl:h-16  ${
            isNavOpen
              ? 'md:justify-start md:gap-32 lg:gap-42 xl:justify-around'
              : 'justify-between md:justify-around max-w-6xl mx-auto px-4 lg:px-36 2xl:px-1 2xl:gap-5 2xl:max-w-7xl'
          }`}
        >
          {!isDashboard && (
            <div>
              <Link href="/" className="text-2xl font-bold text-gray-800">
                <Image width={100} height={100} alt={nav_logo.src} src={nav_logo.src} />
              </Link>
            </div>
          )}
          <div className="hidden md:block ">
            <div className=" h-14 2xl:h-16 flex items-center gap-2  2xl:gap-3 shadow-[0px_4px_2px_-2px_rgba(0,0,0,0.3)]">
              <div className={`flex flex-col bg-white ${!extraActiveLink && 'mt-20 2xl:mt-24'}`}>
                {navItemsRenderX}
              </div>

              {navItemsRender}
            </div>
          </div>

          <div className="hidden md:block">
            {username ? (
              <div className="flex flex-row gap-2 items-center">
                <div
                  className="flex flex-row items-center gap-4 hover:bg-blue-300 rounded-full h-fit cursor-pointer p-2"
                  onClick={onProfileClick}
                >
                  <div>
                    <div className="w-7 h-7 bg-[#f2f4f8] flex justify-center items-center rounded-full">
                      <Image width={50} height={50} src={admin_image.src} alt={'student'} />
                    </div>
                  </div>
                  <div>
                    <p className="text-open-sans text-sm font-medium text-blue-700">{username}</p>
                  </div>
                </div>
                <button
                  className="flex flex-row gap-2 my-5 justify-start items-center cursor-pointer hover:bg-red-300 rounded-full p-2 font-semibold font-[open sans] text-xs text-[#FF3B30]"
                  onClick={onLogout}
                >
                  <Image width={15} height={15} src={LogoutIcon.src} alt={'logout_icon'} />
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center ">
                <Link
                  href="/login"
                  className=" bg-[#F1F7FF] 
                                        flex hover:bg-[#bfdbff] 
                                        text-black 
                                        text-sm 
                                        font-bold 
                                        py-2 px-2 
                                        rounded-lg 
                                        "
                >
                  <div className="[&>span]:text-[#2686FF] 2xl:text-lg ">
                    <span>{t('header.loginInto')}</span> &nbsp; {t('header.theAcademy')}
                  </div>
                  <div className="flex items-center pl-2">
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
            )}
          </div>

          <div
            className="md:hidden flex py-1 px-2 items-center border-2 rounded-full border-black cursor-pointer gap-1"
            onClick={() => setActiveHeader(!activeHeader)}
          >
            <button className="flex items-center justify-center w-6 h-6 focus:outline-none transition-transform duration-300 transform">
              {activeHeader ? (
                <FaTimes
                  className={`${activeHeader ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
                />
              ) : (
                <svg
                  className={`fill-current ${
                    activeHeader ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
                  }`}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="#292D32" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      {activeHeader && (
        <div
          className={`lg:hidden absolute w-full bg-white z-[100] py-3 border-b-2 transition-all duration-300 transform opacity-100 translate-y-0 ${
            activeHeader ? '' : 'opacity-0 -translate-y-5'
          }`}
        >
          <div className="flex flex-col justify-center items-center ">
            {navItemsRenderPhone}
            {username ? (
              <div className="flex flex-col items-center">
                <div
                  className="flex flex-row items-center gap-4 hover:bg-blue-300 rounded-full h-fit cursor-pointer p-2"
                  onClick={onProfileClick}
                >
                  <div>
                    <div className="w-7 h-7 bg-[#f2f4f8] flex justify-center items-center rounded-full">
                      <Image width={50} height={50} src={admin_image.src} alt={'student'} />
                    </div>
                  </div>
                  <div>
                    <p className="text-open-sans text-sm font-medium text-blue-700">{username}</p>
                  </div>
                </div>
                <button
                  className="flex flex-row gap-2 my-2 justify-start items-center cursor-pointer hover:bg-red-300 rounded-full p-2 font-semibold text-xs text-[#FF3B30]"
                  onClick={onLogout}
                >
                  <Image width={15} height={15} src={LogoutIcon.src} alt={'logout_icon'} />
                  {t('header.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className=" bg-[#F1F7FF] 
                          flex hover:bg-[#bfdbff] 
                          text-black 
                          text-sm 
                          font-bold 
                          py-2 px-2 
                          rounded-lg 
                          text-center 
                          whitespace-nowrap
                          w-1/2
                          "
              >
                <div className="[&>span]:text-[#2686FF] 2xl:text-lg ">
                  <span>{t('header.loginInto')}</span> &nbsp; {t('header.theAcademy')}
                </div>
                <div className="flex items-center pl-2">
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
