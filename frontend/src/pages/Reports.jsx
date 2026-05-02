import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/total-food")
      .then(res => setTotal(res.data[0].Total_Food));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Reports</h2>

      <p className="mt-4 text-lg">
        Total Food Available: {total}
      </p>
    </div>
  );
}

export default Reports;