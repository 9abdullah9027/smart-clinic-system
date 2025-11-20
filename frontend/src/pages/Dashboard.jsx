import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserInjured, FaCalendarCheck, FaUserMd, FaDollarSign, FaArrowUp, FaEllipsisH 
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { api, user } = useAuth(); // Get User Role
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0, totalDoctors: 0, totalAppointments: 0, pendingAppointments: 0,
    recentActivity: [], pieData: [], chartData: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [api]);

  // --- DYNAMIC CARDS LOGIC ---
  const statsCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: <FaUserInjured />, color: 'bg-blue-500' },
    { title: 'Appointments', value: stats.totalAppointments, icon: <FaCalendarCheck />, color: 'bg-green-500' },
    { title: 'Total Doctors', value: stats.totalDoctors, icon: <FaUserMd />, color: 'bg-purple-500' },
  ];

  // Only show "Pending Actions/Revenue" card if NOT a patient
  if (user?.role !== 'patient') {
    statsCards.push({ 
      title: 'Pending Actions', 
      value: stats.pendingAppointments, 
      icon: <FaDollarSign />, 
      color: 'bg-yellow-500' 
    });
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Real-Time Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Real-time clinic performance.</p>
        </div>
        <button 
          onClick={() => navigate('/appointments')} 
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 transition-all text-sm font-medium flex items-center gap-2"
        >
          <FaCalendarCheck /> New Appointment
        </button>
      </div>

      {/* Grid: Adjust columns based on number of cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'patient' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
        {statsCards.map((stat, index) => (
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
            <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
              <FaArrowUp className="mr-1 text-xs" /> Live Data
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Appointments</h2>
          <div className="h-72">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No appointment history yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Status Overview</h2>
          <div className="h-64">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Hide Recent Activity Table for Patients (Privacy) */}
      {user?.role !== 'patient' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Doctor</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{app.patient?.name || 'N/A'}</td>
                      <td className="p-4 text-gray-600">{app.doctor?.name || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 
                          app.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400"><FaEllipsisH /></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400">No recent activity</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;