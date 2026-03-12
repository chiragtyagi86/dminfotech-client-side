type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  const alignment = align === "center" ? "sh-center" : "sh-left";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .sh-wrap {
          max-width: 720px;
          margin-bottom: 16px;
        }

        .sh-center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        .sh-left {
          text-align: left;
        }

        .sh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-primary-2);
          margin-bottom: 14px;
        }

        .sh-eyebrow::before,
        .sh-eyebrow::after {
          content: '';
          display: block;
          height: 1px;
          width: 28px;
          background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-blush));
          border-radius: 2px;
        }

        .sh-left .sh-eyebrow::before {
          display: none;
        }

        .sh-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: var(--color-primary);
          margin: 0 0 16px;
        }

        .sh-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          line-height: 1.80;
          color: var(--color-text-soft);
          margin: 0;
        }
      `}</style>

      <div className={`sh-wrap ${alignment}`}>
        {eyebrow && (
          <div>
            <span className="sh-eyebrow">{eyebrow}</span>
          </div>
        )}
        <h2 className="sh-title">{title}</h2>
        {description && (
          <p className="sh-desc">{description}</p>
        )}
      </div>
    </>
  );
}