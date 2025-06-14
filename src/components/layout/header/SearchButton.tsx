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
import SearchBar from '@/components/layout/header/SearchBar';
import MotionButton from '@/components/motion_components/MotionButton';

// This component is a button that opens a search bar in a sheet when clicked.
// It uses in the mobile view only.
const SearchButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex items-center lg:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MotionButton
            buttonType='button'
            variant='secondary'
            size='sm'
            supportingText='Open Search'
            icon={<Search />}
            onClick={() => setOpen(true)}
          />
        </SheetTrigger>
        <SheetContent
          side='top'
          className='text-foreground bg-background/60 border-border h-screen w-full border p-4 backdrop-blur-sm'
        >
          <SheetHeader>
            <SheetTitle>Search</SheetTitle>
            <SheetDescription>Search posts by title, content, or tags.</SheetDescription>
          </SheetHeader>
          <SearchBar setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SearchButton;
