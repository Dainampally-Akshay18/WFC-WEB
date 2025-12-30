import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Video, MessageSquare, Bell, User } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Bible Reading', path: '/bible', icon: BookOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Sermons', path: '/sermons', icon: Video },
    { name: 'Prayer Request', path: '/prayers', icon: MessageSquare },
    { name: 'Notification', path: '/notifications', icon: Bell },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}
            `}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;