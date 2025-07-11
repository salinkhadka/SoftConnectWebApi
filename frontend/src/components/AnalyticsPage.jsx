"use client"
import { useGetUsersAdmin } from "../hooks/Admin/adminUserhook"
import { useAllPosts } from "../hooks/Admin/getAllPosts"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { FiUsers, FiFileText, FiTrendingUp, FiCalendar, FiActivity, FiTarget } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-gray-200 font-medium">{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, growth, color = PURPLE }) => (
  <div className="bg-white dark:bg-[#1e1b29] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
        <Icon size={24} style={{ color }} />
      </div>
      {growth !== undefined && (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            growth >= 0
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {growth >= 0 ? "+" : ""}
          {growth}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
    </div>
  </div>
)

export default function AnalyticsPage() {
  const { data: users = [], isLoading: loadingUsers } = useGetUsersAdmin({ search: "" })
  const { data: postsResponse = {}, isLoading: loadingPosts } = useAllPosts()
  const posts = Array.isArray(postsResponse.data) ? postsResponse.data : []

  // Calculate metrics
  const totalUsers = users.length
  const totalPosts = posts.length
  const postsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(1) : 0

  // Calculate platform age
  const firstUser = users.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0]
  const platformAge = firstUser ? Math.floor((new Date() - new Date(firstUser.createdAt)) / (1000 * 60 * 60 * 24)) : 0

  // Group counts by date (last 30 days)
  const groupByDate = (items) => {
    if (!Array.isArray(items)) return {}
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return items
      .filter((item) => new Date(item.createdAt) >= thirtyDaysAgo)
      .reduce((acc, item) => {
        const date = new Date(item.createdAt).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})
  }

  const userCountsByDate = groupByDate(users)
  const postCountsByDate = groupByDate(posts)

  // Calculate growth rates
  const calculateGrowth = (counts) => {
    const dates = Object.keys(counts).sort()
    if (dates.length < 15) return 0

    const midPoint = Math.floor(dates.length / 2)
    const firstHalf = dates.slice(0, midPoint).reduce((sum, date) => sum + counts[date], 0)
    const secondHalf = dates.slice(midPoint).reduce((sum, date) => sum + counts[date], 0)

    return firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0
  }

  const userGrowth = calculateGrowth(userCountsByDate)
  const postGrowth = calculateGrowth(postCountsByDate)

  // Prepare chart data
  const allDates = Array.from(new Set([...Object.keys(userCountsByDate), ...Object.keys(postCountsByDate)])).sort()

  const chartData = allDates.map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    users: userCountsByDate[date] || 0,
    posts: postCountsByDate[date] || 0,
  }))

  // User role distribution
  const roleDistribution = users.reduce((acc, user) => {
    const role = user.role || "user"
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(roleDistribution).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
    color: role === "admin" ? PURPLE : role === "moderator" ? LAVENDER : "#8B5CF6",
  }))

  if (loadingUsers || loadingPosts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${PURPLE} transparent ${PURPLE} ${PURPLE}` }}
          ></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121018] transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div
            className="rounded-2xl p-8 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${PURPLE} 0%, #2d1b4e 100%)`,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <FiActivity size={32} />
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              </div>
              <p className="text-white/80 text-lg">Comprehensive insights into your platform's performance</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <div className="w-full h-full rounded-full" style={{ backgroundColor: LAVENDER }}></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={totalUsers.toLocaleString()}
            icon={FiUsers}
            growth={userGrowth}
            color={PURPLE}
          />
          <StatCard
            title="Total Posts"
            value={totalPosts.toLocaleString()}
            icon={FiFileText}
            growth={postGrowth}
            color={LAVENDER}
          />
          <StatCard title="Posts per User" value={postsPerUser} icon={FiTrendingUp} color="#8B5CF6" />
          <StatCard title="Platform Age" value={`${platformAge} days`} icon={FiCalendar} color="#A855F7" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Activity Timeline */}
          <div className="bg-white dark:bg-[#1e1b29] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiTrendingUp style={{ color: PURPLE }} />
              Activity Timeline (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={LAVENDER} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={LAVENDER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={PURPLE}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke={LAVENDER}
                  fillOpacity={1}
                  fill="url(#colorPosts)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="bg-white dark:bg-[#1e1b29] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FiTarget style={{ color: PURPLE }} />
              User Role Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="bg-white dark:bg-[#1e1b29] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FiActivity style={{ color: PURPLE }} />
            Detailed Growth Comparison
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke={PURPLE}
                strokeWidth={3}
                dot={{ fill: PURPLE, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: PURPLE, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke={LAVENDER}
                strokeWidth={3}
                dot={{ fill: LAVENDER, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: LAVENDER, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
