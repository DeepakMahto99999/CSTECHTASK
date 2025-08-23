import { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddAgent from './pages/Admin/AddAgent';
import UploadFile from './pages/Admin/UploadFile';
import AgentDashboard from './pages/Agent/AgentDashboard';

const App = () => {

  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#f8f9fd]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        {/* Admin Route */}
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/add-agent' element={<AddAgent />} />
          <Route path='/upload-file' element={<UploadFile />} />

          {/* Agent routes */}
          <Route path='/agent-dashboard' element={<AgentDashboard />} />
        </Routes>

      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App