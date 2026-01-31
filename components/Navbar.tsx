'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Animation variants
  const navbarVariants = {
    top: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(0px)',
      boxShadow: 'none',
      transition: { duration: 0.3 },
    },
    scrolled: {
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: { duration: 0.3 },
    },
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const menuItemMobileVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.nav
        className="flex justify-between items-center fixed z-50 w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10 border-b border-gray-100 bg-white"
        variants={navbarVariants}
        initial="top"
        animate={isScrolled ? 'scrolled' : 'top'}
      >
        <motion.div variants={logoVariants} initial="initial" animate="animate">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              />
              <Image
                src="/images/logo2.png"
                width={200}
                height={48}
                alt="SELECTSKILLSET-MEET logo"
                className="relative z-10 group-hover:brightness-110 transition-all duration-300"
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div variants={menuItemVariants}>
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-md font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
          </motion.div>
          <motion.div variants={menuItemVariants}>
            <Link
              href="/personal-room"
              className={`px-4 py-2 rounded-md text-md font-medium transition-colors ${
                pathname?.startsWith('/personal-room')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Personal Room
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-0.5'}`}
          ></span>
          <span
            className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-1.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
          ></span>
          <span
            className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'}`}
          ></span>
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl md:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                <div className="flex flex-col space-y-6">
                  <motion.div variants={menuItemMobileVariants}>
                    <Link
                      href="/"
                      className={`block px-4 py-3 rounded-md text-lg font-medium transition-colors ${
                        pathname === '/'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemMobileVariants}>
                    <Link
                      href="/personal-room"
                      className={`block px-4 py-3 rounded-md text-lg font-medium transition-colors ${
                        pathname?.startsWith('/personal-room')
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Personal Room
                    </Link>
                  </motion.div>
                </div>

                <div className="mt-auto mb-8 text-center text-gray-500 text-sm">
                  © {new Date().getFullYear()} SelectSkillSet
                </div>
              </div>

              {/* Close button */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
