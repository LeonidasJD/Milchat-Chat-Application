import React from "react";
import { Line, LineConfig } from "@ant-design/charts";

// Tipovi za props
interface UserData {
  date: string;
  users: number;
}

interface LineChartProps {
  data: UserData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const config: LineConfig = {
    data,
    xField: "date",
    yField: "users",
    point: {
      size: 25,
      right: 10,
      shape: "circle",
    },
    label: {
      style: {
        fill: "#2e1b3e",
        fontSize: 18,
        fontWeight: "bold",
      },
    },
    tooltip: false,
    smooth: true,
    fill: "red",
  };

  return <Line {...config} />;
};

export default LineChart;
