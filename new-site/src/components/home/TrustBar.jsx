// src/components/home/TrustBar.jsx
const ITEMS = [
  { icon: "🏆", text: "ISO 9001:2015 Certified" },
  { icon: "💻", text: "Full-Stack Web Development" },
  { icon: "📱", text: "Responsive & Mobile-First" },
  { icon: "🔍", text: "SEO Architecture Built-In" },
  { icon: "🚀", text: "High-Performance Delivery" },
];

export default function TrustBar() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <>
      <style>{`
        .trust-bar { background: var(--color-primary); padding: 18px 0; overflow: hidden; position: relative; }
        .trust-bar::before, .trust-bar::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none; }
        .trust-bar::before { left: 0; background: linear-gradient(90deg, var(--color-primary), transparent); }
        .trust-bar::after { right: 0; background: linear-gradient(-90deg, var(--color-primary), transparent); }
        .trust-track { display: flex; gap: 0; animation: trustScroll 28s linear infinite; width: max-content; }
        @keyframes trustScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .trust-item { display: flex; align-items: center; gap: 10px; padding: 0 40px; white-space: nowrap; }
        .trust-icon { font-size: 16px; }
        .trust-text { font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 400; color: rgba(255,250,247,0.75); letter-spacing: 0.04em; }
        .trust-sep { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,250,247,0.25); flex-shrink: 0; }
      `}</style>
      <div className="trust-bar">
        <div className="trust-track">
          {doubled.map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              <span className="trust-text">{item.text}</span>
              <span className="trust-sep" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}