import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import SideBar from "../components/SideBar";

// Register Chart.js components
Chart.register(...registerables);

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 260px;
  background: #1e293b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.sidebar .logo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}
.sidebar .menu li {
  list-style: none;
  padding: 12px;
  margin: 8px 0;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s ease;
}
.sidebar .menu li:hover,
.sidebar .menu .active {
  background: #334155;
}
.main {
  flex: 1;
  background: #f3f4f6;
  padding: 20px;
}
.topbar h1 {
  font-size: 26px;
  margin-bottom: 20px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.stat-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #475569;
}
.stat-card p {
  font-size: 30px;
  font-weight: 600;
  color: #1e293b;
}

/* Charts Container using Flexbox */
.charts-large {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

/* Individual chart box */
.chart-card {
  flex: 1 1 350px; /* Grow, shrink, basis */
  max-width: 400px;
  min-width: 300px;
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.chart-card h3 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .sidebar {
    display: none;
  }
  .stats {
    grid-template-columns: 1fr;
  }
}
`;

export default function AnalyticsDashboard() {
  const complaintsChartRef = useRef(null);
  const complainWardRef = useRef(null);
  const complainCatRef = useRef(null);
  const wasteCollectedRef = useRef(null);
  const userChartRef = useRef(null);

  const complaintsChartInstance = useRef(null);
  const complainWardInstance = useRef(null);
  const complainCatInstance = useRef(null);
  const wasteCollectedInstance = useRef(null);
  const userChartInstance = useRef(null);

  useEffect(() => {
    const data = {
      statistics: {
        users: { total: 8, regular: 4, businesses: 2, admins: 2 },
        complaints: { total: 14, pending: 14, verified: 0, resolved: 0 },
        operations: { totalTrucks: 1, totalRoutes: 1, wardsCovered: 1, totalPickupRequests: 9, pendingPickupRequests: 0 }
      },
      charts: {
        complaintsByStatus: [
          { status: "Pending", count: 14, color: "#FFA500" },
          { status: "Verified", count: 0, color: "#4169E1" },
          { status: "Resolved", count: 0, color: "#32CD32" }
        ],
        usersByRole: [
          { role: "Users", count: 4, color: "#4169E1" },
          { role: "Businesses", count: 2, color: "#FF6347" },
          { role: "Admins", count: 2, color: "#32CD32" }
        ],
        wardWiseUsers: [
          { ward: "Ward 5", count: 1 },
          { ward: "Ward 9", count: 1 }
        ]
      }
    };

    document.getElementById("totalUsers").textContent = data.statistics.users.total;
    document.getElementById("totalComplaints").textContent = data.statistics.complaints.total;
    document.getElementById("resolvedComplaints").textContent = data.statistics.complaints.resolved;
    document.getElementById("pendingPickup").textContent = data.statistics.operations.pendingPickupRequests;

    const createChart = (ref, instanceRef, config) => {
      if (instanceRef.current) instanceRef.current.destroy();
      instanceRef.current = new Chart(ref.current.getContext("2d"), config);
    };

    createChart(complaintsChartRef, complaintsChartInstance, {
      type: "doughnut",
      data: {
        labels: data.charts.complaintsByStatus.map(c => c.status),
        datasets: [{ data: data.charts.complaintsByStatus.map(c => c.count), backgroundColor: data.charts.complaintsByStatus.map(c => c.color) }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });

    createChart(complainWardRef, complainWardInstance, {
      type: "bar",
      data: {
        labels: data.charts.wardWiseUsers.map(w => w.ward),
        datasets: [{ label: "Complaints", data: data.charts.wardWiseUsers.map(w => w.count), backgroundColor: ["#FFA500", "#FF6347"] }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    createChart(complainCatRef, complainCatInstance, {
      type: "bar",
      data: { labels: ["Plastic", "Organic", "Electronic", "Glass"], datasets: [{ label: "Complaints", data: [5, 4, 3, 2], backgroundColor: ["#FFA500", "#32CD32", "#4169E1", "#FF6347"] }] },
      options: { responsive: true }
    });

    createChart(wasteCollectedRef, wasteCollectedInstance, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [{ label: "Trucks of Waste Collected", data: [1, 1, 2, 1, 1], borderColor: "#32CD32", backgroundColor: "rgba(50,205,50,0.2)", fill: true, tension: 0.3 }]
      },
      options: { responsive: true }
    });

    createChart(userChartRef, userChartInstance, {
      type: "pie",
      data: { labels: data.charts.wardWiseUsers.map(w => w.ward), datasets: [{ data: data.charts.wardWiseUsers.map(w => w.count), backgroundColor: ["#4169E1", "#FF6347"] }] },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });

  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="layout">
        <SideBar/>

        <div className="main">
          <header className="topbar">
            <h1>Analytics Dashboard</h1>
          </header>

          <section className="stats">
            <div className="stat-card"><h3>Total Users</h3><p id="totalUsers">0</p></div>
            <div className="stat-card"><h3>Total Complaints</h3><p id="totalComplaints">0</p></div>
            <div className="stat-card"><h3>Resolved Complaints</h3><p id="resolvedComplaints">0</p></div>
            <div className="stat-card"><h3>Pending Pickup</h3><p id="pendingPickup">0</p></div>
          </section>

          <section className="charts-large">
            <div className="chart-card"><h3>Complaints by Status</h3><canvas ref={complaintsChartRef}></canvas></div>
            <div className="chart-card"><h3>Complaints by Ward</h3><canvas ref={complainWardRef}></canvas></div>
            <div className="chart-card"><h3>Complaints by Category</h3><canvas ref={complainCatRef}></canvas></div>
            <div className="chart-card"><h3>Total Truck Of Waste Collected</h3><canvas ref={wasteCollectedRef}></canvas></div>
            <div className="chart-card"><h3>User By Ward</h3><canvas ref={userChartRef}></canvas></div>
          </section>
        </div>
      </div>
    </>
  );
}
