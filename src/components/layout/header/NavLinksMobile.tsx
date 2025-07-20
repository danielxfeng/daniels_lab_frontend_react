import { useState } from 'react';
import { Menu } from 'lucide-react';

import MotionButton from '@/components/motion_components/MotionButton';
import MotionTextLink from '@/components/motion_components/MotionTextLink';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import navMenu from '@/constants/navMenu';

const NavLinksMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex items-center lg:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MotionButton
            buttonType='button'
            variant='secondary'
            size='sm'
            supportingText='Open Menu'
            icon={<Menu />}
            onClick={() => setOpen(true)}
            dataRole='button-open-menu'
          />
        </SheetTrigger>
        <SheetContent
          side='top'
          className='text-foreground border-border bg-background/60 z-200 h-screen w-full border backdrop-blur-lg'
        >
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Click the navigation link below</SheetDescription>
          </SheetHeader>
          <div
            className='flex flex-col items-start gap-2 px-10'
            data-role='nav-links-mobile'
            aria-label='Main Navigation Links'
          >
            {navMenu.map((item) => (
              <SheetClose asChild key={item.title}>
                <MotionTextLink label={item.title} to={item.link} isExternal={false} />
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavLinksMobile;
