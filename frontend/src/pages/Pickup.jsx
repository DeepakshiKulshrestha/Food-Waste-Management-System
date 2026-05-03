import { useState, useEffect } from "react";
import axios from "axios";

function Pickup() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donationId, setDonationId] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/donations").then((res) =>
      setDonations(res.data.filter((d) => d.status === "Pending"))
    );
    axios.get("http://localhost:5000/volunteers").then((res) => setVolunteers(res.data));
  }, []);

  const handleAssign = async () => {
    if (!donationId || !volunteerId) return alert("Please select both donation and volunteer");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/pickup", {
        donation_id: donationId,
        volunteer_id: volunteerId,
      });
      setSuccess(true);
      setDonationId("");
      setVolunteerId("");
      const res = await axios.get("http://localhost:5000/donations");
      setDonations(res.data.filter((d) => d.status === "Pending"));
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert("Error: " + (e.response?.data?.sqlMessage || e.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Assign Pickup</h1>
          <p className="text-gray-500">Assign a volunteer to collect a pending food donation</p>
        </div>

        {success && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-2xl">🚗</span>
            <div>
              <p className="font-semibold">Pickup Assigned!</p>
              <p className="text-sm">Donation status automatically updated to Picked by trigger.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Pending Donation *
              </label>
              <select
                value={donationId}
                onChange={(e) => setDonationId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="">Choose a donation...</option>
                {donations.map((d) => (
                  <option key={d.donation_id} value={d.donation_id}>
                    #{d.donation_id} — {d.food_type} ({d.quantity} kg) by {d.donor}
                  </option>
                ))}
              </select>
              {donations.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">⚠️ No pending donations available</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Volunteer *
              </label>
              <select
                value={volunteerId}
                onChange={(e) => setVolunteerId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="">Choose a volunteer...</option>
                {volunteers.map((v) => (
                  <option key={v.volunteer_id} value={v.volunteer_id}>
                    {v.name} — {v.contact_no}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssign}
              disabled={loading || !donationId || !volunteerId}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? "Assigning..." : "🚗 Assign Pickup"}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-blue-700 mb-1">⚡ Trigger Active</p>
          <p className="text-sm text-blue-600">
            When pickup is assigned, the database trigger <code className="bg-blue-100 px-1 rounded">trg_after_pickup</code> automatically updates the donation status from <strong>Pending → Picked</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Pickup;
