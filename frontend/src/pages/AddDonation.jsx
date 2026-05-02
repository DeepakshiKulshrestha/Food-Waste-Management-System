import { useState } from "react";
import axios from "axios";

function AddDonation() {
  const [form, setForm] = useState({
    donor_id: "",
    ngo_id: "",
    food_type: "",
    quantity: "",
    expiry_time: ""
  });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/add-donation", form);
    alert("Donation Added!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Add Donation</h2>

      <input placeholder="Donor ID" className="border p-2 m-2"
        onChange={e => setForm({...form, donor_id: e.target.value})} />

      <input placeholder="NGO ID" className="border p-2 m-2"
        onChange={e => setForm({...form, ngo_id: e.target.value})} />

      <input placeholder="Food Type" className="border p-2 m-2"
        onChange={e => setForm({...form, food_type: e.target.value})} />

      <input placeholder="Quantity" className="border p-2 m-2"
        onChange={e => setForm({...form, quantity: e.target.value})} />

      <input type="datetime-local" className="border p-2 m-2"
        onChange={e => setForm({...form, expiry_time: e.target.value})} />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}

export default AddDonation;