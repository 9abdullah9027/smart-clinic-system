import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, FaArrowLeft, FaSave, FaUserMd, FaFileMedical, FaSyringe, FaAllergies, FaNotesMedical, FaSpinner
} from 'react-icons/fa';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Medical Data Form State
  const [medData, setMedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/patient-profile/${id}`);
        setProfile(res.data);
        setMedData(res.data); // Initialize form with existing data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, api]);

  const handleSave = async () => {
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

  if (loading) return <div className="p-10 text-center">Loading Medical Records...</div>;
  if (!profile) return <div className="p-10 text-center">Patient not found</div>;

  const p = profile.patient || {}; // Personal Data Shortcut

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800">
        <FaArrowLeft /> Back to Registry
      </button>

      {/* TOP CARD: Identity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-3">
            {p.name?.charAt(0)}
          </div>
          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full tracking-wide">
            {p.mrn || 'No MRN'}
          </span>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <p className="text-gray-400">Full Name</p>
            <p className="font-semibold text-gray-800">{p.name}</p>
          </div>
          <div>
            <p className="text-gray-400">Father/Guardian</p>
            <p className="font-semibold text-gray-800">{p.fatherName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Date of Birth</p>
            <p className="font-semibold text-gray-800">{p.dob ? new Date(p.dob).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Gender</p>
            <p className="font-semibold text-gray-800">{p.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">National ID</p>
            <p className="font-semibold text-gray-800">{p.nationalId || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Phone</p>
            <p className="font-semibold text-gray-800">{p.phone || 'N/A'}</p>
          </div>
           <div>
            <p className="text-gray-400">Emergency Contact</p>
            <p className="font-semibold text-gray-800">{p.emergencyContact?.name || 'N/A'}</p>
            <p className="text-xs text-gray-500">{p.emergencyContact?.phone}</p>
          </div>
          <div>
            <p className="text-gray-400">Address</p>
            <p className="font-semibold text-gray-800 truncate" title={p.address}>{p.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* MEDICAL DATA SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaNotesMedical className="text-red-500"/> Clinical Medical Record
          </h2>
          {user.role !== 'patient' && (
            !isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-blue-600 font-medium hover:underline">Edit Records</button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center gap-2">
                  {saving && <FaSpinner className="animate-spin"/>} Save
                </button>
              </div>
            )
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className="space-y-6">
            <div className="form-group">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaUserMd className="text-blue-400"/> Primary Diagnosis</label>
              {isEditing ? (
                <input className="w-full p-2 border rounded" value={medData.primaryDiagnosis || ''} onChange={e => setMedData({...medData, primaryDiagnosis: e.target.value})} />
              ) : (
                <p className="p-2 bg-gray-50 rounded text-gray-800 font-medium">{profile.primaryDiagnosis || 'None recorded'}</p>
              )}
            </div>

            <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaAllergies className="text-orange-400"/> Allergies</label>
               {isEditing ? (
                 <input className="w-full p-2 border rounded" value={medData.allergies || ''} onChange={e => setMedData({...medData, allergies: e.target.value})} />
               ) : (
                 <p className="p-2 bg-red-50 text-red-600 rounded border border-red-100">{profile.allergies || 'No known allergies'}</p>
               )}
            </div>

            <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaFileMedical className="text-purple-400"/> Chronic Conditions</label>
               {isEditing ? (
                 <textarea className="w-full p-2 border rounded" rows="2" value={medData.chronicConditions || ''} onChange={e => setMedData({...medData, chronicConditions: e.target.value})} />
               ) : (
                 <p className="p-2 bg-gray-50 rounded">{profile.chronicConditions || 'None'}</p>
               )}
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-gray-700 font-medium mb-1">Blood Group</label>
                 {isEditing ? (
                   <select className="w-full p-2 border rounded" value={medData.bloodGroup || ''} onChange={e => setMedData({...medData, bloodGroup: e.target.value})}>
                     <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                   </select>
                 ) : (
                   <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">{profile.bloodGroup || '?'}</div>
                 )}
               </div>
               <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Visits Count</label>
                  <p className="text-2xl font-bold text-gray-400">{profile.previousVisitsCount || 0}</p>
               </div>
            </div>

            <div className="form-group">
               <label className="flex items-center gap-2 text-gray-700 font-medium mb-1"><FaSyringe className="text-green-400"/> Current Medications</label>
               {isEditing ? (
                 <textarea className="w-full p-2 border rounded" rows="2" value={medData.currentMedications || ''} onChange={e => setMedData({...medData, currentMedications: e.target.value})} />
               ) : (
                 <p className="p-2 bg-gray-50 rounded text-sm">{profile.currentMedications || 'None'}</p>
               )}
            </div>

             <div className="form-group">
               <label className="block text-gray-700 font-medium mb-1">Surgical History</label>
               {isEditing ? (
                 <textarea className="w-full p-2 border rounded" rows="2" value={medData.surgicalHistory || ''} onChange={e => setMedData({...medData, surgicalHistory: e.target.value})} />
               ) : (
                 <p className="p-2 bg-gray-50 rounded text-sm">{profile.surgicalHistory || 'None'}</p>
               )}
            </div>
          </div>
        </div>
        
        {/* Footer Audit */}
        <div className="bg-gray-50 px-6 py-3 text-xs text-gray-400 border-t border-gray-100 flex justify-between">
          <span>Last Updated: {new Date(profile.updatedAt).toLocaleString()}</span>
          <span>System Record ID: {profile._id}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;