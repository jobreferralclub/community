import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import ReactECharts from 'echarts-for-react';

const {
  FiUsers, FiTrendingUp, FiDollarSign, FiAward, FiActivity,
  FiMessageSquare, FiCalendar, FiTarget
} = FiIcons;

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Members', value: '12,847', change: '+12%', icon: FiUsers, color: 'blue' },
    { name: 'Active Referrals', value: '3,421', change: '+8%', icon: FiTrendingUp, color: 'green' },
    { name: 'Monthly Revenue', value: '$45,230', change: '+23%', icon: FiDollarSign, color: 'purple' },
    { name: 'Success Rate', value: '67%', change: '+5%', icon: FiTarget, color: 'orange' },
  ];

  const chartOptions = {
    title: { text: 'Community Growth', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330],
      type: 'line',
      smooth: true,
      areaStyle: {},
      color: '#3b82f6'
    }]
  };

  const recentActivity = [
    { user: 'Sarah Chen', action: 'Posted new job referral', time: '2 min ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face' },
    { user: 'Mike Rodriguez', action: 'Completed mentorship session', time: '15 min ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { user: 'Emily Davis', action: 'Earned "Top Contributor" badge', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-primary-100 text-lg">
              You have {user.points} points and {user.badges.length} badges
            </p>
          </div>
          <div className="hidden md:block">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full ring-4 ring-white/20"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <ReactECharts option={chartOptions} style={{ height: '300px' }} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={activity.avatar}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'New Post', icon: FiMessageSquare, color: 'blue' },
            { name: 'Schedule Meeting', icon: FiCalendar, color: 'green' },
            { name: 'Send Email', icon: FiActivity, color: 'purple' },
            { name: 'View Analytics', icon: FiTrendingUp, color: 'orange' },
          ].map((action) => (
            <button
              key={action.name}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SafeIcon icon={action.icon} className={`w-6 h-6 text-${action.color}-600 mb-2`} />
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;