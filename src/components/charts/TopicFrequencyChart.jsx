import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopicFrequencyChart({ data }) {

  const labels = data.map(item => item._id);
  const counts = data.map(item => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Topic Frequency",
        data: counts,
        backgroundColor: [
          "#F97316",
          "#FB923C",
          "#F43F5E",
          "#A78BFA",
          "#60A5FA",
          "#34D399",
          "#F59E0B",
        ],
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-64 md:h-80 transition">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Top topics</h3>
      <div className="h-50 md:h-56">
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}
