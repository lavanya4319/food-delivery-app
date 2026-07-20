import "./DashboardShell.css";

const DashboardShell = ({ title, subtitle, stats, children, variant = "default" }) => {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell__wrap">
        <div className={`dashboard-shell__header dashboard-shell__header--${variant}`}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {stats?.length > 0 && (
          <div className="dashboard-shell__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-shell__stat">
                <div className="dashboard-shell__stat-label">{stat.label}</div>
                <div className="dashboard-shell__stat-value">{stat.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="dashboard-shell__content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
