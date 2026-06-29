import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const LiveChart = ({ results, totalVotes }) => {
  const labels = Object.keys(results);
  const data = Object.values(results);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: '#7C3AED',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const pct = Math.round((ctx.raw / totalVotes) * 100);
            return `${ctx.raw} votes (${pct}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 13 }, color: '#6B7280' },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#6B7280' },
        grid: { color: '#F3F4F6' },
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
      <div className="mt-6 space-y-2">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{data[i]} votes</span>
              <span className="text-purple-600 font-medium w-10 text-right">
                {Math.round((data[i] / totalVotes) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveChart;