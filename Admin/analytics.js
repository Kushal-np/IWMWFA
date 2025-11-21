async function loadDashboard() {
  try {
    const res = await fetch("/api/admin/dashboard-data");
    const json = await res.json();
    const data = json.data;

    // UPDATE STATS
    document.getElementById("totalUsers").innerText = data.statistics.users.total;
    document.getElementById("totalComplaints").innerText = data.statistics.complaints.total;
    document.getElementById("resolvedComplaints").innerText = data.statistics.complaints.resolved;
    document.getElementById("pendingPickup").innerText = data.statistics.operations.pendingPickupRequests;

    // CHART 1: Complaints by Status
    new Chart(document.getElementById("complaintsChart"), {
      type: "pie",
      data: {
        labels: data.charts.complaintsByStatus.map(c => c.status),
        datasets: [{
          data: data.charts.complaintsByStatus.map(c => c.count),
          backgroundColor: data.charts.complaintsByStatus.map(c => c.color)
        }]
      }
    });

    // CHART 2: Users by Role
    new Chart(document.getElementById("complainward"), {
      type: "bar",
      data: {
        labels: data.charts.usersByRole.map(u => u.role),
        datasets: [{
          label: "Users",
          data: data.charts.usersByRole.map(u => u.count),
          backgroundColor: data.charts.usersByRole.map(u => u.color)
        }]
      },
      options: {
        responsive: true
      }
    });

    // CHART 3: Ward-wise Users
    new Chart(document.getElementById("complaincat"), {
      type: "bar",
      data: {
        labels: data.charts.wardWiseUsers.map(w => w.ward),
        datasets: [{
          label: "Users per Ward",
          data: data.charts.wardWiseUsers.map(w => w.count),
          backgroundColor: "#4ade80"
        }]
      }
    });

    // CHART 4: Ward Coverage
    new Chart(document.getElementById("wastecollected"), {
      type: "doughnut",
      data: {
        labels: data.charts.wardCoverage.map(w => "Ward " + w.ward),
        datasets: [{
          data: data.charts.wardCoverage.map(w => w.hasRoute ? 1 : 0),
          backgroundColor: ["#16a34a", "#dc2626", "#2563eb", "#f59e0b", "#9333ea"]
        }]
      }
    });

    // CHART 5: Pickup Requests
    new Chart(document.getElementById("UserChart"), {
      type: "bar",
      data: {
        labels: ["Total Requests", "Pending"],
        datasets: [{
          label: "Requests",
          data: [
            data.statistics.operations.totalPickupRequests,
            data.statistics.operations.pendingPickupRequests
          ],
          backgroundColor: ["#0ea5e9", "#facc15"]
        }]
      }
    });

  } catch (error) {
    console.log("Dashboard load error:", error);
  }
}

loadDashboard();
