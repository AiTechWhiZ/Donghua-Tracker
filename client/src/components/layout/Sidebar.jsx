// import { NavLink } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import Button from "../common/Button";
// import { useState, useEffect, useRef } from "react";

// const Sidebar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({
//     opacity: 0,
//   });
//   const [isInitialized, setIsInitialized] = useState(false);
//   const navRefs = useRef({});

//   // Update active indicator position when location changes
//   useEffect(() => {
//     if (!user) return;

//     const activePath = [
//       { path: "/", label: "Dashboard" },
//       { path: "/donghua", label: "My Donghua" },
//       { path: "/stats", label: "Statistics" },
//       { path: "/settings", label: "Settings" },
//     ].find((item) => {
//       if (item.path === "/" && window.location.pathname === "/") return true;
//       if (item.path !== "/" && window.location.pathname.startsWith(item.path))
//         return true;
//       return false;
//     });

//     if (activePath && navRefs.current[activePath.path]) {
//       const activeElement = navRefs.current[activePath.path];
//       const navContainer = activeElement.closest("nav");

//       if (navContainer) {
//         const containerRect = navContainer.getBoundingClientRect();
//         const elementRect = activeElement.getBoundingClientRect();

//         setActiveIndicatorStyle({
//           top: `${elementRect.top - containerRect.top}px`,
//           height: `${elementRect.height}px`,
//           opacity: 1,
//           transform: "translateY(0)",
//         });

//         // Mark as initialized after first render
//         if (!isInitialized) {
//           setTimeout(() => setIsInitialized(true), 100);
//         }
//       }
//     }
//   }, [window.location.pathname, isInitialized, user]);

//   if (!user) return null;

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const navigationItems = [
//     { path: "/", label: "Dashboard" },
//     { path: "/donghua", label: "My Donghua" },
//     { path: "/stats", label: "Statistics" },
//     { path: "/settings", label: "Settings" },
//   ];

//   return (
//     <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm hidden md:block flex flex-col h-screen">
//       <div className="p-4 flex-1">
//         <nav className="space-y-1 relative">
//           {/* Sliding Active Indicator */}
//           <div
//             className={`absolute left-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out gradient-animate ${
//               isInitialized ? "slide-indicator-vertical" : ""
//             }`}
//             style={activeIndicatorStyle}
//           />

//           {navigationItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               ref={(el) => {
//                 if (el) navRefs.current[item.path] = el;
//               }}
//               className={({ isActive }) =>
//                 `relative flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 nav-item-hover ${
//                   isActive
//                     ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
//                     : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
//                 }`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>
//       </div>

//       {/* Logout button at bottom */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           onClick={handleLogout}
//           variant="outline"
//           className="w-full justify-center"
//         >
//           Logout
//         </Button>
//       {/* </div> */}
//     </aside>
//   );
// };

// export default Sidebar;
