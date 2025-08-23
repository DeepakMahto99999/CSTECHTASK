import { createContext } from "react"

export const AgentContext = createContext()

const AgentContextProvider = (props) => {

    const value = {

    }

  return (
    <AgentContext.Provider value={value}>
      {props.children}
    </AgentContext.Provider>
  )
}

export default AgentContextProvider
