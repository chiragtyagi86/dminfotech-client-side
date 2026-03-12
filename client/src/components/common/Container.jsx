// src/components/common/Container.jsx
export default function Container({ children, className = "" }) {
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }} className={className}>
      {children}
    </div>
  );
}