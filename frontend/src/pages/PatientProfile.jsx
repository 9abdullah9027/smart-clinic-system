import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaArrowLeft, FaSave, FaUserMd, FaFileMedical, 
  FaSyringe, FaAllergies, FaNotesMedical, FaSpinner, FaPlus, FaClock
} from 'react-icons/fa';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();

  // Data State
  const [profile, setProfile] = useState(null); // Holds Patient Info + Med Stats
  const [history, setHistory] = useState([]);   // Holds Timeline
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');
  
  // Editing Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [medData, setMedData] = useState({}); // Form data for editing stats

  // New Record Form State
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [newRecord, setNewRecord] = useState({ diagnosis: '', prescription: '', notes: '' });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Profile (Personal + Med Stats)
        const profileRes = await api.get(`/patient-profile/${id}`);
        setProfile(profileRes.data);
        setMedData(profileRes.data); // Pre-fill edit form

        // Fetch History Timeline
        const historyRes = await api.get(`/history/${id}`);
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, api]);

  // --- 2. UPDATE MEDICAL STATS (Allergies, Blood Group, etc.) ---
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put(`/patient-profile/${id}`, medData);
      setProfile({ ...profile, ...medData }); // Update local view
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update medical record");
    } finally {
      setSaving(false);
    }
  };

  // --- 3. ADD NEW CLINICAL NOTE (Update History & Visit Count) ---
  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/history', { ...newRecord, patientId: id });
      
      // A. Add new record to timeline
      setHistory([res.data.record, ...history]);
      
      // B. LIVE UPDATE: Increment visit count immediately
      setProfile(prev => ({
        ...prev,
        previousVisitsCount: (prev.previousVisitsCount || 0) + 1
      }));

      setShowHistoryForm(false);
      setNewRecord({ diagnosis: '', prescription: '', notes: '' });
    } catch (err) {
      alert("Failed to save record");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Medical Records...</div>;
  if (!profile) return <div className="p-10 text-center">Patient not found</div>;

  const p = profile.patient || {}; // Shortcut for personal info

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
        <FaArrowLeft /> Back to Registry
      </button>

      {/* --- TOP CARD: IDENTITY --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-3 uppercase">
            {p.name?.charAt(0)}
          </div>
          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full tracking-wide">
            {p.mrn || 'No MRN'}
          </span>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Full Name</p><p className="font-semibold text-gray-800 text-lg">{p.name}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Father/Guardian</p><p className="font-semibold text-gray-800">{p.fatherName || 'N/A'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Date of Birth</p><p className="font-semibold text-gray-800">{p.dob ? new Date(p.dob).toLocaleDateString() : 'N/A'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Gender</p><p className="font-semibold text-gray-800">{p.gender || 'N/A'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">National ID</p><p className="font-semibold text-gray-800">{p.nationalId || 'N/A'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Phone</p><p className="font-semibold text-gray-800">{p.phone || 'N/A'}</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Emergency</p><p className="font-semibold text-gray-800">{p.emergencyContact?.name || 'N/A'} ({p.emergencyContact?.phone})</p></div>
          <div><p className="text-gray-400 text-xs uppercase tracking-wider">Address</p><p className="font-semibold text-gray-800 truncate" title={p.address}>{p.address || 'N/A'}</p></div>
        </div>
      </div>

      {/* --- MEDICAL DATA SECTION (EDITABLE) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaNotesMedical className="text-red-500"/> Clinical Overview
          </h2>
          {/* Only Doctors/Admin can edit */}
          {user.role !== 'patient' && (
            !isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-blue-600 font-medium hover:underline text-sm">Edit Details</button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
                <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center gap-2 text-sm">
                  {saving && <FaSpinner className="animate-spin"/>} Save
                </button>
              </div>
            )
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className="space-y-6">
             {/* Visit Count (Read Only) */}
             <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="text-blue-800 font-medium flex items-center gap-2"><FaClock /> Total Visits</span>
                <span className="text-2xl font-bold text-blue-600">{profile.previousVisitsCount || 0}</span>
             </div>

            <div className="form-group">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1 text-sm uppercase"><FaUserMd className="text-blue-400"/> Primary Diagnosis</label>
              {isEditing ? (
                <input className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" value={medData.primaryDiagnosis || ''} onChange={e => setMedData({...medData, primaryDiagnosis: e.target.value})} />
              ) : (
                <p className="p-2 bg-gray-50 rounded text-gray-800">{profile.primaryDiagnosis || 'None recorded'}</p>
              )}
            </div>

            <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1 text-sm uppercase"><FaAllergies className="text-orange-400"/> Allergies</label>
               {isEditing ? (
                 <input className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" value={medData.allergies || ''} onChange={e => setMedData({...medData, allergies: e.target.value})} />
               ) : (
                 <p className="p-2 bg-red-50 text-red-600 rounded border border-red-100">{profile.allergies || 'No known allergies'}</p>
               )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="form-group">
               <label className="block text-gray-700 font-medium mb-1 text-sm uppercase">Blood Group</label>
               {isEditing ? (
                 <select className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" value={medData.bloodGroup || ''} onChange={e => setMedData({...medData, bloodGroup: e.target.value})}>
                   <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                 </select>
               ) : (
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">{profile.bloodGroup || '?'}</div>
               )}
            </div>

            <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1 text-sm uppercase"><FaSyringe className="text-green-400"/> Current Medications</label>
               {isEditing ? (
                 <textarea className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" rows="2" value={medData.currentMedications || ''} onChange={e => setMedData({...medData, currentMedications: e.target.value})} />
               ) : (
                 <p className="p-2 bg-gray-50 rounded text-sm">{profile.currentMedications || 'None'}</p>
               )}
            </div>

             <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1 text-sm uppercase"><FaFileMedical className="text-purple-400"/> Surgical History</label>
               {isEditing ? (
                 <textarea className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" rows="2" value={medData.surgicalHistory || ''} onChange={e => setMedData({...medData, surgicalHistory: e.target.value})} />
               ) : (
                 <p className="p-2 bg-gray-50 rounded text-sm">{profile.surgicalHistory || 'None'}</p>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* --- HISTORY TIMELINE --- */}
      <div>
        <div className="flex justify-between items-end mb-4">
           <h2 className="text-xl font-bold text-gray-800">Patient History</h2>
           {/* Add Record Button */}
           {user.role !== 'patient' && !showHistoryForm && (
              <button onClick={() => setShowHistoryForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <FaPlus /> Add Clinical Note
              </button>
           )}
        </div>

        {/* Add Record Form */}
        <AnimatePresence>
          {showHistoryForm && (
             <motion.form 
               initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
               onSubmit={handleAddRecord} 
               className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg mb-8 overflow-hidden"
             >
               <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">New Clinical Encounter</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">Diagnosis</label>
                   <input type="text" placeholder="e.g. Acute Bronchitis" required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">Prescription / Plan</label>
                   <input type="text" placeholder="e.g. Amoxicillin 500mg TDS" required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" value={newRecord.prescription} onChange={e => setNewRecord({...newRecord, prescription: e.target.value})} />
                 </div>
               </div>
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-600 mb-1">Detailed Notes</label>
                 <textarea placeholder="Patient presented with..." required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={newRecord.notes} onChange={e => setNewRecord({...newRecord, notes: e.target.value})}></textarea>
               </div>
               <div className="flex gap-3 justify-end">
                 <button type="button" onClick={() => setShowHistoryForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow-md">Save Record</button>
               </div>
             </motion.form>
          )}
        </AnimatePresence>

        {/* Timeline List */}
        <div className="space-y-6 relative pl-4">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {history.length > 0 ? (
            history.map((record) => (
              <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} key={record._id} className="relative pl-8">
                {/* Dot */}
                <div className="absolute left-[10px] top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm transform -translate-x-1/2"></div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{record.diagnosis}</h3>
                      <p className="text-sm text-blue-600 font-medium">Rx: {record.prescription}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">{new Date(record.visitDate).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">{new Date(record.visitDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-line mb-4 bg-gray-50 p-3 rounded border border-gray-100">{record.notes}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaUserMd className="text-blue-400"/> 
                    <span>Attended by <strong>Dr. {record.doctor?.name}</strong> <span className="text-gray-400">({record.doctor?.specialization || 'GP'})</span></span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10 pl-8 italic">No medical history recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;