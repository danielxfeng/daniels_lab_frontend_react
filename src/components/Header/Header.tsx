import NavLinksDesktop from '@/components/Header/NavLinksDesktop';
import SearchBar from '@/components/Header/SearchBar';
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
const Header = () => {
  return (
    <header className='outer-container sticky top-0 z-50 bg-gray-200'>
      <div className='inner-container flex justify-between'>
        {/* Left side: Logo and NavLinksDesktop */}
        <div className='flex items-center justify-start gap-16'>
          <Logo />
          {/* Hide in mobile mode */}
          <div className='hidden md:flex'>
            <NavLinksDesktop />
          </div>
        </div>

        {/* Right side: SearchBar, UserComponent, ThemeToggle, NavLinksMobile */}
        <div className='flex items-center justify-end gap-4'>
          <SearchBar />
          <UserComponent />
          <ThemeToggle />
          <div className='md:hidden'>
            {/* Show only in mobile mode */}
            <NavLinksMobile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
