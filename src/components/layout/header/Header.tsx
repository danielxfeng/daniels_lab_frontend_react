import NavLinksDesktop from '@/components/layout/header/NavLinksDesktop';
import SearchBar from '@/components/layout/header/SearchBar';
import SearchButton from '@/components/layout/header/SearchButton';
import UserComponent from '@/components/layout/header/UserComponent';
import ThemeToggle from '@/components/layout/header/ThemeToggle';
import NavLinksMobile from '@/components/layout/header/NavLinksMobile';
import Logo from '@/components/layout/header/Logo';

/**
 * A Header component that contains:
 * - Logo
 * - SearchBar
 * - UserComponent
 * - ThemeToggle
 * - NavLinksDesktop (visible on larger screens)
 * - NavLinksMobile (visible on smaller screens)
 * @returns Header component
 */
const Header = ({ isBasic }: { isBasic?: boolean }) => {
  return (
    <header className='outer-container bg-background sticky top-0 z-50'>
      <div className='inner-container flex items-center justify-between py-3'>
        {/* Left side: Logo and NavLinksDesktop */}
        <div className='flex items-center justify-start gap-16'>
          <Logo />
          {/* Hide in mobile mode */}
          {!isBasic && (
            <div className='hidden items-center justify-center lg:flex'>
              <NavLinksDesktop />
            </div>
          )}
        </div>

        {/* Right side: SearchBar/Btn, UserComponent, ThemeToggle, NavLinksMobile */}
        {!isBasic && (
          <div className='flex items-center justify-end gap-4'>
            {/* Show only in desktop mode */}
            <div className='hidden items-center justify-center lg:flex'>
              <SearchBar />
            </div>
            <UserComponent />
            {/* Show only in mobile mode */}
            <div className='flex items-center justify-center lg:hidden'>
              <SearchButton />
            </div>
            <ThemeToggle />
            <div className='flex items-center justify-center lg:hidden'>
              {/* Show only in mobile mode */}
              <NavLinksMobile />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
