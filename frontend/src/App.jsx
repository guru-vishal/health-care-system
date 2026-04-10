import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import WorkerProfile from "./components/WorkerProfile";
import MedicalRecord from "./components/MedicalRecord";
import HealthHistory from "./components/HealthHistory";
import QRScanner from "./components/QRScanner";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import { api } from "./lib/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("hms_user");
      const token = api.token.get();
      if (storedUser && token) return JSON.parse(storedUser);
    } catch {
      // ignore
    }
    return null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const storedUser = localStorage.getItem("hms_user");
      const token = api.token.get();
      if (storedUser && token) return "dashboard";
    } catch {
      // ignore
    }
    return "landing";
  });
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [notification, setNotification] = useState(null);

  const normalizeWorker = (w) => {
    if (!w) return w;
    if (w.workerId) {
      return {
        id: w.workerId,
        name: w.name,
        age: w.age,
        state: w.state,
        bloodType: w.bloodType,
        phone: w.phone,
        emergency: w.emergencyContact,
        role: w.jobRole,
        photo: w.photoUrl || null,
      };
    }
    return w;
  };

  useEffect(() => {
    let cancelled = false;
    async function loadWorkers() {
      try {
        const data = await api.listWorkers();
        const normalized = (data || []).map(normalizeWorker);
        if (!cancelled) setWorkers(normalized);
      } catch {
        if (!cancelled) setWorkers([]);
      }
    }

    // Load workers regardless of auth; creation needs auth.
    loadWorkers();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function openFromUrl() {
      try {
        const params = new URLSearchParams(window.location.search || "");
        const wid = params.get("workerId") || params.get("wid");
        if (!wid) return;

        const worker = await api.getWorker(wid);
        if (cancelled) return;
        const normalized = normalizeWorker(worker);
        setSelectedWorker(normalized);
        setCurrentPage("profile");
      } catch {
        // ignore invalid ids / fetch errors
      }
    }

    openFromUrl();
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const navigate = (page, worker = null) => {
    setCurrentPage(page);
    if (worker) setSelectedWorker(worker);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentPage("dashboard");
    localStorage.setItem("hms_user", JSON.stringify(userData));
    showNotification(`Welcome back, ${userData.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
    localStorage.removeItem("hms_user");
    api.logout();
    showNotification("Logged out successfully.", "info");
  };

  const addWorker = async (workerData) => {
    const year = new Date().getFullYear();
    const next = String((workers?.length || 0) + 100).padStart(4, "0");
    const workerId = `KL-${year}-${next}`;

    const created = await api.createWorker({
      workerId,
      name: workerData.name,
      age: workerData.age,
      state: workerData.state,
      bloodType: workerData.bloodType,
      phone: workerData.phone,
      emergencyContact: workerData.emergency,
      jobRole: workerData.role,
    });

    const normalized = normalizeWorker(created);
    setWorkers((prev) => [normalized, ...prev]);
    showNotification(`Worker ${workerData.name} registered successfully!`);
    return normalized;
  };

  const addRecord = async (workerId, recordData) => {
    await api.addWorkerRecord(workerId, recordData);
    // Records are loaded on-demand by Profile/History.
    showNotification("Medical record added successfully!");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage navigate={navigate} />;
      case "login":
        return <Login onLogin={handleLogin} navigate={navigate} />;
      case "register":
        return <Register navigate={navigate} onRegistered={handleLogin} />;
      case "dashboard":
        return (
          <Dashboard
            workers={workers}
            currentUser={currentUser}
            navigate={navigate}
            setSelectedWorker={setSelectedWorker}
          />
        );
      case "profile":
        return (
          <WorkerProfile
            worker={selectedWorker}
            navigate={navigate}
            currentUser={currentUser}
          />
        );
      case "add-record":
        return (
          <MedicalRecord
            worker={selectedWorker}
            navigate={navigate}
            addRecord={addRecord}
            showNotification={showNotification}
          />
        );
      case "history":
        return (
          <HealthHistory
            worker={selectedWorker}
            navigate={navigate}
          />
        );
      case "qr-scanner":
        return (
          <QRScanner
            workers={workers}
            navigate={navigate}
            setSelectedWorker={setSelectedWorker}
          />
        );
      case "register-worker":
        return (
          <Register isWorkerReg={true} navigate={navigate} addWorker={addWorker} />
        );
      case "settings":
        return <Settings currentUser={currentUser} navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/6 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {currentPage !== "landing" && currentPage !== "login" && currentPage !== "register" && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          navigate={navigate}
          currentPage={currentPage}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right
            ${notification.type === "success" ? "bg-teal-500/20 border border-teal-500/40 text-teal-300" : ""}
            ${notification.type === "info" ? "bg-blue-500/20 border border-blue-500/40 text-blue-300" : ""}
            ${notification.type === "error" ? "bg-red-500/20 border border-red-500/40 text-red-300" : ""}
          `}
        >
          <span className="text-xl">
            {notification.type === "success" ? "✓" : notification.type === "info" ? "ℹ" : "✕"}
          </span>
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      <main className="relative z-10">{renderPage()}</main>
    </div>
  );
}