import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

// Extract feather icons
const { FiMail, FiUsers, FiFilter, FiSend, FiEye, FiEdit3 } = FiIcons;

const EmailBroadcast = () => {
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    recipients: 'all',
    filters: []
  });
  const [previewMode, setPreviewMode] = useState(false);

  // Recipient Groups
  const recipientOptions = [
    { id: 'all', name: 'All Members', count: 12847 },
    { id: 'job-seekers', name: 'Job Seekers', count: 8234 },
    { id: 'referrers', name: 'Referrers', count: 3421 },
    { id: 'mentors', name: 'Mentors', count: 1192 },
    { id: 'premium', name: 'Premium Members', count: 2156 },
  ];

  // Segmentation filters
  const filterOptions = [
    { id: 'active-7d', name: 'Active in last 7 days' },
    { id: 'new-members', name: 'New members (last 30 days)' },
    { id: 'high-engagement', name: 'High engagement users' },
    { id: 'location-sf', name: 'Located in San Francisco' },
    { id: 'tech-industry', name: 'Tech industry professionals' },
  ];

  // Past broadcast statistics
  const recentCampaigns = [
    {
      id: 1,
      subject: 'Weekly Job Digest - 50+ New Opportunities',
      sent: '2 hours ago',
      recipients: 8234,
      openRate: '68%',
      clickRate: '12%'
    },
    {
      id: 2,
      subject: 'New Mentorship Program Launch',
      sent: '1 day ago',
      recipients: 12847,
      openRate: '72%',
      clickRate: '18%'
    },
    {
      id: 3,
      subject: 'Success Story: From Referral to Dream Job',
      sent: '3 days ago',
      recipients: 5621,
      openRate: '85%',
      clickRate: '25%'
    }
  ];

  // Send campaign handler
  const handleSend = () => {
    if (!emailData.subject || !emailData.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Email campaign sent successfully!');
    setEmailData({ subject: '', content: '', recipients: 'all', filters: [] });
  };

  // Toggle a filter chip
  const toggleFilter = (filterId) => {
    setEmailData(prev => ({
      ...prev,
      filters: prev.filters.includes(filterId)
        ? prev.filters.filter(f => f !== filterId)
        : [...prev.filters, filterId]
    }));
  };

  const selectedRecipientOption = recipientOptions.find(opt => opt.id === emailData.recipients);

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-black min-h-screen px-4 py-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Email Broadcast</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Send targeted emails to your community
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-zinc-900 text-zinc-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
          >
            <SafeIcon icon={FiEye} className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <SafeIcon icon={FiSend} className="w-4 h-4" />
            <span>Send Campaign</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800"
          >
            {/* Editor Header */}
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiEdit3} className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-black dark:text-white">Compose Email</h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-gray-300 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-zinc-800 dark:text-gray-300 mb-2">
                  Email Content
                </label>
                <textarea
                  value={emailData.content}
                  onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                  rows={12}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
                  placeholder="Write your email content here..."
                />
              </div>

              {/* Templates */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
                <h4 className="text-sm font-medium text-zinc-800 dark:text-gray-300 mb-3">
                  Quick Templates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Weekly Newsletter', 'Job Alert', 'Welcome Email'].map((template) => (
                    <button
                      key={template}
                      className="p-2 text-sm bg-gray-100 dark:bg-zinc-800 text-zinc-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                      onClick={() => setEmailData({ ...emailData, subject: template, content: `Template for ${template}` })}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Pane */}
          {previewMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Email Preview</h3>
              <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 bg-gray-50 dark:bg-black">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subject:</p>
                  <p className="font-medium text-black dark:text-white">{emailData.subject || 'No subject'}</p>
                </div>
                <div className="prose max-w-none text-zinc-900 dark:text-gray-200">
                  <div className="whitespace-pre-wrap">
                    {emailData.content || 'No content'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-black dark:text-white">Recipients</h3>
            </div>
            <div className="space-y-3">
              {recipientOptions.map(option => (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="recipients"
                    value={option.id}
                    checked={emailData.recipients === option.id}
                    onChange={(e) => setEmailData({ ...emailData, recipients: e.target.value })}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black dark:text-gray-100">{option.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.count.toLocaleString()} members</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 p-3 bg-primary-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                <span className="font-medium">
                  {selectedRecipientOption?.count.toLocaleString()}
                </span> recipients selected
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiFilter} className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-black dark:text-white">Additional Filters</h3>
            </div>
            <div className="space-y-3">
              {filterOptions.map(filter => (
                <label key={filter.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailData.filters.includes(filter.id)}
                    onChange={() => toggleFilter(filter.id)}
                    className="text-primary-600 focus:ring-primary-500 rounded"
                  />
                  <span className="text-sm text-zinc-800 dark:text-gray-300">{filter.name}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Campaign history */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800"
          >
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Recent Campaigns</h3>
            <div className="space-y-4">
              {recentCampaigns.map(camp => (
                <div key={camp.id} className="p-3 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                  <p className="text-sm font-medium text-black dark:text-white mb-1">{camp.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{camp.sent} • {camp.recipients.toLocaleString()} recipients</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600 dark:text-green-400">Open: {camp.openRate}</span>
                    <span className="text-blue-600 dark:text-blue-400">Click: {camp.clickRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmailBroadcast;
