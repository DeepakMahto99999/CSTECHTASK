import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AgentContext } from '../context/AgentContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [state, setState] = useState('Admin')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAToken, backendUrl } = useContext(AdminContext)

    const {setUToken } = useContext(AgentContext)

    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {

            if (state === 'Admin') {

                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                    toast.success("Login successful")
                } else {
                    toast.error(data.message)
                }

            } else {
              const { data } = await axios.post(backendUrl + '/api/agent/login', { email, password })
                if (data.success) {
                    localStorage.setItem('uToken', data.token)
                    setUToken(data.token)
                    toast.success("Login successful")
                    navigate('/agent-dashboard')
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message) 
            } else {
                toast.error("Something went wrong") 
            }
        }

    }

    return (
        <div>
            <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center '>

                <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

                    <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'>{state}</span> Login</p>

                    <div className='w-full'>
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
                    </div>

                    <div className='w-full'>
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
                    </div>

                    <button className='bg-[#5f5fff] text-white w-full py-2 rounded-md text-base'>
                        Login
                    </button>
                    {
                        state === 'Admin'
                            ? <p>Agent Login? <span className='text-[#5f6fff] underline cursor-pointer ' onClick={() => setState('Agent')} >Click here</span> </p>
                            : <p>Admin Login? <span className='text-[#5f6fff] underline cursor-pointer ' onClick={() => setState('Admin')} >Click here</span> </p>
                    }
                </div>
            </form>

        </div>
    )
}

export default Login