import { useState } from "react";
import axios from "axios";

function Pickup() {
  const [donationId, setDonationId] = useState("");
  const [volunteerId, setVolunteerId] = useState("");

  const assignPickup = async () => {
    await axios.post("http://localhost:5000/pickup", {
      donation_id: donationId,
      volunteer_id: volunteerId
    });

    alert("Pickup Assigned → Status Updated!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Assign Pickup</h2>

      <input placeholder="Donation ID"
        className="border p-2 m-2"
        onChange={e => setDonationId(e.target.value)} />

      <input placeholder="Volunteer ID"
        className="border p-2 m-2"
        onChange={e => setVolunteerId(e.target.value)} />

      <button
        onClick={assignPickup}
        className="bg-green-500 text-white px-4 py-2 m-2 rounded"
      >
        Assign Pickup
      </button>
    </div>
  );
}

export default Pickup;