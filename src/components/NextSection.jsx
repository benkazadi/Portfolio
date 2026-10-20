export default function NextSection({ label, subtitle, onClick }) {
  return (
    <div className="next-section" onClick={onClick}>
      <span className="next-section-arrow">↓</span>
      <span className="next-section-label">{label}</span>
      <span className="next-section-sub">{subtitle}</span>
    </div>
  );
}