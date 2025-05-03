import NavLinksDesktop from '@/components/Header/NavLinksDesktop';
import SearchBar from '@/components/Header/SearchBar';
import SearchButton from '@/components/Header/SearchButton';
import UserComponent from '@/components/Header/UserComponent';
import ThemeToggle from '@/components/Header/ThemeToggle';
import NavLinksMobile from '@/components/Header/NavLinksMobile';
import Logo from '@/components/Header/Logo';

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
      <div className='inner-container flex items-center justify-between'>
        {/* Left side: Logo and NavLinksDesktop */}
        <div className='flex items-center justify-start gap-16'>
          <Logo />
          {/* Hide in mobile mode */}
          {!isBasic && (
            <div className='hidden items-center justify-center md:flex'>
              <NavLinksDesktop />
            </div>
          )}
        </div>

        {/* Right side: SearchBar/Btn, UserComponent, ThemeToggle, NavLinksMobile */}
        {!isBasic && (
          <div className='flex items-center justify-end gap-4'>
            {/* Show only in desktop mode */}
            <div className='hidden items-center justify-center md:flex'>
              <SearchBar />
            </div>
            <UserComponent />
            {/* Show only in mobile mode */}
            <div className='flex items-center justify-center md:hidden'>
              <SearchButton />
            </div>
            <ThemeToggle />
            <div className='flex items-center justify-center md:hidden'>
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
