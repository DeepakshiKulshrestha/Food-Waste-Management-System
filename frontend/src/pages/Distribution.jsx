import { useState, useEffect } from "react";
import axios from "axios";

function Distribution() {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [donationId, setDonationId] = useState("");
  const [ngoId, setNgoId] = useState("");
  const [peopleServed, setPeopleServed] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/donations").then((res) =>
      setDonations(res.data.filter((d) => d.status === "Picked"))
    );
    axios.get("http://localhost:5000/ngos").then((res) => setNgos(res.data));
  }, []);

  const handleDistribute = async () => {
    if (!donationId || !ngoId || !peopleServed) return alert("Please fill all fields");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/distribution", {
        donation_id: donationId,
        ngo_id: ngoId,
        people_served: peopleServed,
      });
      setSuccess(true);
      setDonationId("");
      setNgoId("");
      setPeopleServed("");
      const res = await axios.get("http://localhost:5000/donations");
      setDonations(res.data.filter((d) => d.status === "Picked"));
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
          <h1 className="text-3xl font-bold text-gray-800">Food Distribution</h1>
          <p className="text-gray-500">Distribute picked food to an NGO for community feeding</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <p className="font-semibold">Food Distributed Successfully!</p>
              <p className="text-sm">Donation status automatically updated to Distributed by trigger.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Picked Donation *
              </label>
              <select
                value={donationId}
                onChange={(e) => setDonationId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                <option value="">Choose a donation...</option>
                {donations.map((d) => (
                  <option key={d.donation_id} value={d.donation_id}>
                    #{d.donation_id} — {d.food_type} ({d.quantity} kg) by {d.donor}
                  </option>
                ))}
              </select>
              {donations.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">⚠️ No picked donations available. Assign pickups first.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select NGO *
              </label>
              <select
                value={ngoId}
                onChange={(e) => setNgoId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              >
                <option value="">Choose an NGO...</option>
                {ngos.map((n) => (
                  <option key={n.ngo_id} value={n.ngo_id}>
                    {n.ngo_name} — {n.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                People Served *
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={peopleServed}
                onChange={(e) => setPeopleServed(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
              />
            </div>

            <button
              onClick={handleDistribute}
              disabled={loading || !donationId || !ngoId || !peopleServed}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? "Distributing..." : "🏢 Distribute Food"}
            </button>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-sm font-semibold text-green-700 mb-1">⚡ Trigger Active</p>
          <p className="text-sm text-green-600">
            When distribution is recorded, the trigger <code className="bg-green-100 px-1 rounded">trg_after_distribution</code> automatically updates the donation status from <strong>Picked → Distributed</strong>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Distribution;
