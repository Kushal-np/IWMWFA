import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import SideBar from "../components/SideBar";

// Register Chart.js components
Chart.register(...registerables);

export default function AllData() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isMobile, setIsMobile] = useState(false);

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

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 780);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Remove body margins
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  useEffect(() => {
    const data = {
      statistics: {
        users: { total: 8, regular: 4, businesses: 2, admins: 2 },
        complaints: { total: 14, pending: 14, verified: 0, resolved: 0 },
        operations: {
          totalTrucks: 1,
          totalRoutes: 1,
          wardsCovered: 1,
          totalPickupRequests: 9,
          pendingPickupRequests: 0,
        },
      },
      charts: {
        complaintsByStatus: [
          { status: "Pending", count: 14, color: "#FFA500" },
          { status: "Verified", count: 0, color: "#4169E1" },
          { status: "Resolved", count: 0, color: "#32CD32" },
        ],
        usersByRole: [
          { role: "Users", count: 4, color: "#4169E1" },
          { role: "Businesses", count: 2, color: "#FF6347" },
          { role: "Admins", count: 2, color: "#32CD32" },
        ],
        wardWiseUsers: [
          { ward: "Ward 5", count: 1 },
          { ward: "Ward 9", count: 1 },
        ],
      },
    };

    document.getElementById("totalUsers").textContent =
      data.statistics.users.total;
    document.getElementById("totalComplaints").textContent =
      data.statistics.complaints.total;
    document.getElementById("resolvedComplaints").textContent =
      data.statistics.complaints.resolved;
    document.getElementById("pendingPickup").textContent =
      data.statistics.operations.pendingPickupRequests;

    const createChart = (ref, instanceRef, config) => {
      if (!ref.current) return;
      if (instanceRef.current) instanceRef.current.destroy();
      instanceRef.current = new Chart(ref.current.getContext("2d"), config);
    };

    createChart(complaintsChartRef, complaintsChartInstance, {
      type: "doughnut",
      data: {
        labels: data.charts.complaintsByStatus.map((c) => c.status),
        datasets: [
          {
            data: data.charts.complaintsByStatus.map((c) => c.count),
            backgroundColor: data.charts.complaintsByStatus.map((c) => c.color),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: "bottom" } },
      },
    });

    createChart(complainWardRef, complainWardInstance, {
      type: "bar",
      data: {
        labels: data.charts.wardWiseUsers.map((w) => w.ward),
        datasets: [
          {
            label: "Complaints",
            data: data.charts.wardWiseUsers.map((w) => w.count),
            backgroundColor: ["#FFA500", "#FF6347"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
      },
    });

    createChart(complainCatRef, complainCatInstance, {
      type: "bar",
      data: {
        labels: ["Plastic", "Organic", "Electronic", "Glass"],
        datasets: [
          {
            label: "Complaints",
            data: [5, 4, 3, 2],
            backgroundColor: ["#FFA500", "#32CD32", "#4169E1", "#FF6347"],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: true },
    });

    createChart(wasteCollectedRef, wasteCollectedInstance, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
          {
            label: "Trucks of Waste Collected",
            data: [1, 1, 2, 1, 1],
            borderColor: "#32CD32",
            backgroundColor: "rgba(50,205,50,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: true },
    });

    createChart(userChartRef, userChartInstance, {
      type: "pie",
      data: {
        labels: data.charts.wardWiseUsers.map((w) => w.ward),
        datasets: [
          {
            data: data.charts.wardWiseUsers.map((w) => w.count),
            backgroundColor: ["#4169E1", "#FF6347"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: "bottom" } },
      },
    });
  }, []);

  const styles = {
    layout: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: "#f3f4f6",
    },
    main: {
      flex: 1,
      padding: isMobile ? "70px 24px 24px" : "40px 50px",
      overflowY: "auto",
      background: "#f3f4f6",
    },
    topbar: {
      marginBottom: "30px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#1e293b",
      margin: 0,
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    },
    statCard: {
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    statCardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
    statTitle: {
      fontSize: "0.95rem",
      marginBottom: "12px",
      color: "#64748b",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    statValue: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1e293b",
      margin: 0,
    },
    chartsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "24px",
      marginTop: "30px",
    },
    chartCard: {
      background: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
    },
    chartTitle: {
      marginBottom: "20px",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#1e293b",
    },
    canvasWrapper: {
      position: "relative",
      height: "300px",
      width: "100%",
    },
  };

  return (
    <div style={styles.layout}>
      <SideBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isMobile={isMobile}
      />

      <main style={styles.main}>
        <header style={styles.topbar}>
          <h1 style={styles.title}>📊 Analytics Dashboard</h1>
        </header>

        <section style={styles.stats}>
          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.statCardHover)
            }
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.statTitle}>Total Users</h3>
            <p id="totalUsers" style={styles.statValue}>
              0
            </p>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.statCardHover)
            }
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.statTitle}>Total Complaints</h3>
            <p id="totalComplaints" style={styles.statValue}>
              0
            </p>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.statCardHover)
            }
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.statTitle}>Resolved Complaints</h3>
            <p id="resolvedComplaints" style={styles.statValue}>
              0
            </p>
          </div>

          <div
            style={styles.statCard}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.statCardHover)
            }
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            <h3 style={styles.statTitle}>Pending Pickup</h3>
            <p id="pendingPickup" style={styles.statValue}>
              0
            </p>
          </div>
        </section>

        <section style={styles.chartsContainer}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Complaints by Status</h3>
            <div style={styles.canvasWrapper}>
              <canvas ref={complaintsChartRef}></canvas>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Complaints by Ward</h3>
            <div style={styles.canvasWrapper}>
              <canvas ref={complainWardRef}></canvas>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Complaints by Category</h3>
            <div style={styles.canvasWrapper}>
              <canvas ref={complainCatRef}></canvas>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Waste Collected (Trucks)</h3>
            <div style={styles.canvasWrapper}>
              <canvas ref={wasteCollectedRef}></canvas>
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Users by Ward</h3>
            <div style={styles.canvasWrapper}>
              <canvas ref={userChartRef}></canvas>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}