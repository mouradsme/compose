import { links } from '@/common/temp';
import Header from '@/components/common/nav/header';
import SideNav from '@/components/common/nav/aside';
import SideNavFooter from '@/components/common/nav/asideMobile';
import { getUserInfoClient } from '@/lib/common';
import { ReactElement, useState } from 'react';
import { navSide } from '@/common/temp';
import { useRouter } from 'next/router';

interface StudentLayoutProps {
  children: ReactElement;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [sideNavLinks] = useState(() => navSide);
  const router = useRouter();

  const isLearningPathsRoute = router.pathname === '/dashboard/learning-paths';

  return (
    <>
      <main>
        <div className="hidden md:inline ">
          <SideNav links={sideNavLinks} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        </div>
        <div
          className={`
              ${isNavOpen ? 'md:ml-[17vw]' : ''} 
              gap-3 transition-all duration-500 ease-in-out`}
        >
          <Header user={getUserInfoClient()} links={links} isNavOpen={isNavOpen} />

          <div className={`${isLearningPathsRoute ? '' : 'p-6'} mb-20 md:mb-1`}>{children}</div>
        </div>
        <div className="md:hidden">
          <SideNavFooter />
        </div>
      </main>
    </>
  );
};

export default StudentLayout;
