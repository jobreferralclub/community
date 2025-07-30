import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const { FiAward, FiTrophy, FiStar, FiTarget, FiTrendingUp, FiUsers } = FiIcons;

const Gamification = () => {
  const { user } = useAuthStore();

  const badges = [
    { name: 'First Referral', description: 'Made your first job referral', icon: FiStar, earned: true, rarity: 'common' },
    { name: 'Top Contributor', description: 'Top 10% community contributor', icon: FiTrophy, earned: true, rarity: 'rare' },
    { name: 'Mentor', description: 'Completed 10+ mentorship sessions', icon: FiUsers, earned: true, rarity: 'epic' },
    { name: 'Networking Pro', description: 'Connected 50+ professionals', icon: FiTarget, earned: false, rarity: 'rare' },
    { name: 'Success Story', description: 'Helped someone land their dream job', icon: FiAward, earned: false, rarity: 'legendary' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 3420, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face' },
    { rank: 2, name: 'You', points: 2450, avatar: user.avatar, isCurrentUser: true },
    { rank: 3, name: 'Mike Rodriguez', points: 2340, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { rank: 4, name: 'Emily Davis', points: 2180, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    { rank: 5, name: 'David Kim', points: 1950, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  ];

  const challenges = [
    {
      title: 'Weekly Referral Goal',
      description: 'Make 3 job referrals this week',
      progress: 2,
      total: 3,
      reward: 150,
      deadline: '3 days left'
    },
    {
      title: 'Community Helper',
      description: 'Answer 5 questions in the community',
      progress: 3,
      total: 5,
      reward: 100,
      deadline: '1 week left'
    },
    {
      title: 'Networking Master',
      description: 'Connect with 10 new professionals',
      progress: 7,
      total: 10,
      reward: 200,
      deadline: '5 days left'
    }
  ];

  const pointsHistory = [
    { action: 'Made a successful referral', points: 250, date: '2 hours ago' },
    { action: 'Answered community question', points: 50, date: '1 day ago' },
    { action: 'Completed mentorship session', points: 100, date: '2 days ago' },
    { action: 'Posted job opportunity', points: 75, date: '3 days ago' },
  ];

  const getBadgeColor = (rarity, earned) => {
    if (!earned) return 'bg-gray-100 text-gray-400';
    
    switch (rarity) {
      case 'common': return 'bg-blue-100 text-blue-600';
      case 'rare': return 'bg-purple-100 text-purple-600';
      case 'epic': return 'bg-orange-100 text-orange-600';
      case 'legendary': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gamification</h1>
        <p className="text-gray-600 mt-1">Track your progress and earn rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Total Points', value: user.points, icon: FiStar, color: 'blue' },
          { name: 'Current Rank', value: '#2', icon: FiTrophy, color: 'yellow' },
          { name: 'Badges Earned', value: badges.filter(b => b.earned).length, icon: FiAward, color: 'purple' },
          { name: 'Referrals Made', value: '12', icon: FiTarget, color: 'green' },
        ].map((stat, index) => (
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
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
          <div className="space-y-4">
            {badges.map((badge, index) => (
              <div key={badge.name} className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getBadgeColor(badge.rarity, badge.earned)}`}>
                  <SafeIcon icon={badge.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
                {badge.earned && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Earned
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                  user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {user.rank}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${user.isCurrentUser ? 'text-primary-900' : 'text-gray-900'}`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Challenges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Challenges</h3>
          <div className="space-y-4">
            {challenges.map((challenge, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                  <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full">
                    +{challenge.reward} pts
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{challenge.progress}/{challenge.total} completed</span>
                    <span>{challenge.deadline}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Points History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Points Activity</h3>
        <div className="space-y-3">
          {pointsHistory.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
              <span className="text-sm font-bold text-green-600">+{activity.points} pts</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Gamification;