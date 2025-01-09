import LineChart from "./chart";
import PageHeader from "../../common/page-header/page-header";
import "./statistics.scss";

const Statistics = () => {
  const userData = [
    { date: "2025-01-01", users: 50 },
    { date: "2025-01-02", users: 75 },
    { date: "2025-01-03", users: 60 },
    { date: "2025-01-04", users: 80 },
    { date: "2025-01-05", users: 100 },
  ];
  return (
    <div className="statistics-wrapper">
      <PageHeader
        title="Statistics"
        backgroundColor="#2e1b3e"
        fontColor="white"
      />

      <div className="chart-wrapper">
        <LineChart data={userData} />
      </div>
    </div>
  );
};

export default Statistics;
