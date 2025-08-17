import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

// Destructure icons
const { 
  FiDollarSign, 
  FiCreditCard, 
  FiUsers, 
  FiTrendingUp, 
  FiLink, 
  FiSettings 
} = FiIcons;

const Monetization = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Revenue snapshots
  const revenueStats = [
    { name: 'Monthly Revenue', value: '$45,230', change: '+23%', icon: FiDollarSign, color: 'green' },
    { name: 'Premium Subscribers', value: '2,156', change: '+18%', icon: FiUsers, color: 'blue' },
    { name: 'Affiliate Commissions', value: '$8,420', change: '+34%', icon: FiLink, color: 'purple' },
    { name: 'Conversion Rate', value: '4.2%', change: '+0.8%', icon: FiTrendingUp, color: 'orange' },
  ];

  // Pie chart for revenue
  const revenueChartOptions = {
    title: { 
      text: 'Revenue Breakdown', 
      left: 'center',
      textStyle: { color: '#e5e7eb' } 
    },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: 35000, name: 'Premium Subscriptions' },
        { value: 8420, name: 'Affiliate Commissions' },
        { value: 1810, name: 'One-time Payments' },
      ],
      label: { color: '#d1d5db' },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.7)'
        }
      }
    }]
  };

  // Subscription tiers
  const subscriptionPlans = [
    {
      name: 'Basic',
      price: '$9.99',
      interval: 'month',
      features: ['Community Access','Basic Job Alerts','Standard Support'],
      subscribers: 1245,
      color: 'blue'
    },
    {
      name: 'Premium',
      price: '$19.99',
      interval: 'month',
      features: ['Everything in Basic','Priority Referrals','Mentorship Access','1-on-1 Sessions'],
      subscribers: 856,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      interval: 'month',
      features: ['Everything in Premium','Custom Branding','API Access','Dedicated Support'],
      subscribers: 55,
      color: 'orange'
    }
  ];

  // Affiliate stats
  const affiliateProgram = {
    totalAffiliates: 342,
    activeAffiliates: 189,
    commissionsThisMonth: 8420,
    topAffiliates: [
      { name: 'Sarah Chen', commissions: 1250, referrals: 45 },
      { name: 'Mike Rodriguez', commissions: 980, referrals: 38 },
      { name: 'Emily Davis', commissions: 850, referrals: 32 },
    ]
  };

  // Navigation tabs
  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiDollarSign },
    { id: 'subscriptions', name: 'Subscriptions', icon: FiCreditCard },
    { id: 'affiliates', name: 'Affiliates', icon: FiLink },
    { id: 'settings', name: 'Settings', icon: FiSettings }
  ];

  // ---- Tab Renderers -----

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <ReactECharts option={revenueChartOptions} style={{ height: '300px' }} />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[
              { user: 'John Doe', amount: '$19.99', plan: 'Premium', date: '2 hours ago' },
              { user: 'Jane Smith', amount: '$9.99', plan: 'Basic', date: '5 hours ago' },
              { user: 'Bob Wilson', amount: '$49.99', plan: 'Enterprise', date: '1 day ago' },
              { user: 'Alice Brown', amount: '$19.99', plan: 'Premium', date: '1 day ago' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.user}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.plan} • {transaction.date}</p>
                </div>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{transaction.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {plan.price}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{plan.interval}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.subscribers} active subscribers</p>
            </div>

            {/* Features list */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-700 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-300 rounded-full"></div>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Edit button */}
            <button className={`w-full py-2 rounded-lg font-medium transition-colors bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`}>
              Edit Plan
            </button>
          </motion.div>
        ))}
      </div>

      {/* Subscription Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Recurring Revenue', value: '$35,000' },
            { label: 'Churn Rate', value: '2.3%' },
            { label: 'Average Revenue Per User', value: '$16.24' },
            { label: 'Customer Lifetime Value', value: '$486' },
          ].map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{metric.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAffiliates = () => (
    <div className="space-y-6">
      {/* Affiliate Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Affiliates', value: affiliateProgram.totalAffiliates },
          { label: 'Active This Month', value: affiliateProgram.activeAffiliates },
          { label: 'Commissions Paid', value: `$${affiliateProgram.commissionsThisMonth.toLocaleString()}` },
          { label: 'Average Commission', value: '$44.55' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center"
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Affiliates */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Affiliates</h3>
          <div className="space-y-4">
            {affiliateProgram.topAffiliates.map((affiliate, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{affiliate.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{affiliate.referrals} referrals</p>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400">${affiliate.commissions}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Program Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Program Settings</h3>
          <div className="space-y-4">
            {/* Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Commission Rate</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  defaultValue="25"
                  className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>
            </div>

            {/* Cookie duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cookie Duration</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500">
                <option>30 days</option>
                <option>60 days</option>
                <option>90 days</option>
              </select>
            </div>

            {/* Minimum payout */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Payout</label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">$</span>
                <input
                  type="number"
                  defaultValue="50"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition">
              Update Settings
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Settings</h3>
      <div className="space-y-6">
        {/* Stripe */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-3">Stripe Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Publishable Key</label>
              <input type="text" placeholder="pk_test_..." className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Secret Key</label>
              <input type="password" placeholder="sk_test_..." className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
            </div>
          </div>
        </div>

        {/* PayPal */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-3">PayPal Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client ID</label>
              <input type="text" placeholder="PayPal Client ID" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Secret</label>
              <input type="password" placeholder="PayPal Client Secret" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-3">Tax Settings</h4>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="text-primary-600 focus:ring-primary-500 rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable automatic tax calculation</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Tax Rate</label>
                <div className="flex items-center space-x-2">
                  <input type="number" step="0.01" defaultValue="8.25" className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
                  <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax ID</label>
                <input type="text" placeholder="Enter tax ID" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ----- Main Return ----
  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-6 transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monetization</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage payments, subscriptions, and revenue streams
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'affiliates' && renderAffiliates()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default Monetization;
