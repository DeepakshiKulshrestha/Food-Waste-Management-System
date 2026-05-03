import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/donations").then((res) => {
      setDonations(res.data);
      setLoading(false);
    });
  }, []);

  const total = donations.length;
  const totalQty = donations.reduce((sum, d) => sum + d.quantity, 0);
  const pending = donations.filter((d) => d.status === "Pending").length;
  const picked = donations.filter((d) => d.status === "Picked").length;
  const distributed = donations.filter((d) => d.status === "Distributed").length;
  const distQty = donations.filter((d) => d.status === "Distributed").reduce((sum, d) => sum + d.quantity, 0);
  const efficiency = total > 0 ? ((distributed / total) * 100).toFixed(1) : 0;

  const foodGroups = donations.reduce((acc, d) => {
    acc[d.food_type] = (acc[d.food_type] || 0) + d.quantity;
    return acc;
  }, {});

  const donorGroups = donations.reduce((acc, d) => {
    acc[d.donor] = (acc[d.donor] || 0) + d.quantity;
    return acc;
  }, {});

  const topDonor = Object.entries(donorGroups).sort((a, b) => b[1] - a[1])[0];

  if (loading) return <div className="p-10 text-center text-gray-400">Loading reports...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-500">Insights and conclusions from the Food Waste Management System</p>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            { label: "Total Food Donated", value: `${totalQty} kg`, icon: "📦", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Food Distributed", value: `${distQty} kg`, icon: "✅", color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Distribution Efficiency", value: `${efficiency}%`, icon: "📊", color: "bg-purple-50 border-purple-200 text-purple-700" },
          ].map((s, i) => (
            <div key={i} className={`border rounded-2xl p-6 ${s.color}`}>
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm mt-1 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">📊 Donation Status Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: "Pending", count: pending, total, color: "bg-yellow-400" },
                { label: "Picked", count: picked, total, color: "bg-blue-400" },
                { label: "Distributed", count: distributed, total, color: "bg-green-400" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{s.label}</span>
                    <span className="text-gray-800 font-bold">{s.count} / {s.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${s.color} h-3 rounded-full transition-all`}
                      style={{ width: s.total > 0 ? `${(s.count / s.total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">🏆 Key Conclusions</h3>
            <div className="space-y-3">
              {[
                { icon: "🥇", text: `Top Donor: ${topDonor ? topDonor[0] : "N/A"} (${topDonor ? topDonor[1] : 0} kg)` },
                { icon: "📦", text: `Total donations: ${total} entries recorded` },
                { icon: "🍽️", text: `${distQty} kg of food distributed to communities` },
                { icon: "⏳", text: `${pending} donations still pending pickup` },
                { icon: "🚗", text: `${picked} donations currently picked up` },
                { icon: "✅", text: `${efficiency}% overall distribution efficiency` },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-gray-700">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🍱 Food Type Breakdown</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(foodGroups)
              .sort((a, b) => b[1] - a[1])
              .map(([food, qty]) => (
                <div key={food} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="font-semibold text-gray-800 text-sm">{food}</div>
                  <div className="text-2xl font-bold text-green-600">{qty} kg</div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reports;
