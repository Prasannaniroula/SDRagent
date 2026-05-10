import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";
import { Search, X, Mail, User, Target } from "lucide-react";
import  Sidebar from '../components/Sidebar'

export default function Leads() {
  const { isDark } = useTheme();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/leads`)
      .then((res) => {
        setLeads(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filtered = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading leads...
      </div>
    );

  if (leads.length === 0)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No leads found yet!
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            👥 Leads
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {leads.length} total leads
          </p>
        </div>

        {/* Search */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <Search
            size={16}
            className={isDark ? "text-gray-400" : "text-gray-400"}
          />
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`outline-none text-sm w-64 ${
              isDark
                ? "bg-gray-800 text-white placeholder-gray-500"
                : "bg-white text-gray-800 placeholder-gray-400"
            }`}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } rounded-2xl shadow-sm border overflow-hidden`}
      >
        <table className="w-full">
          <thead>
            <tr
              className={`${isDark ? "bg-gray-700" : "bg-gray-50"} text-left`}
            >
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Name
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } hidden md:table-cell`}
              >
                Role
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } hidden md:table-cell`}
              >
                Status
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Sent At
              </th>
              <th
                className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Preview
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((lead) => (
              <tr
                key={lead._id}
                className={`${
                  isDark
                    ? "divide-gray-700 hover:bg-gray-700"
                    : "hover:bg-gray-50"
                } transition cursor-pointer`}
                onClick={() => setSelected(lead)}
              >
                <td className="px-6 py-4">
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {lead.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {lead.email}
                  </p>
                </td>
                <td
                  className={`px-6 py-4 text-sm hidden md:table-cell ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {lead.role}
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex gap-2 flex-wrap">
                    <StatusBadge label="Sent" value={lead.status.sent} />
                    <StatusBadge label="Opened" value={lead.status.opened} />
                    <StatusBadge label="Clicked" value={lead.status.clicked} />
                  </div>
                </td>
                <td
                  className={`px-6 py-4 text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {lead.timestamps.sent
                    ? new Date(lead.timestamps.sent).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(lead);
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
                  >
                    View Email →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Panel */}
      {selected && (
    <div className={`fixed inset-0 z-50 flex ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        
        {/* Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
            <Sidebar/>
        </div>

        {/* Content */}
        <div className={`flex-1 ${isDark ? 'bg-gray-800' : 'bg-white'} overflow-y-auto`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    onClick={() => setSelected(null)}
                    className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} transition`}>
                    ← Back to Leads
                </button>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Email Details
                </h3>
            </div>

            {/* Lead Info */}
            <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">

                {/* Details */}
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 flex flex-col gap-3`}>
                    <div className="flex items-center gap-3">
                        <User size={16} className="text-indigo-500" />
                        <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Name</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{selected.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail size={16} className="text-indigo-500" />
                        <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{selected.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Target size={16} className="text-indigo-500" />
                        <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Goal</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{selected.goal}</p>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div>
                    <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Email Status
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                        <StatusCard label="Sent" value={selected.status.sent} time={selected.timestamps.sent} />
                        <StatusCard label="Delivered" value={selected.status.delivered} time={selected.timestamps.delivered} />
                        <StatusCard label="Opened" value={selected.status.opened} time={selected.timestamps.opened} />
                        <StatusCard label="Clicked" value={selected.status.clicked} time={selected.timestamps.clicked} />
                        <StatusCard label="Bounced" value={selected.status.bounced} time={selected.timestamps.bounced} />
                        <StatusCard label="Spam" value={selected.status.spam} time={selected.timestamps.spam} />
                    </div>
                </div>

                {/* Email Preview */}
                <div>
                    <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Email Preview
                    </h4>
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <iframe
                            srcDoc={selected.body}
                            className="w-full h-96 bg-white"
                            title="Email Preview"
                        />
                    </div>
                </div>

            </div>
        </div>
    </div>
)}
    </div>
  );
}

function StatusBadge({ label, value }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-lg font-medium ${
        value ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {value ? "✅" : "❌"} {label}
    </span>
  );
}

function StatusCard({ label, value, time }) {
  return (
    <div
      className={`p-3 rounded-xl text-center ${
        value
          ? "bg-green-50 border border-green-100"
          : "bg-gray-50 border border-gray-100"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          value ? "text-green-600" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p className="text-lg">{value ? "✅" : "❌"}</p>
      {time && (
        <p className="text-xs text-gray-400 mt-1">
          {new Date(time).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
