import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const AdminDashboard = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/agents`, {
          headers: { Authorization: `Bearer ${aToken}` },
        });
        if (data.success) {
          setAgents(data.agents);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, [backendUrl, aToken]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, idx) => (
          <div
            key={idx}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
          >
            {/* ✅ Agent Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {agent.name}
              </h3>
              <p className="text-gray-600 text-sm">📧 {agent.email}</p>
              <p className="text-gray-600 text-sm">📱 {agent.mobile}</p>
            </div>

            {/* ✅ Assigned Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-3 rounded-tl-lg">First Name</th>
                    <th className="py-2 px-3">Phone</th>
                    <th className="py-2 px-3 rounded-tr-lg">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {agent.assignedData.length > 0 ? (
                    agent.assignedData.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-2 px-3">{row.firstName}</td>
                        <td className="py-2 px-3">{row.phone}</td>
                        <td className="py-2 px-3">{row.notes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-3 text-gray-500 italic"
                      >
                        No assigned data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
