import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AgentContext } from "../../context/AgentContext";

const AgentDashboard = () => {
  const { backendUrl, uToken } = useContext(AgentContext);
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/agent/me`, {
          headers: { Authorization: `Bearer ${uToken}` },
        });
        if (data.success) {
          setAgent(data.agent);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgentData();
  }, [backendUrl, uToken]);

  if (!agent) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="m-0 p-0 w-full  flex justify-center items-start bg-gray-100">
      {/* Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Welcome, {agent.name}
          </h2>
          <p className="text-indigo-100 mt-1 text-sm">
            Manage your assigned data with ease
          </p>
        </div>

        <div className="p-6">
          {/* Agent Info */}
          <div className="bg-gray-50 rounded-xl shadow-md p-6 mb-6 text-center hover:shadow-lg transition-all duration-300">
            <p className="text-gray-700 font-medium mb-2">📧 {agent.email}</p>
            <p className="text-gray-700 font-medium">📱 {agent.mobile}</p>
          </div>

          {/* Assigned Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="py-3 px-4 text-left rounded-tl-lg">First Name</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left rounded-tr-lg">Notes</th>
                </tr>
              </thead>
              <tbody>
                {agent.assignedData.length > 0 ? (
                  agent.assignedData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-indigo-50 transition-colors"
                    >
                      <td className="py-3 px-4">{row.firstName}</td>
                      <td className="py-3 px-4">{row.phone}</td>
                      <td className="py-3 px-4">{row.notes}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No assigned data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
