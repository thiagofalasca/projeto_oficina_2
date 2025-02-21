import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Footer from './Footer';
import { Bars3Icon } from '@heroicons/react/24/outline';
import AppLogo from '../AppLogo';
import NavLinks from './NavLinks';
import { adminLinks, userLinks } from '@/lib/constants';

const MobileNav = async ({ user }: { user: loggedUser }) => {
  return (
    <section className="w-fulll max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Bars3Icon className="w-6 text-gray-700" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="hidden">Mobile menu</SheetTitle>
          <SheetClose asChild>
            <AppLogo type="mobile" />
          </SheetClose>
          <div className="mobilenav">
            <nav className="flex h-full flex-col gap-6 pt-16">
              <NavLinks
                type="mobile"
                links={user.role === 'user' ? userLinks : adminLinks}
              />
            </nav>
            <Footer type="mobile" user={user} />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
