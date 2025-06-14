import Logo from '@/components/layout/header/Logo';
import NavLinksDesktop from '@/components/layout/header/NavLinksDesktop';
import NavLinksMobile from '@/components/layout/header/NavLinksMobile';
import SearchBar from '@/components/layout/header/SearchBar';
import SearchButton from '@/components/layout/header/SearchButton';
import ThemeToggle from '@/components/layout/header/ThemeToggle';
import UserComponent from '@/components/layout/header/UserComponent';

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
    <header className='outer-container bg-[linear-gradient(to_bottom,theme(colors.background)_0%,theme(colors.background)_80%,transparent_100%)] sticky top-0 z-50'>
      <div className='inner-container flex items-center justify-between py-3 text-sm'>
        {/* Left side: Logo and NavLinksDesktop */}
        <div className='flex items-center justify-start gap-2 lg:gap-16'>
          <div className='flex items-center justify-center lg:hidden'>
            {/* Show only in mobile mode */}
            <NavLinksMobile />
          </div>
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
          <div className='flex items-center justify-end lg:gap-3'>
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
