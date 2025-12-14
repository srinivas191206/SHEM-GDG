import React, { useState } from 'react';
// @ts-ignore
import { HashLink as Link } from 'react-router-hash-link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import ShemLogo from './ShemLogo';
import useScrollEffect from '../hooks/useScrollEffect';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollEffect(50);
  const { user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/#hero' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Advantages', href: '/#advantages' },
    { name: 'Analytics', href: '/#features-graphs' },
    { name: 'Team', href: '/#team' },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <ShemLogo scrolled={scrolled} />
          </Link>
        </div>

        {/* Center Section: Navigation (Desktop) */}
        <div className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-base font-medium transition-colors duration-300 hover:text-primary ${scrolled ? 'text-gray-800' : 'text-gray-800' // Always dark text if background is light blue, or...
                // Wait, hero background is light blue.
                // If header is transparent, text should be dark?
                // The design image shows dark text on light background.
                }`}
              smooth
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section: Contact Button (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="text-gray-800 font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-800 font-medium hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-sm"
              >
                Register
              </Link>
            </>
          )}
          <Link
            to="/support"
            className="group flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            smooth
          >
            Contact us
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 hover:text-primary focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                  smooth
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to="/support"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full bg-gradient-to-r from-primary to-primary-dark text-white font-medium hover:shadow-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Contact us
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header >
  );
};

export default Header;