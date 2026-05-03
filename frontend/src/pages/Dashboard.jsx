import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState({});
  const [selectedNgos, setSelectedNgos] = useState({});
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/donations");
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    axios.get("http://localhost:5000/volunteers").then((res) => setVolunteers(res.data));
    axios.get("http://localhost:5000/ngos").then((res) => setNgos(res.data));
  }, []);

  const total = data.length;
  const pending = data.filter((d) => d.status === "Pending").length;
  const picked = data.filter((d) => d.status === "Picked").length;
  const distributed = data.filter((d) => d.status === "Distributed").length;

  const filtered = filter === "All" ? data : data.filter((d) => d.status === filter);

  const handlePickup = async (d) => {
    const vol = selectedVolunteers[d.donation_id];
    if (!vol) return alert("Please select a volunteer first");
    try {
      await axios.post("http://localhost:5000/pickup", {
        donation_id: d.donation_id,
        volunteer_id: vol,
      });
      alert("✅ Pickup assigned! Status updated to Picked.");
      fetchData();
    } catch (e) {
      alert("Error: " + (e.response?.data?.sqlMessage || e.message));
    }
  };

  const handleDistribute = async (d) => {
    const ngo = selectedNgos[d.donation_id];
    if (!ngo) return alert("Please select an NGO first");
    try {
      await axios.post("http://localhost:5000/distribution", {
        donation_id: d.donation_id,
        ngo_id: ngo,
        people_served: 50,
      });
      alert("✅ Food distributed! Status updated to Distributed.");
      fetchData();
    } catch (e) {
      alert("Error: " + (e.response?.data?.sqlMessage || e.message));
    }
  };

  const statusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-800",
      Picked: "bg-blue-100 text-blue-800",
      Distributed: "bg-green-100 text-green-800",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Real-time donation tracking and management</p>
        </div>

        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Donations", value: total, icon: "📦", color: "bg-white", text: "text-gray-800", border: "border-l-4 border-gray-400" },
            { label: "Pending", value: pending, icon: "⏳", color: "bg-yellow-50", text: "text-yellow-700", border: "border-l-4 border-yellow-400" },
            { label: "Picked Up", value: picked, icon: "🚗", color: "bg-blue-50", text: "text-blue-700", border: "border-l-4 border-blue-400" },
            { label: "Distributed", value: distributed, icon: "✅", color: "bg-green-50", text: "text-green-700", border: "border-l-4 border-green-400" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} ${s.border} rounded-xl shadow p-5`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                  <p className={`text-4xl font-bold mt-1 ${s.text}`}>{s.value}</p>
                </div>
                <span className="text-3xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-700">All Donations</h2>
            <div className="flex gap-2">
              {["All", "Pending", "Picked", "Distributed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    {["ID", "Donor", "NGO", "Food Type", "Qty", "Status", "Expiry", "Assign Volunteer", "Assign NGO", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((d) => (
                    <tr key={d.donation_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-400">#{d.donation_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{d.donor}</td>
                      <td className="px-4 py-3 text-gray-600">{d.ngo || <span className="text-gray-400 italic">Unassigned</span>}</td>
                      <td className="px-4 py-3 text-gray-700">{d.food_type}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{d.quantity} kg</td>
                      <td className="px-4 py-3">{statusBadge(d.status)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(d.expiry_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white w-32"
                          onChange={(e) => setSelectedVolunteers({ ...selectedVolunteers, [d.donation_id]: e.target.value })}
                          disabled={d.status !== "Pending"}
                        >
                          <option value="">Select</option>
                          {volunteers.map((v) => (
                            <option key={v.volunteer_id} value={v.volunteer_id}>{v.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white w-32"
                          onChange={(e) => setSelectedNgos({ ...selectedNgos, [d.donation_id]: e.target.value })}
                          disabled={d.status !== "Picked"}
                        >
                          <option value="">Select</option>
                          {ngos.map((n) => (
                            <option key={n.ngo_id} value={n.ngo_id}>{n.ngo_name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePickup(d)}
                            disabled={d.status !== "Pending"}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            Pickup
                          </button>
                          <button
                            onClick={() => handleDistribute(d)}
                            disabled={d.status !== "Picked"}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            Distribute
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="p-10 text-center text-gray-400">No donations found for this filter.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
