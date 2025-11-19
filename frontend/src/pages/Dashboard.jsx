import React from 'react';
import { 
  FaUserInjured, 
  FaCalendarCheck, 
  FaUserMd, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisH
} from 'react-icons/fa';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- MOCK DATA ---
const statsData = [
  { title: 'Total Patients', value: '1,245', icon: <FaUserInjured />, color: 'bg-blue-500', trend: '+12%', isUp: true },
  { title: 'Appointments', value: '86', icon: <FaCalendarCheck />, color: 'bg-green-500', trend: '+5%', isUp: true },
  { title: 'Total Doctors', value: '14', icon: <FaUserMd />, color: 'bg-purple-500', trend: '0%', isUp: true },
  { title: 'Revenue', value: '$12,450', icon: <FaDollarSign />, color: 'bg-yellow-500', trend: '-2%', isUp: false },
];

const chartData = [
  { name: 'Jan', patients: 400, revenue: 2400 },
  { name: 'Feb', patients: 300, revenue: 1398 },
  { name: 'Mar', patients: 200, revenue: 9800 },
  { name: 'Apr', patients: 278, revenue: 3908 },
  { name: 'May', patients: 189, revenue: 4800 },
  { name: 'Jun', patients: 239, revenue: 3800 },
];

const pieData = [
  { name: 'Completed', value: 400 },
  { name: 'Pending', value: 300 },
  { name: 'Cancelled', value: 100 },
];

const COLORS = ['#10B981', '#3B82F6', '#EF4444']; // Green, Blue, Red

const recentAppointments = [
  { id: 1, patient: 'Alice Smith', doctor: 'Dr. Watson', date: '2023-10-24', status: 'Completed', statusColor: 'text-green-500 bg-green-100' },
  { id: 2, patient: 'Bob Jones', doctor: 'Dr. House', date: '2023-10-24', status: 'Pending', statusColor: 'text-yellow-500 bg-yellow-100' },
  { id: 3, patient: 'Charlie Brown', doctor: 'Dr. Watson', date: '2023-10-23', status: 'Cancelled', statusColor: 'text-red-500 bg-red-100' },
  { id: 4, patient: 'Diana Prince', doctor: 'Dr. Strange', date: '2023-10-22', status: 'Completed', statusColor: 'text-green-500 bg-green-100' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, here is what's happening today.</p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 transition-all text-sm font-medium">
          + New Appointment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg text-white ${stat.color} shadow-lg shadow-opacity-20`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isUp ? <FaArrowUp className="mr-1 text-xs" /> : <FaArrowDown className="mr-1 text-xs" />}
                {stat.trend}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Patient Statistics</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Appointment Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500">Total Appointments: <span className="font-bold text-gray-800">800</span></p>
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Appointments</h2>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Patient Name</th>
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {recentAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{app.patient}</td>
                  <td className="p-4 text-gray-600">{app.doctor}</td>
                  <td className="p-4 text-gray-500">{app.date}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <FaEllipsisH />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;