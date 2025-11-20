import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaFilePdf, FaCloudUploadAlt, FaUser, FaCalendarAlt, FaTrashAlt, FaDownload, FaSpinner, FaTimes, FaCheckCircle
} from 'react-icons/fa';

const Reports = () => {
  const { api, user } = useAuth();
  
  // Data
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]); // For dropdown
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [patientId, setPatientId] = useState('');
  const [file, setFile] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Reports
        const res = await api.get('/reports');
        setReports(res.data);

        // If Doctor/Admin, fetch Patients list for the dropdown
        if (user.role !== 'patient') {
          const patRes = await api.get('/users/patients');
          setPatients(patRes.data);
        }
      } catch (err) {
        console.error("Error fetching reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api, user.role]);

  // --- 2. Handle Upload ---
  const handleUpload = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Must use FormData for file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('patientId', patientId);
      formData.append('file', file); // Matches backend 'upload.single("file")'

      const res = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setReports([res.data.report, ...reports]);
      setUploadSuccess(true);
      
      // Reset Form
      setTitle('');
      setPatientId('');
      setFile(null);

      setTimeout(() => {
        setUploadSuccess(false);
        setShowModal(false);
      }, 2000);

    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 3. Handle Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      setReports(prev => prev.filter(r => r._id !== id));
      await api.delete(`/reports/${id}`);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // --- 4. Helper to Open PDF ---
  const openReport = (url) => {
    // Construct full URL (Backend is on port 5000)
    const fullUrl = `http://localhost:5000${url}`;
    window.open(fullUrl, '_blank');
  };

  if (loading) return <div className="p-10 text-center">Loading Reports...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical Reports</h1>
          <p className="text-gray-500 text-sm">
            {user.role === 'patient' ? 'View and download your medical history' : 'Upload and manage patient reports'}
          </p>
        </div>
        {user.role !== 'patient' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-600/30 transition-all font-medium"
          >
            <FaCloudUploadAlt /> Upload Report
          </button>
        )}
      </div>

      {/* Reports Grid */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div 
              key={report._id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <FaFilePdf className="text-2xl text-red-500" />
                </div>
                {(user.role === 'admin' || user.role === 'doctor') && (
                  <button onClick={() => handleDelete(report._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FaTrashAlt />
                  </button>
                )}
              </div>
              
              <h3 className="font-bold text-gray-800 mb-1 truncate" title={report.title}>{report.title}</h3>
              <div className="text-xs text-gray-500 mb-4 flex flex-col gap-1">
                <span className="flex items-center gap-1"><FaUser className="text-gray-300"/> {user.role === 'patient' ? `Dr. ${report.doctor?.name || 'Unknown'}` : `Patient: ${report.patient?.name || 'Unknown'}`}</span>
                <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-300"/> {new Date(report.date).toLocaleDateString()}</span>
              </div>

              <button 
                onClick={() => openReport(report.fileUrl)}
                className="mt-auto w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FaDownload /> View Report
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No reports found.</p>
        </div>
      )}

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              
              {uploadSuccess ? (
                <div className="p-10 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-4xl text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800">Upload Successful!</h3>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Upload Patient Report</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                  </div>
                  <form onSubmit={handleUpload} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Title</label>
                      <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none" 
                        placeholder="e.g. Blood Test Results" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                      <select required className="w-full p-2 border border-gray-300 rounded-lg outline-none bg-white" 
                        value={patientId} onChange={e => setPatientId(e.target.value)}>
                        <option value="">-- Choose Patient --</option>
                        {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input type="file" accept="application/pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={e => setFile(e.target.files[0])} />
                        <div className="flex flex-col items-center">
                          <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">{file ? file.name : "Click to upload PDF"}</span>
                        </div>
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                      {submitting ? <FaSpinner className="animate-spin" /> : 'Upload Report'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;