import { createContext, useState } from "react"

export const AgentContext = createContext()

const AgentContextProvider = (props) => {

  const [uToken, setUToken] = useState(localStorage.getItem('uToken') ? localStorage.getItem('uToken') : '')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const value = {
    uToken,setUToken,
    backendUrl
  }

  return (
    <AgentContext.Provider value={value}>
      {props.children}
    </AgentContext.Provider>
  )
}

export default AgentContextProvider
