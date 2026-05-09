import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Mail,
  Send,
  Eye,
  MousePointer,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isDark } = useTheme();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/metrics`)
      .then((res) => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading metrics...
      </div>
    );

  if (!metrics || !metrics.rates)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No records found yet!
      </div>
    );

  const stats = [
    {
      label: "Sent",
      value: metrics.sent,
      icon: <Send size={20} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Delivered",
      value: metrics.delivered,
      icon: <Mail size={20} />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Opened",
      value: metrics.opened,
      icon: <Eye size={20} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Clicked",
      value: metrics.clicked,
      icon: <MousePointer size={20} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Bounced",
      value: metrics.bounced,
      icon: <AlertCircle size={20} />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Total",
      value: metrics.total,
      icon: <TrendingUp size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const chartData = [
    { name: "Sent", value: metrics.sent },
    { name: "Delivered", value: metrics.delivered },
    { name: "Opened", value: metrics.opened },
    { name: "Clicked", value: metrics.clicked },
    { name: "Bounced", value: metrics.bounced },
  ];

  const rates = [
    { label: "Delivery Rate", value: metrics.rates.deliveryRate },
    { label: "Open Rate", value: metrics.rates.openRate },
    { label: "Click Rate", value: metrics.rates.clickRate },
    { label: "Reply Rate", value: metrics.rates.replyRate },
    { label: "Bounce Rate", value: metrics.rates.bounceRate },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Dashboard
        </h2>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Track your email outreach performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            } rounded-2xl p-5 shadow-sm border`}
          >
            <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</span>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-6 shadow-sm border mb-8`}>
        <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
  Email Performance
</h3>
        <ResponsiveContainer width="100%" height={180} bg->
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
              axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: isDark ? "#9ca3af" : "#6b7280" }}
              axisLine={{ stroke: isDark ? "#374151" : "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: "none",
                borderRadius: "8px",
                color: isDark ? "#f9fafb" : "#111827",
              }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rates */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } rounded-2xl p-6 shadow-sm border`}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {rates.map((rate) => (
            <div
              key={rate.label}
              className="text-center p-4 bg-gray-50 rounded-xl"
            >
              <p className="text-xs text-gray-500 mb-1">{rate.label}</p>
              <p className="text-xl font-bold text-indigo-600">{rate.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
