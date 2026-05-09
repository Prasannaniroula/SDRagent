import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="text-center mt-20 text-gray-500">Loading metrics...</div>
    );
  if (!metrics || !metrics.rates)
    return (
      <div className="text-center mt-20 text-gray-500">
        No records found yet!
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Sent" value={metrics.sent} color="bg-blue-500" />
        <StatCard title="Delivered" value={metrics.delivered} color="bg-green-500"/>
        <StatCard title="Opened" value={metrics.opened} color="bg-yellow-500" />
        <StatCard title="Clicked" value={metrics.clicked} color="bg-purple-500"/>
        <StatCard title="Replied" value={metrics.replied} color="bg-indigo-500"/>
        <StatCard title="Bounced" value={metrics.bounced} color="bg-red-500" />
        <StatCard title="Spam" value={metrics.spam} color="bg-orange-500" />
        <StatCard title="Total" value={metrics.total} color="bg-gray-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Rates</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <RateCard title="Delivery Rate" value={metrics.rates.deliveryRate} />
                <RateCard title="Open Rate" value={metrics.rates.openRate} />
                <RateCard title="Click Rate" value={metrics.rates.clickRate} />
                <RateCard title="Reply Rate" value={metrics.rates.replyRate} />
                <RateCard title="Bounce Rate" value={metrics.rates.bounceRate} />
            </div>
        </div>
    </div>
  );
}

export default Dashboard;



function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-xl p-4 shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function RateCard({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  )
}
