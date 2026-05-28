import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { User, Car, Navigation, Calendar, CreditCard } from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams();
  const [dataMatrix, setDataMatrix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryProfileLogs = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/users/profile/${username}`);
        console.log("Fetched Profile Data Payload:", data); // Check your inspect console to see if data arrives!
        setDataMatrix(data);
      } catch (err) {
        console.error("Profile UI Render Catch:", err);
        toast.error(err.response?.data?.message || "Operational profiling synchronization failure.");
      } finally {
        setLoading(false);
      }
    };
    queryProfileLogs();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black font-mono text-xs text-zinc-500">
        Streaming Core Telemetry Profiles...
      </div>
    );
  }

  // Double Check if profile keys exist inside the data container
  if (!dataMatrix || !dataMatrix.profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black font-mono text-sm gap-2">
        <p className="text-red-500">Target Profile Matrix Unreachable.</p>
        <p className="text-xs text-zinc-600">Username "@{username}" may not be registered in the system index.</p>
      </div>
    );
  }

  const { profile, role, history } = dataMatrix;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Core Profile Header Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-700">
              {role === 'driver' ? <Car size={36} className="text-amber-400" /> : <User size={36} className="text-blue-400" />}
            </div>
            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest border rounded-full ${
                role === 'driver' ? 'border-amber-500/30 text-amber-400 bg-amber-950/20' : 'border-blue-500/30 text-blue-400 bg-blue-950/20'
              }`}>
                {role} account
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">@{profile.username}</h1>
              <p className="text-xs font-mono text-zinc-500 flex items-center justify-center md:justify-start gap-1">
                <Calendar size={12} /> Registry Active: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Conditional Profile Details for Drivers */}
          {role === 'driver' && (
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono space-y-1 text-zinc-400 w-full md:w-auto">
              <div className="text-zinc-500 font-bold mb-1 uppercase tracking-wider text-[10px]">Telemetry Specs</div>
              <div>Vehicle: <span className="text-white">{profile.vehicleDetails || 'Standard Cab'}</span></div>
              <div>Plate Id: <span className="text-white">{profile.licensePlate || 'N/A'}</span></div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                Status: <span className="text-white">{profile.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History Log Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono text-zinc-400 flex items-center gap-2 border-b border-zinc-900 pb-3 uppercase tracking-widest">
            <Navigation size={14} /> Operational Trip Logs Ledger ({history ? history.length : 0})
          </h2>

          {!history || history.length === 0 ? (
            <div className="text-zinc-600 font-sans italic text-sm py-8 text-center bg-zinc-950/30 border border-dashed border-zinc-900 rounded-xl">
              No historical trajectory coordinates committed to this profile node index yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((ride) => (
                <div key={ride._id} className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl p-5 transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        ride.status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-400'
                      }`}>
                        {ride.status}
                      </span>
                      <span className="text-xs font-mono text-zinc-600">ID: {ride._id?.slice(-8)}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="text-zinc-400 font-sans"><span className="text-zinc-600 font-mono text-xs">A:</span> {ride.pickupAddress}</div>
                      <div className="text-zinc-400 font-sans"><span className="text-zinc-600 font-mono text-xs">B:</span> {ride.destinationAddress}</div>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 border-zinc-900 w-full sm:w-auto pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-1">
                    <div className="text-lg font-bold text-white flex items-center gap-1 font-mono">
                      <CreditCard size={14} className="text-zinc-600" /> ₹{ride.fareAmount}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;