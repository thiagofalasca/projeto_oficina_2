import { cn } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/outline';
import { SignOutButton } from '../SignOutButton';

interface FooterProps {
  type?: 'mobile' | 'desktop';
  user: loggedUser;
}

const Footer = async ({ type = 'desktop', user }: FooterProps) => {
  return (
    <footer className="footer">
      <div
        className={cn('footer-div', { 'max-xl:hidden': type === 'desktop' })}
      >
        <div className="footer-icon">
          <UserIcon width={25} />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="footer-name">{user.name}</h1>
          <p className="footer-email">{user.email}</p>
        </div>
      </div>

      <SignOutButton type={type} />
    </footer>
  );
};

export default Footer;
