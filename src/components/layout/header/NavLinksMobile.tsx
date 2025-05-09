import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import MotionIconButton from '@/components/motion_components/MotionIconButton';
import MotionTextLink from '@/components/motion_components/MotionTextLink';
import navMenu from '@/constants/navMenu';

const NavLinksMobile = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex items-center md:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MotionIconButton
            icon={<Menu className='h-6 w-6' />}
            ariaLabel='Open Menu'
            onClick={() => setOpen(true)}
          />
        </SheetTrigger>
        <SheetContent side='top' className='text-foreground h-screen w-full p-4'>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Click the navigation link below</SheetDescription>
          </SheetHeader>
          <div className='flex flex-col items-start gap-2 px-10'>
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
