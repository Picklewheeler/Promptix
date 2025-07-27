
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { href: '/', label: 'Home', ariaLabel: 'Go to homepage' },
    { href: '/features', label: 'Features', ariaLabel: 'View our features' },
    { href: '/pricing', label: 'Pricing', ariaLabel: 'View pricing plans' },
    { href: '/about', label: 'About Us', ariaLabel: 'Learn about us' },
  ];

  const isActivePage = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <nav className="flex items-center justify-between h-16 lg:h-20" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            aria-label="Promptix - Go to homepage"
          >
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e4bfb5a3f9037dab7d49b7c2771e5de52593d8aa?placeholderIfAbsent=true"
                className="w-8 h-8 lg:w-10 lg:h-10 object-contain transition-transform group-hover:scale-105"
                alt="Promptix Logo"
              />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              Promptix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isActivePage(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                aria-label={item.ariaLabel}
                aria-current={isActivePage(item.href) ? 'page' : undefined}
              >
                {item.label}
                {isActivePage(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/employee/login">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Access employee portal"
              >
                Employee Portal
              </Button>
            </Link>
            <Button 
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              aria-label="Get started with Promptix"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100 visible'
              : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="py-4 space-y-2 border-t border-border bg-background/95 backdrop-blur-md">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isActivePage(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                role="menuitem"
                aria-label={item.ariaLabel}
                aria-current={isActivePage(item.href) ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 space-y-2 border-t border-border">
              <Link to="/employee/login" className="block">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Access employee portal"
                >
                  Employee Portal
                </Button>
              </Link>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Get started with Promptix"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
