import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-black text-white px-6 py-3 flex justify-between items-center">
      
      <h1 className="text-xl font-bold">FWMS</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add">Add</Link>
        <Link to="/pickup">Pickup</Link>
        <Link to="/distribution">Distribution</Link>
        <Link to="/reports">Reports</Link>
      </div>

    </div>
  );
}

export default Navbar;