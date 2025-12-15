import { 
  LayoutDashboard, 
  Users, 
  Video, 
  BookOpen, 
  Calendar, 
  Heart, 
  Bell, 
  Settings, 
  ChevronRight
} from 'lucide-react';
import PropTypes from 'prop-types';

const Sidebar = ({ isOpen, activeSection, onSectionChange, onClose }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'sermons', label: 'Sermons', icon: Video },
    { id: 'blogs', label: "Pastor's Pen", icon: BookOpen },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'prayers', label: 'Prayer Requests', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
    onClose();
  };

  return (
    <>
      <aside className={`fixed top-16 left-0 bottom-0 w-64 z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}>
        <div className="h-full overflow-y-auto py-6">
          <nav className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden top-16" onClick={onClose} />
      )}
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
