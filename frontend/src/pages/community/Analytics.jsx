import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";

const { FiTrendingUp, FiUsers, FiActivity, FiCalendar } = FiIcons;

const formatNumber = (num) => {
  if (num === null || num === undefined) return "...";
  if (num > 9999) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

// Helper to format nested _id object {year, month, day} to 'DD/MM'
const formatDayMonthFromId = (dateObj) => {
  if (!dateObj) return "No date";
  const day = String(dateObj.day).padStart(2, "0");
  const month = String(dateObj.month).padStart(2, "0");
  return `${day}/${month}`;
};

// Updated formatSeries for nested date _id
const formatSeries = (data) => {
  if (!data) return { labels: [], values: [] };
  return {
    labels: data.map((d) => formatDayMonthFromId(d._id)),
    values: data.map((d) => d.count),
  };
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [postsActivityData, setPostsActivityData] = useState(null);
  const [commentsActivityData, setCommentsActivityData] = useState(null);
  const [userRolesData, setUserRolesData] = useState(null);
  const [topActiveUsersData, setTopActiveUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const [userGrowthRes, postsActivityRes, commentsActivityRes, userRolesRes] =
          await Promise.all([
            fetch(`http://localhost:5000/api/analytics/user-growth?timeRange=${timeRange}`),
            fetch(`http://localhost:5000/api/analytics/posts-activity?timeRange=${timeRange}`),
            fetch(`http://localhost:5000/api/analytics/comments-activity?timeRange=${timeRange}`),
            fetch(`http://localhost:5000/api/analytics/user-roles?timeRange=${timeRange}`),
          ]);

        if (
          !userGrowthRes.ok ||
          !postsActivityRes.ok ||
          !commentsActivityRes.ok ||
          !userRolesRes.ok
        ) {
          throw new Error("One or more API requests failed");
        }
        const [userGrowthJson, postsActivityJson, commentsActivityJson, userRolesJson] =
          await Promise.all([
            userGrowthRes.json(),
            postsActivityRes.json(),
            commentsActivityRes.json(),
            userRolesRes.json(),
          ]);

        setUserGrowthData(userGrowthJson);
        setPostsActivityData(postsActivityJson);
        setCommentsActivityData(commentsActivityJson);
        setUserRolesData(userRolesJson);

        const postsByUser = {};
        postsActivityJson?.forEach(({ userId, name, avatar, count }) => {
          postsByUser[userId] = { userId, name, avatar, posts: count, comments: 0, total: count };
        });
        commentsActivityJson?.forEach(({ userId, name, avatar, count }) => {
          if (postsByUser[userId]) {
            postsByUser[userId].comments = count;
            postsByUser[userId].total += count;
          } else {
            postsByUser[userId] = { userId, name, avatar, posts: 0, comments: count, total: count };
          }
        });
        const combinedUsers = Object.values(postsByUser).sort((a, b) => b.total - a.total);
        setTopActiveUsersData(combinedUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [timeRange]);

  const { labels: userGrowthLabels, values: userGrowthValues } = formatSeries(userGrowthData);
  const { labels: postsLabels, values: postsValues } = formatSeries(postsActivityData);
  const { labels: commentsLabels, values: commentsValues } = formatSeries(commentsActivityData);

  const metrics = [
    {
      name: "Total Users",
      value: userRolesData ? userRolesData.reduce((acc, r) => acc + r.count, 0) : null,
      icon: FiUsers,
      color: "blue",
    },
    {
      name: "Posts Created",
      value: postsActivityData ? postsActivityData.reduce((a, d) => a + d.count, 0) : null,
      icon: FiTrendingUp,
      color: "orange",
    },
    {
      name: "Comments Added",
      value: commentsActivityData ? commentsActivityData.reduce((a, d) => a + d.count, 0) : null,
      icon: FiActivity,
      color: "green",
    },
  ];

  const userGrowthOptions = {
    title: { text: "Daily New Users", left: "center", textStyle: { color: "#d1d5db" }, top: 10 },
    xAxis: {
      type: "category",
      data: userGrowthLabels,
      axisLabel: { color: "#d1d5db" },
      axisLine: { lineStyle: { color: "#6b7280" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#d1d5db" },
      axisLine: { lineStyle: { color: "#6b7280" } },
    },
    tooltip: { trigger: "axis" },
    series: [{ type: "line", smooth: true, data: userGrowthValues, color: "#3b82f6" }],
  };

  const activityOptions = {
    title: { text: "Daily Posts vs Comments", left: "center", textStyle: { color: "#d1d5db" }, top: 10 },
    tooltip: { trigger: "axis" },
    legend: { top: "10%", data: ["Posts", "Comments"], textStyle: { color: "#9ca3af" } },
    xAxis: {
      type: "category",
      data: postsLabels.length ? postsLabels : commentsLabels,
      axisLabel: { color: "#9ca3af" },
      axisLine: { lineStyle: { color: "#6b7280" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#9ca3af" },
      axisLine: { lineStyle: { color: "#6b7280" } },
      splitLine: { lineStyle: { color: "#374151" } },
    },
    series: [
      { name: "Posts", type: "bar", data: postsValues, itemStyle: { color: "#f97316" }, barWidth: "40%" },
      { name: "Comments", type: "bar", data: commentsValues, itemStyle: { color: "#3b82f6" }, barWidth: "40%" },
    ],
  };

  const rolesOptions = {
    title: { text: "Users by Role", left: "center", textStyle: { color: "#d1d5db" }, top: 10 },
    tooltip: {
      trigger: "item",
      formatter: (params) => `${params.data.name}: ${params.value}`,
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        label: {
          color: "#e5e7eb",
          formatter: "{b} ({d}%)",
        },
        data: userRolesData
          ? userRolesData.map((r) => ({ name: r._id, value: r.count }))
          : [],
      },
    ],
  };

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-0">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <label htmlFor="timeRange" className="sr-only">Select time range</label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-gray-600 dark:text-gray-400">Loading data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Metrics */}
      <section aria-label="Summary metrics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{m.name}</p>
              <p className="text-3xl font-semibold">{formatNumber(m.value)}</p>
            </div>
            <SafeIcon icon={m.icon} className={`w-10 h-10 text-${m.color}-500`} aria-hidden="true" />
          </motion.div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <article aria-label="User Growth Chart" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <ReactECharts option={userGrowthOptions} style={{ height: 360 }} />
        </article>
        <article aria-label="User Engagement Chart" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <ReactECharts option={rolesOptions} style={{ height: 360 }} />
        </article>
      </section>

      {/* Activity + Top Active Users */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article
          aria-label="Daily Posts and Comments Activity"
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow"
        >
          <ReactECharts option={activityOptions} style={{ height: 360 }} />
        </article>
        <aside
          aria-label="Top Active Users List"
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow overflow-y-auto max-h-[520px]"
        >
          <h2 className="text-xl font-semibold mb-6">Top Active Users</h2>
          {topActiveUsersData.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400 text-center">No data available</p>
          )}
          {topActiveUsersData.map((u, idx) => (
            <div
              key={u.userId || idx}
              className="flex justify-between items-center mb-4 last:mb-0"
              tabIndex={0}
              aria-label={`User ${u.name} with ${u.posts} posts and ${u.comments} comments, total activity ${u.total}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm w-5">{idx + 1}</span>
                <img
                  src={u.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={`${u.name} avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                📝 {u.posts} | 💬 {u.comments} | Total: {u.total}
              </div>
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
};

export default Analytics;
