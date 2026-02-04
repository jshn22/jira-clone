import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ProjectProgressChart = ({ completed, total }) => {
  const data = [
    {
      name: "Tasks",
      completed,
      remaining: total - completed,
    },
  ];

  const completionPercentage = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Project Progress</h3>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-2xl font-bold text-green-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="completed" fill="#10B981" name="Completed" />
          <Bar dataKey="remaining" fill="#EF4444" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectProgressChart;
