// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { adminApi } from "../lib/api";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    async function verifyAdminSession() {
      try {
        setStatus("checking");

        // Use settings/auth-protected endpoint to verify session.
        // If your backend has a dedicated /admin/auth/me endpoint later,
        // replace this with that endpoint.
        const res = await adminApi.getSettings();

        if (!mounted) return;

        // Only allow if we received a real object/response.
        if (res) {
          setStatus("ok");
        } else {
          setStatus("denied");
        }
      } catch (err) {
        if (!mounted) return;
        setStatus("denied");
      }
    }

    verifyAdminSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <>
        <style>{`
          @keyframes protectedSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-bg, #f8f6f3)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "3px solid rgba(153,178,221,0.25)",
              borderTopColor: "var(--color-primary, #3a405a)",
              animation: "protectedSpin 0.8s linear infinite",
            }}
          />
        </div>
      </>
    );
  }

  if (status === "denied") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}