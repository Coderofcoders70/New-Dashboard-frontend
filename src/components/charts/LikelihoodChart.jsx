import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 700,
    easing: "easeInOutQuart",
  },
  plugins: {
    legend: {
      labels: { color: "#ffffff" },
    },
  },
  scales: {
    x: { ticks: { color: "#ffffff" } },
    y: { ticks: { color: "#ffffff" } },
  },
};

export default function LikelihoodChart({ data }) {
  
  const labels = data.map(item => item._id);
  const values = data.map(item => item.avgLikelihood ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Avg Likelihood",
        data: values,
        backgroundColor: "rgba(59,130,246,0.8)",
        borderColor: "rgb(34,197,94)",
        tension: 0.35,
        fill: true,
        pointRadius: 3
      }
    ]
  };

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-64 md:h-80 transition">
      <h3 className="text-lg font-semibold mb-2 text-gray-200 dark:text-gray-100">Likelihood by country</h3>
      <div className="h-44 md:h-56">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
