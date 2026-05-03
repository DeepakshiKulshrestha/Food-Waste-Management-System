import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddDonation() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    donor_id: "",
    ngo_id: "",
    food_type: "",
    quantity: "",
    expiry_time: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/donors").then((res) => setDonors(res.data));
    axios.get("http://localhost:5000/ngos").then((res) => setNgos(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!form.donor_id || !form.food_type || !form.quantity || !form.expiry_time) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/add-donation", form);
      setSuccess(true);
      setForm({ donor_id: "", ngo_id: "", food_type: "", quantity: "", expiry_time: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Error: " + (e.response?.data?.sqlMessage || e.message));
    }
    setLoading(false);
  };

  const foodTypes = ["Rice & Dal", "Chapati & Sabzi", "Biryani", "Khichdi", "Poha", "Bread", "Fruits", "Sweets", "Other"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Add Food Donation</h1>
          <p className="text-gray-500">Register a new food donation into the system</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Donation Added Successfully!</p>
              <p className="text-sm">The donation has been registered in the system.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="grid grid-cols-2 gap-6">

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Donor *</label>
              <select
                value={form.donor_id}
                onChange={(e) => setForm({ ...form, donor_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                <option value="">Select Donor</option>
                {donors.map((d) => (
                  <option key={d.donor_id} value={d.donor_id}>{d.name} — {d.address}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">NGO (Optional)</label>
              <select
                value={form.ngo_id}
                onChange={(e) => setForm({ ...form, ngo_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                <option value="">No NGO Assigned</option>
                {ngos.map((n) => (
                  <option key={n.ngo_id} value={n.ngo_id}>{n.ngo_name} — {n.location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Food Type *</label>
              <select
                value={form.food_type}
                onChange={(e) => setForm({ ...form, food_type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                <option value="">Select Food Type</option>
                {foodTypes.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (kg) *</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Time *</label>
              <input
                type="datetime-local"
                value={form.expiry_time}
                onChange={(e) => setForm({ ...form, expiry_time: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              />
              <p className="text-xs text-gray-400 mt-1">⚠️ Must be a future date/time — expired food is blocked by the system</p>
            </div>

          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Adding..." : "➕ Add Donation"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDonation;
