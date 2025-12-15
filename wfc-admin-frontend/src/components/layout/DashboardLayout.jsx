import { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeSection = 'dashboard', onSectionChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSectionChange = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar onMenuClick={handleMenuClick} isSidebarOpen={isSidebarOpen} />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onClose={handleCloseSidebar}
      />

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeSection: PropTypes.string,
  onSectionChange: PropTypes.func,
};

export default DashboardLayout;
