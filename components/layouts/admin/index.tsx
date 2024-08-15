import { links } from '@/common/temp';
import Header from '@/components/common/nav/header';
import SideNav from '@/components/common/nav/aside';
import { ReactElement, useState } from 'react';
import { getUserInfoClient } from '@/lib/common';
import { adminNavSide } from '@/common/temp';

interface AdminLayoutProps {
  children: ReactElement;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [sideNavLinks] = useState(() => adminNavSide);
  return (
    <>
      <main>
        <div className="hidden md:inline ">
          <SideNav links={sideNavLinks} isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
        </div>
        <div
          className={`
              ${isNavOpen ? 'md:ml-[17vw]' : 'md:ml-4'} 
              gap-3 transition-all duration-500 ease-in-out`}
        >
          <Header user={getUserInfoClient()} links={links} isNavOpen={isNavOpen} />
          <div className="p-6">{children}</div>
        </div>
      </main>
    </>
  );
};

export default AdminLayout;
