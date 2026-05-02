import { useState } from "react";
import axios from "axios";

function Distribution() {
  const [donationId, setDonationId] = useState("");
  const [ngoId, setNgoId] = useState("");

  const distribute = async () => {
    await axios.post("http://localhost:5000/distribute", {
      donation_id: donationId,
      ngo_id: ngoId,
      people_served: 50
    });

    alert("Food Distributed!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Distribution</h2>

      <input placeholder="Donation ID"
        className="border p-2 m-2"
        onChange={e => setDonationId(e.target.value)} />

      <input placeholder="NGO ID"
        className="border p-2 m-2"
        onChange={e => setNgoId(e.target.value)} />

      <button
        onClick={distribute}
        className="bg-purple-500 text-white px-4 py-2 m-2 rounded"
      >
        Distribute
      </button>
    </div>
  );
}

export default Distribution;