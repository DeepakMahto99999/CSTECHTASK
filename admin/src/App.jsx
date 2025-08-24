import { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AddAgent from './pages/Admin/AddAgent'
import UploadFile from './pages/Admin/UploadFile'
import AgentDashboard from './pages/Agent/AgentDashboard'
import { AgentContext } from './context/AgentContext'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { uToken } = useContext(AgentContext)

  const isAdmin = !!aToken
  const isAgent = !!uToken && !isAdmin   // prefer admin if both ever exist

  if (!isAdmin && !isAgent) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    )
  }

  return (
    <div className="bg-[#f8f9fd] min-h-screen">
      <ToastContainer />
      <Navbar />

      {isAdmin && (
        // ---------- ADMIN LAYOUT (keeps sidebar) ----------
        <div className="flex items-start">
          <Sidebar />
          <div className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<></>} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/add-agent" element={<AddAgent />} />
              <Route path="/upload-file" element={<UploadFile />} />
            </Routes>
          </div>
        </div>
      )}

      {isAgent && (
            <Routes>
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
            </Routes>
      )}
    </div>
  )
}

export default App
