import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">

      <h1 className="text-5xl font-bold mb-4">
        FWMS 
      </h1>

      <p className="text-lg mb-10 text-center max-w-xl">
        Food Waste Management System for efficient donation, pickup and distribution of surplus food.
      </p>

      <div className="grid grid-cols-2 gap-6">

        <button onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Dashboard
        </button>

        <button onClick={() => navigate("/add")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Add Donation
        </button>

        <button onClick={() => navigate("/pickup")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Assign Pickup
        </button>

        <button onClick={() => navigate("/distribution")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Distribution
        </button>

        <button onClick={() => navigate("/reports")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl shadow hover:scale-105 transition col-span-2">
          Reports
        </button>

      </div>

    </div>
  );
}

export default Home;