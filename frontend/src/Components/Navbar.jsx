import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/add", label: "Add Donation" },
    { path: "/pickup", label: "Pickup" },
    { path: "/distribution", label: "Distribution" },
    { path: "/reports", label: "Reports" },
  ];

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍱</span>
          <div>
            <h1 className="text-xl font-bold leading-none">FWMS</h1>
            <p className="text-green-300 text-xs">Food Waste Management System</p>
          </div>
        </div>
        <div className="flex gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${location.pathname === link.path
                  ? "bg-white text-green-700 shadow"
                  : "text-green-100 hover:bg-green-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
