import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

const { FiAward, FiTrophy, FiStar, FiTarget } = FiIcons;
const apiBaseUrl = 'http://localhost:5000';

const Gamification = () => {
  const { user } = useAuthStore();

  const [actions, setActions] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    profileUpdates: 0,
    resumeUpdates: 0,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch gamification stats (still keeping for breakdown UI)
  useEffect(() => {
    if (!user?._id) return;

    fetch(`${apiBaseUrl}/api/users/${user._id}/gamification`)
      .then((res) => res.json())
      .then((data) => {
        setActions({
          posts: data.postsCount || 0,
          comments: data.commentsCount || 0,
          likes: data.likesCount || 0,
          profileUpdates: data.profileUpdatesCount || 0,
          resumeUpdates: data.resumeUpdatesCount || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch gamification data:', err);
        setLoading(false);
      });
  }, [user?._id]);

  // ✅ Fetch leaderboard (top 5 participants)
  useEffect(() => {
    if (!user?._id) return;

    fetch(`${apiBaseUrl}/api/users/leadersboard/${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        const top5 = (data.leaderboard || []).slice(0, 5);
        setLeaderboard(top5);
      })
      .catch((err) => {
        console.error('Failed to fetch leaderboard:', err);
      });
  }, [user?._id]);

  if (loading) return <div>Loading gamification...</div>;

  // ✅ Get totalPoints and referrals directly from authStore
  const totalPoints = user?.totalPointsCount || 0;
  const referralCount = user?.referralsCount || 0;

  const badges = [
    { name: 'First Referral', description: 'Made your first job referral', icon: FiStar, earned: referralCount > 0, rarity: 'common' },
    { name: 'Top Contributor', description: 'Top 10% community contributor', icon: FiTrophy, earned: totalPoints > 500, rarity: 'rare' },
    { name: 'Mentor', description: 'Completed 10+ mentorship sessions', icon: FiTarget, earned: false, rarity: 'epic' },
    { name: 'Networking Pro', description: 'Connected 50+ professionals', icon: FiAward, earned: false, rarity: 'legendary' },
  ];

  const getBadgeColor = (rarity, earned) => {
    if (!earned) return 'bg-gray-100 dark:bg-gray-700 text-gray-400';
    switch (rarity) {
      case 'common': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300';
      case 'rare': return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300';
      case 'epic': return 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-black min-h-screen px-4 py-6 transition-colors">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Total Points', value: totalPoints, icon: FiStar, color: 'blue' },
          { name: 'Current Rank', value: leaderboard.find(u => u.id === user._id)?.rank || '-', icon: FiTrophy, color: 'yellow' },
          { name: 'Badges Earned', value: badges.filter(b => b.earned).length, icon: FiAward, color: 'purple' },
          { name: 'Referrals Made', value: referralCount, icon: FiTarget, color: 'green' },
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-black dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-s rounded-e bg-${stat.color}-50 dark:bg-${stat.color}-900`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-300`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row with 3 columns: Leaderboard, Badges, Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {leaderboard.map((lbUser) => (
              <div
                key={lbUser.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${lbUser.id === user._id
                  ? 'bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-600'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${lbUser.rank === 1
                    ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300'
                    : lbUser.rank === 2
                      ? 'bg-gray-100 dark:bg-gray-600 text-zinc-900 dark:text-gray-200'
                      : lbUser.rank === 3
                        ? 'bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-300'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                >
                  {lbUser.rank}
                </div>
                <img src={lbUser.avatar} alt={lbUser.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${lbUser.id === user._id ? 'text-primary-900 dark:text-primary-300' : 'text-black dark:text-gray-100'
                      }`}
                  >
                    {lbUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lbUser.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl text-center ${getBadgeColor(badge.rarity, badge.earned)}`}
              >
                <SafeIcon icon={badge.icon} className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{badge.name}</p>
                <p className="text-xs">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Active Goals</h3>
          <div className="space-y-4">
            {[
              { name: 'Make 5 Referrals', progress: 60 },
              { name: 'Comment on 10 Posts', progress: 40 },
              { name: 'Complete Profile', progress: 100 },
            ].map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{goal.name}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Gamification;
