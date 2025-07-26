import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useDonghua } from "../../contexts/DonghuaContext";
import Button from "../common/Button";
import { useState, useEffect, useRef, useMemo } from "react";

const Header = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { donghuaList } = useDonghua();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({ opacity: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const navRefs = useRef({});

  // Calculate notification count for expired episodes
  const notificationCount = useMemo(() => {
    if (!donghuaList.length) return 0;
    
    const now = new Date();
    return donghuaList.filter(donghua => 
      donghua.status === "watching" && 
      donghua.nextEpisodeAirDate && 
      new Date(donghua.nextEpisodeAirDate) < now
    ).length;
  }, [donghuaList]);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Update active indicator position when location changes
  useEffect(() => {
    const activePath = [
      { path: "/", label: "Dashboard" },
      { path: "/donghua", label: "My Donghua" },
      { path: "/stats", label: "Statistics" },
      { path: "/settings", label: "Settings" },
    ].find(item => isActive(item.path));

    if (activePath && navRefs.current[activePath.path]) {
      const activeElement = navRefs.current[activePath.path];
      const navContainer = activeElement.closest('nav');
      
      if (navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        setActiveIndicatorStyle({
          left: `${elementRect.left - containerRect.left}px`,
          width: `${elementRect.width}px`,
          opacity: 1,
          transform: 'translateX(0)',
        });
        
        // Mark as initialized after first render
        if (!isInitialized) {
          setTimeout(() => setIsInitialized(true), 100);
        }
      }
    }
  }, [location.pathname, isInitialized]);

  const navigationItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      path: "/donghua",
      label: "My Donghua",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
    {
      path: "/stats",
      label: "Statistics",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="text-2xl font-bold tracking-tight">
                  Donghua Tracker
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1 relative">
              {/* Sliding Active Indicator */}
              <div
                className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out gradient-animate ${
                  isInitialized ? 'slide-indicator-horizontal' : ''
                }`}
                style={activeIndicatorStyle}
              />
              
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  ref={(el) => {
                    if (el) navRefs.current[item.path] = el;
                  }}
                  className={`relative flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 group nav-item-hover ${
                    isActive(item.path)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 mr-2 transition-all duration-300 ${
                      isActive(item.path)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={item.icon}
                    />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Badge */}
                {notificationCount > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => navigate("/donghua")}
                      className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
                      aria-label="Notifications"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <svg
                          className="w-5 h-5 text-red-600 dark:text-red-400 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-5 5v-5zM4.19 4a2 2 0 00-1.38 3.41l1.82 1.82a2 2 0 001.41.59H10a2 2 0 012 2v1.41a2 2 0 001.41.59l1.82-1.82A2 2 0 0018.19 4H4.19z"
                          />
                        </svg>
                      </div>
                      {/* Notification Badge */}
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </div>
                    </button>
                  </div>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
                  aria-label="Toggle theme"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {theme === "dark" ? (
                      <svg
                        className="w-5 h-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-12"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-12"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
                  aria-label="Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <svg
                      className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  size="small"
                  className="px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="small"
                  className="px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
