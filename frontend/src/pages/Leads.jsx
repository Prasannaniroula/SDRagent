import { useState, useEffect, use } from "react";
import axios from "axios";
import { useTheme } from '../Context/ThemeContext'

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme()
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/leads`)
      .then((res) => {
        setLeads(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  });

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">Loading leads...</div>
    );
  if (leads.length === 0)
    return (
      <div className="text-center mt-20 text-gray-500">No leads found yet!</div>
    );
  return (
    <div>
     <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>👥 Leads</h2>

      <div className="flex flex-col gap-4">
        {leads.map((lead) => (
          <div key={lead._id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow p-6 border`}>
            {/* Lead Info */}
            <div className="flex justify-between items-start mb-4">
              <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{lead.name}</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lead.email}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lead.role}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  lead.status.opened
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {lead.status.opened ? "Opened" : "Not Opened"}
              </span>
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 gap-2">
            <StatusBadge label="Sent" value={lead.status.sent} isDark={isDark} />
            <StatusBadge label="Delivered" value={lead.status.delivered} isDark={isDark} />
            <StatusBadge label="Clicked" value={lead.status.clicked} isDark={isDark} />
            <StatusBadge label="Bounced" value={lead.status.bounced} isDark={isDark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ label, value, isDark }) {
  return (
      <div className={`text-center p-2 rounded-lg text-xs font-medium ${value ? 'bg-green-100 text-green-600' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          {label}: {value ? '✅' : '❌'}
      </div>
  )
}