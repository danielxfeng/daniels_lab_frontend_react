import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import MotionIconButton from '@/components/motion_components/MotionIconButton';
import SearchBar from '@/components/Header/SearchBar';

// This component is a button that opens a search bar in a sheet when clicked.
// It uses in the mobile view only.
const SearchButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MotionIconButton
            icon={<Search className='h-5 w-5' />}
            ariaLabel='Open Search'
            onClick={() => setOpen(true)}
          />
        </SheetTrigger>
        <SheetContent side='top' className='h-screen w-full p-4'>
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>Search posts by title, content, or tags.</SheetDescription>
          </SheetHeader>
          <SearchBar />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchButton;
