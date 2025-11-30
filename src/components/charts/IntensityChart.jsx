import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 700, easing: "easeOutCubic" },
  plugins: { legend: { labels: { color: "#374151" } } },
  scales: {
    x: { ticks: { color: "#374151" } },
    y: { ticks: { color: "#374151" } }
  }
};

export default function IntensityChart({ data }) {
  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        label: "Avg intensity",
        data: data.map(d => d.avgIntensity ?? 0),
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.08)",
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-64 md:h-80 transition">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Intensity over time</h3>
      <div className="h-44 md:h-56">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
