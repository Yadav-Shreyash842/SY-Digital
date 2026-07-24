import { createContext, useContext } from 'react'

const ProjectFormContext = createContext(() => {})

export function ProjectFormProvider({ children, value }) {
  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  )
}

export function useOpenProjectForm() {
  return useContext(ProjectFormContext)
}
