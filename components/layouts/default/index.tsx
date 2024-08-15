import { ReactElement } from 'react';
import Header from '@/components/common/nav/header';
import { links } from '@/common/temp';
import Footer from '@/components/common/nav/footer';
import { getUserInfoClient } from '@/lib/common';

interface DefaultLayoutProps {
  children: ReactElement;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Header user={getUserInfoClient()} links={links} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
