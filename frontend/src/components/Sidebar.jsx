import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mail, Users, Menu, X, Sun, Moon, Sliders } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = [
    { to: "/", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { to: "/composer", icon: <Mail size={18} />, label: "Composer" },
    { to: "/leads", icon: <Users size={18} />, label: "Leads" },
    { to: "/prompts", icon: <Sliders size={18} />, label: "Prompt Settings" },
  ];

  const NavLinks = () => (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-50"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3 flex items-center justify-between`}>
        <h1 className="text-lg font-bold text-indigo-600">SDR Agent</h1>
        <button onClick={() => setIsOpen(!isOpen)} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h1 className="text-xl font-bold text-indigo-600">SDR Agent</h1>
          <button onClick={() => setIsOpen(false)} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-2 flex-1">
          <NavLinks />
        </nav>
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col gap-3`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition w-full ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Hamro Aadhiyan © 2025
          </p>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex w-64 h-screen ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex-col`}>
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className="text-xl font-bold text-indigo-600">SDR Agent</h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            AI Powered Email Outreach
          </p>
        </div>
        <nav className="flex flex-col p-4 gap-2 flex-1">
          <NavLinks />
        </nav>
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col gap-3`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition w-full ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Hamro Aadhiyan © 2026
          </p>
        </div>
      </aside>
    </>
  );
}