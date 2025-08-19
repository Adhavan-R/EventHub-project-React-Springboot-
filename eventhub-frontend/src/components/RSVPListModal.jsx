import React from "react";
import { exportRSVPsCSV } from "../services/eventService";
import { toast } from "react-toastify";

const RSVPListModal = ({ users, onClose, eventId, attendees, isCreator, isAdmin }) => {


  const handleDownloadCSV = async () => {
    try {
      const blob = await exportRSVPsCSV(eventId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rsvps_event_${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CSV");
    }
  };

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-96 max-h-[80vh] overflow-y-auto border border-gray-200">
    <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
      RSVPed Users
    </h2>

    {(isCreator || isAdmin) && (
      <button
        onClick={handleDownloadCSV}
        className="mb-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Export CSV
      </button>
    )}

    <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
      {users.length > 0 ? (
        users.map((user) => (
          <li
            key={user.id}
            className="border border-gray-200 p-3 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm"
          >
            <div className="font-semibold text-gray-800">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
          </li>
        ))
      ) : (
        <p className="text-center text-gray-600 py-10 font-medium">
          No users have RSVPed yet.
        </p>
      )}
    </ul>

    <button
      onClick={onClose}
      className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-pink-400"
    >
      Close
    </button>
  </div>
</div>

  );
};

export default RSVPListModal;
