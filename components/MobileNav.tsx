'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Calendar, History, Video, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Updated sidebar links with Lucide icons
  const sidebarLinks = [
    {
      icon: Home,
      route: '/',
      label: 'Home',
    },
    {
      icon: Calendar,
      route: '/upcoming',
      label: 'Upcoming',
    },
    {
      icon: History,
      route: '/previous',
      label: 'Previous',
    },
    {
      icon: Video,
      route: '/recordings',
      label: 'Recordings',
    },
    {
      icon: UserPlus,
      route: '/personal-room',
      label: 'Personal Room',
    },
  ];

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.button
          className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="text-gray-700" size={24} />
        </motion.button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-r border-gray-200 bg-white p-6 pt-16"
      >
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Image
            src="/images/logo2.png"
            width={200}
            height={200}
            alt="SELECTSKILLSET-MEET logo"
            className="relative z-10 transition-all duration-300"
          />
        </Link>

        <div className="flex flex-col gap-3">
          {sidebarLinks.map((item, index) => {
            const isActive =
              pathname === item.route || pathname.startsWith(`${item.route}/`);
            const IconComponent = item.icon;

            return (
              <motion.div
                key={item.label}
                variants={itemVariants}
                initial="closed"
                animate="open"
                transition={{ delay: index * 0.1 }}
                onClick={() => setOpen(false)}
              >
                <Link
                  href={item.route}
                  className={cn(
                    'flex gap-4 items-center p-4 rounded-xl justify-start transition-all duration-300 group',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center p-2.5 rounded-lg transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900',
                    )}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'text-base font-medium',
                      isActive ? 'text-primary font-semibold' : 'text-gray-700',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
