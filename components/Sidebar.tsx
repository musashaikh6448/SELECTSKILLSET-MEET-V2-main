'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sidebarLinks } from '@/constants';

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sidebarVariants = useMemo(
    () => ({
      collapsed: {
        width: '80px',
        transition: {
          type: 'spring' as const,
          damping: 25,
          stiffness: 120,
        },
      },
      expanded: {
        width: '280px',
        transition: {
          type: 'spring',
          damping: 25,
          stiffness: 120,
        },
      },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      collapsed: {
        opacity: 0,
        x: -10,
        transition: {
          duration: 0.15,
        },
      },
      expanded: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.2,
          delay: 0.05,
        },
      },
    }),
    [],
  );

  const iconVariants = useMemo(
    () => ({
      inactive: {
        scale: 1,
        transition: { duration: 0.2 },
      },
      active: {
        scale: 1.1,
        transition: { duration: 0.2 },
      },
      hover: {
        scale: 1.15,
        transition: { duration: 0.2 },
      },
    }),
    [],
  );

  const activeIndicatorVariants = useMemo(
    () => ({
      inactive: {
        width: 0,
        opacity: 0,
        transition: { duration: 0.2 },
      },
      active: {
        width: 4,
        opacity: 1,
        transition: { duration: 0.3 },
      },
    }),
    [],
  );

  // Memoized toggle function
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <motion.section
      className={cn(
        'hidden',
        isCollapsed ? 'w-[80px]' : 'w-[280px]',
      )}
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        className="absolute top-24 -right-3 z-10 flex size-6 items-center justify-center rounded-full bg-primary shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? (
          <ChevronRight className="size-4 text-white " />
        ) : (
          <ChevronLeft className="size-4 text-white" />
        )}
      </motion.button>

      {/* Navigation Items */}
      <div className="flex flex-1 flex-col gap-1">
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);
          const showLabel = !isCollapsed || isHovered;
          const IconComponent = item.icon;

          return (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="relative"
            >
              {/* Active indicator bar */}
              <motion.div
                className={cn(
                  'absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md',
                  isActive
                    ? 'bg-gradient-to-b from-primary to-secondary'
                    : 'bg-transparent',
                )}
                variants={activeIndicatorVariants}
                initial="inactive"
                animate={isActive ? 'active' : 'inactive'}
              />

              <Link
                href={item.route}
                className={cn(
                  'flex gap-3 items-center w-full p-3 rounded-lg justify-start transition-colors duration-300 group relative',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-primary/20 hover:text-gray-900',
                )}
              >
                <motion.div
                  variants={iconVariants}
                  animate={isActive ? 'active' : 'inactive'}
                  whileHover="hover"
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg transition-colors duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-primary to-secondary text-white'
                      : 'bg-primary/20 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-900',
                  )}
                >
                  <IconComponent className="size-5" />
                </motion.div>

                <AnimatePresence mode="wait">
                  {showLabel && (
                    <motion.span
                      className="text-base font-medium whitespace-nowrap overflow-hidden"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border border-primary/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default Sidebar;
