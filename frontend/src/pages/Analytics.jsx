import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// Extract icons for easy usage
const { FiTrendingUp, FiUsers, FiActivity, FiDollarSign, FiCalendar } = FiIcons;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Metrics summary
  const metrics = [
    { name: 'Total Users', value: '12,847', change: '+12.5%', icon: FiUsers, color: 'blue' },
    { name: 'Active Sessions', value: '3,421', change: '+8.2%', icon: FiActivity, color: 'green' },
    { name: 'Revenue', value: '$45,230', change: '+23.1%', icon: FiDollarSign, color: 'purple' },
    { name: 'Conversion Rate', value: '4.2%', change: '+0.8%', icon: FiTrendingUp, color: 'orange' },
  ];

  // User growth chart data
  const userGrowthOptions = {
    title: { text: 'User Growth', left: 'center', textStyle: { color: '#d1d5db' } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['New Users', 'Returning Users'], top: '10%', textStyle: { color: '#9ca3af' } },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisLine: { lineStyle: { color: '#6b7280' } },
      axisLabel: { color: '#d1d5db' }
    },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#6b7280' } }, splitLine: { lineStyle: { color: '#374151' } }, axisLabel: { color: '#d1d5db' } },
    series: [
      {
        name: 'New Users',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
        color: '#3b82f6'
      },
      {
        name: 'Returning Users',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310],
        smooth: true,
        color: '#10b981'
      }
    ]
  };

  // Engagement chart (doughnut)
  const engagementOptions = {
    title: { text: 'User Engagement', left: 'center', textStyle: { color: '#d1d5db' } },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 1048, name: 'Job Seekers' },
        { value: 735, name: 'Referrers' },
        { value: 580, name: 'Mentors' },
        { value: 484, name: 'Premium Users' }
      ],
      label: { color: '#e5e7eb' },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.7)'
        }
      }
    }]
  };

  // Revenue chart
  const revenueOptions = {
    title: { text: 'Revenue Breakdown', left: 'center', textStyle: { color: '#d1d5db' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: '#6b7280' } },
      axisLabel: { color: '#d1d5db' }
    },
    yAxis: { type: 'value', axisLine: { lineStyle: { color: '#6b7280' } }, splitLine: { lineStyle: { color: '#374151' } }, axisLabel: { color: '#d1d5db' } },
    series: [{
      data: [8200, 9320, 9010, 9340, 12900, 13300],
      type: 'bar',
      color: '#8b5cf6'
    }]
  };

  // Referral leaderboard
  const topReferrers = [
    { name: 'Sarah Chen', referrals: 45, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face' },
    { name: 'Mike Rodriguez', referrals: 38, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { name: 'Emily Davis', referrals: 32, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    { name: 'David Kim', referrals: 28, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  ];

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your community&apos;s performance and growth</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{metric.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-50 dark:bg-${metric.color}-900`}>
                <SafeIcon icon={metric.icon} className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <ReactECharts option={userGrowthOptions} style={{ height: '350px' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <ReactECharts option={engagementOptions} style={{ height: '350px' }} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <ReactECharts option={revenueOptions} style={{ height: '300px' }} />
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Referrers</h3>
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <div key={referrer.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">#{index + 1}</span>
                  <img
                    src={referrer.avatar}
                    alt={referrer.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{referrer.name}</span>
                </div>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{referrer.referrals}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
