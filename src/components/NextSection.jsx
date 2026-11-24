export default function NextSection({ label, subtitle, onClick }) {
  return (
    <div className="next-section" onClick={onClick}>
      <span className="next-section-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17A2E" stroke-width="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down preview-icon"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </span>
      <span className="next-section-label">{label}</span>
      <span className="next-section-sub">{subtitle}</span>
    </div>
  );
}