import NavLinks from '@/components/Header/NavLinks';
import SearchBar from '@/components/Header/SearchBar';
import UserComponent from '@/components/Header/UserComponent';

const Header = () => {
  return (
    <header>
      <div>Logo</div>
      <NavLinks />
      <div>
        <SearchBar />
        <UserComponent />
      </div>
    </header>
  );
};

export default Header;
