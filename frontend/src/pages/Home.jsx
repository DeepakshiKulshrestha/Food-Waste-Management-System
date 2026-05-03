import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, distributed: 0, people: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/donations").then((res) => {
      const data = res.data;
      setStats({
        total: data.length,
        pending: data.filter((d) => d.status === "Pending").length,
        distributed: data.filter((d) => d.status === "Distributed").length,
        people: 95,
      });
    });
  }, []);

  const cards = [
    { path: "/dashboard", icon: "📊", label: "Dashboard", desc: "View all donations and manage status", color: "from-green-500 to-green-600" },
    { path: "/add", icon: "➕", label: "Add Donation", desc: "Register new food donation", color: "from-blue-500 to-blue-600" },
    { path: "/pickup", icon: "🚗", label: "Assign Pickup", desc: "Assign volunteers to collect food", color: "from-yellow-500 to-yellow-600" },
    { path: "/distribution", icon: "🏢", label: "Distribution", desc: "Distribute food to NGOs", color: "from-purple-500 to-purple-600" },
    { path: "/reports", icon: "📈", label: "Reports", desc: "View analysis and insights", color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-700 to-green-500 text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">🍱</div>
        <h1 className="text-5xl font-bold mb-3">Food Waste Management System</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
          Connecting donors, volunteers and NGOs to reduce food waste and feed communities.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          Open Dashboard →
        </button>
      </div>

      <div className="max-w-5xl mx-auto -mt-8 px-6">
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Donations", value: stats.total, icon: "📦", color: "text-green-600" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "text-yellow-600" },
            { label: "Distributed", value: stats.distributed, icon: "✅", color: "text-blue-600" },
            { label: "People Served", value: "95+", icon: "👥", color: "text-purple-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Quick Access</h2>
        <div className="grid grid-cols-3 gap-5 mb-16">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-left`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <div className="text-xl font-bold mb-1">{card.label}</div>
              <div className="text-white/80 text-sm">{card.desc}</div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-8 mb-12 text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-4">How It Works</h3>
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: "🏪", label: "Donor donates food" },
              { icon: "→", label: "" },
              { icon: "🚗", label: "Volunteer picks up" },
              { icon: "→", label: "" },
              { icon: "🏢", label: "NGO distributes" },
              { icon: "→", label: "" },
              { icon: "👥", label: "People are fed" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-3xl">{step.icon}</div>
                {step.label && <div className="text-xs text-gray-500 mt-1 max-w-16">{step.label}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
