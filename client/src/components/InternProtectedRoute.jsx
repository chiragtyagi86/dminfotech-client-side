import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { internApi } from "../lib/api";

export default function InternProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function verifyInternSession() {
      try {
        await internApi.me();
        if (mounted) setStatus("ok");
      } catch {
        if (mounted) setStatus("denied");
      }
    }

    verifyInternSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f0eb" }}>
        <div style={{ color: "#3a405a", fontFamily: "'DM Sans', sans-serif" }}>Loading...</div>
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/intern/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
