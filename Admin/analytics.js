// --------------------- DUMMY DATA ---------------------
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
        ],
        wardCoverage: [
            { ward: 5, hasRoute: true, pickupDays: ["Mon","Wed","Fri"], pickupTime: "08:00" }
        ]
    }
};

// --------------------- UPDATE STAT CARDS ---------------------
document.getElementById("totalUsers").textContent = data.statistics.users.total;
document.getElementById("totalComplaints").textContent = data.statistics.complaints.total;
document.getElementById("resolvedComplaints").textContent = data.statistics.complaints.resolved;
document.getElementById("pendingPickup").textContent = data.statistics.operations.pendingPickupRequests;

// --------------------- CHARTS ---------------------

// Complaints by Status - Doughnut Chart
const complaintsCtx = document.getElementById("complaintsChart").getContext("2d");
new Chart(complaintsCtx, {
    type: 'doughnut',
    data: {
        labels: data.charts.complaintsByStatus.map(c => c.status),
        datasets: [{
            data: data.charts.complaintsByStatus.map(c => c.count),
            backgroundColor: data.charts.complaintsByStatus.map(c => c.color)
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    }
});

// Complaints by Ward - Bar Chart
const complainWardCtx = document.getElementById("complainward").getContext("2d");
new Chart(complainWardCtx, {
    type: 'bar',
    data: {
        labels: data.charts.wardWiseUsers.map(w => w.ward),
        datasets: [{
            label: "Complaints",
            data: data.charts.wardWiseUsers.map(w => w.count),
            backgroundColor: ["#FFA500", "#FF6347"]
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } }
    }
});

// Complaints by Category - Bar Chart (Dummy Data)
const complainCatCtx = document.getElementById("complaincat").getContext("2d");
new Chart(complainCatCtx, {
    type: 'bar',
    data: {
        labels: ["Plastic", "Organic", "Electronic", "Glass"],
        datasets: [{
            label: "Complaints",
            data: [5, 4, 3, 2],
            backgroundColor: ["#FFA500","#32CD32","#4169E1","#FF6347"]
        }]
    },
    options: { responsive: true }
});

// Waste Collected - Line Chart (Dummy Data)
const wasteCollectedCtx = document.getElementById("wastecollected").getContext("2d");
new Chart(wasteCollectedCtx, {
    type: 'line',
    data: {
        labels: ["Mon","Tue","Wed","Thu","Fri"],
        datasets: [{
            label: "Trucks of Waste Collected",
            data: [1,1,2,1,1],
            borderColor: "#32CD32",
            backgroundColor: "rgba(50,205,50,0.2)",
            fill: true,
            tension: 0.3
        }]
    },
    options: { responsive: true }
});

// Users by Ward - Pie Chart
const userChartCtx = document.getElementById("UserChart").getContext("2d");
new Chart(userChartCtx, {
    type: 'pie',
    data: {
        labels: data.charts.wardWiseUsers.map(w => w.ward),
        datasets: [{
            data: data.charts.wardWiseUsers.map(w => w.count),
            backgroundColor: ["#4169E1","#FF6347"]
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    }
});
