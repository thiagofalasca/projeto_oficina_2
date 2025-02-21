import React from 'react';
import NavLinks from './NavLinks';
import AppLogo from '../AppLogo';
import Footer from './Footer';
import { adminLinks, userLinks } from '@/lib/constants';

const SideNav = async ({ user }: { user: loggedUser }) => {
  return (
    <div className="sidenav">
      <nav className="flex flex-col gap-4">
        <AppLogo type="desktop" />
        <NavLinks links={user.role === 'user' ? userLinks : adminLinks} />
      </nav>
      <Footer user={user} />
    </div>
  );
};

export default SideNav;
