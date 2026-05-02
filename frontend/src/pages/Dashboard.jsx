import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [ngos, setNgos] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/donations");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();

    axios.get("http://localhost:5000/volunteers")
      .then(res => setVolunteers(res.data));

    axios.get("http://localhost:5000/ngos")
      .then(res => setNgos(res.data));

  }, []);

  // stats
  const total = data.length;
  const pending = data.filter(d => d.status === "Pending").length;
  const picked = data.filter(d => d.status === "Picked").length;
  const distributed = data.filter(d => d.status === "Distributed").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Dashboard Overview
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Donations</h2>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="bg-yellow-100 p-5 rounded-xl shadow">
          <h2 className="text-yellow-700">Pending</h2>
          <p className="text-2xl font-bold">{pending}</p>
        </div>

        <div className="bg-blue-100 p-5 rounded-xl shadow">
          <h2 className="text-blue-700">Picked</h2>
          <p className="text-2xl font-bold">{picked}</p>
        </div>

        <div className="bg-green-100 p-5 rounded-xl shadow">
          <h2 className="text-green-700">Distributed</h2>
          <p className="text-2xl font-bold">{distributed}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Donor</th>
              <th className="p-4">NGO</th>
              <th className="p-4">Food</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Status</th>
              <th className="p-4">Volunteer</th>
              <th className="p-4">NGO Select</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.donation_id} className="border-b hover:bg-gray-50">

                <td className="p-4">{d.donation_id}</td>
                <td className="p-4">{d.donor}</td>
                <td className="p-4">{d.ngo || "Not Assigned"}</td>
                <td className="p-4">{d.food_type}</td>
                <td className="p-4">{d.quantity}</td>

                {/* STATUS */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${d.status === "Pending" && "bg-yellow-200 text-yellow-800"}
                    ${d.status === "Picked" && "bg-blue-200 text-blue-800"}
                    ${d.status === "Distributed" && "bg-green-200 text-green-800"}
                  `}>
                    {d.status}
                  </span>
                </td>

                {/* VOLUNTEER DROPDOWN */}
                <td className="p-4">
                  <select
                    onChange={(e) => d.selectedVolunteer = e.target.value}
                    className="border p-1 rounded"
                  >
                    <option>Select</option>
                    {volunteers.map(v => (
                      <option key={v.volunteer_id} value={v.volunteer_id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* NGO DROPDOWN */}
                <td className="p-4">
                  <select
                    onChange={(e) => d.selectedNgo = e.target.value}
                    className="border p-1 rounded"
                  >
                    <option>Select</option>
                    {ngos.map(n => (
                      <option key={n.ngo_id} value={n.ngo_id}>
                        {n.ngo_name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* ACTION BUTTONS */}
                <td className="p-4 flex gap-2">

                  {/* PICKUP */}
                  <button
                    onClick={async () => {
                      if (!d.selectedVolunteer) {
                        alert("Select volunteer first");
                        return;
                      }

                      await axios.post("http://localhost:5000/pickup", {
                        donation_id: d.donation_id,
                        volunteer_id: d.selectedVolunteer
                      });

                      alert("Pickup assigned!");
                      fetchData();
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    disabled={d.status !== "Pending"}
                  >
                    Pickup
                  </button>

                  {/* DISTRIBUTE */}
                  <button
                    onClick={async () => {
                      if (!d.selectedNgo) {
                        alert("Select NGO first");
                        return;
                      }

                      await axios.post("http://localhost:5000/distribution", {
                        donation_id: d.donation_id,
                        ngo_id: d.selectedNgo,
                        people_served: 50
                      });

                      alert("Distributed!");
                      fetchData();
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={d.status !== "Picked"}
                  >
                    Distribute
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;