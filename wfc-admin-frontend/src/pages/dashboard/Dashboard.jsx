import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import DashboardLayout from '@components/layout/DashboardLayout';
import { 
  Users, 
  Video, 
  Calendar, 
  Heart, 
  Clock,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const { admin } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  // Mock stats data - will be replaced with real API data later
  const stats = {
    totalUsers: 248,
    pendingApprovals: 12,
    revokedUsers: 5,
    activeSermons: 45,
    totalBlogs: 32,
    upcomingEvents: 8,
    prayerRequests: 23,
  };

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {admin?.display_name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your church today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-400/20 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalUsers}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Members
              </p>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-orange-500/10 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-400/20 px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.pendingApprovals}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Awaiting Approval
              </p>
            </div>

            {/* Active Sermons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/20 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.activeSermons}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Sermons
              </p>
            </div>

            {/* Prayer Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-red-500/10 transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/20 px-2 py-1 rounded-full">
                  New
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.prayerRequests}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prayer Requests
              </p>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 dark:border dark:border-blue-500/20 rounded-xl transition-colors text-left">
                  <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Approve New Members
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.pendingApprovals} pending approvals
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 dark:border dark:border-purple-500/20 rounded-xl transition-colors text-left">
                  <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Upload New Sermon
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Share God's word with the congregation
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 dark:border dark:border-green-500/20 rounded-xl transition-colors text-left">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Create Event
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.upcomingEvents} upcoming events
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      3 new member registrations
                    </p>
                    <p className="text-xs text-gray-500">
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New sermon uploaded
                    </p>
                    <p className="text-xs text-gray-500">
                      5 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      5 new prayer requests
                    </p>
                    <p className="text-xs text-gray-500">
                      1 day ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Youth fellowship event created
                    </p>
                    <p className="text-xs text-gray-500">
                      2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 dark:bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  🎉 Phase 3 Complete - Proper Architecture!
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Reusable layout components are ready for all future pages!
                </p>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>✅ DashboardLayout component (reusable wrapper)</li>
                  <li>✅ Navbar component (clean separation)</li>
                  <li>✅ Sidebar component (independent & reusable)</li>
                  <li>✅ All pages will now use DashboardLayout</li>
                  <li>✅ No code duplication across pages</li>
                  <li>✅ Easy to maintain and update</li>
                  <li>✅ Full dark mode support everywhere</li>
                  <li>✅ Theme toggle in navbar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
