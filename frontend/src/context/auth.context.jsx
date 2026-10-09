import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { dataContext } from './data.context.js'

export default function AuthContext({ children }) {
  const [userdata, setUserData] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [frontendimage, setFrontendImage] = useState(null)
  const [backendimage, setBackendImage] = useState(null)
  const [selectimage, setSelectImage] = useState(null)
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5050"

  useEffect(() => {
    if (!frontendimage?.startsWith("blob:")) return undefined
    return () => URL.revokeObjectURL(frontendimage)
  }, [frontendimage])

  const getGeminiResponse = useCallback(async (command) => {
    const { data } = await axios.post(
      `${serverUrl}/api/asktoassistant`,
      { command },
      { withCredentials: true },
    )
    return data
  }, [serverUrl])

  useEffect(() => {
    let isMounted = true

    axios
      .get(`${serverUrl}/api/user`, { withCredentials: true })
      .then(({ data }) => {
        if (isMounted) {
          setUserData(data.user ?? null)
          setIsAuthLoading(false)
        }
      })
      .catch((err) => {
        if (!isMounted) return
        setUserData(null)
        setIsAuthLoading(false)
        console.error(
          "Failed to load the current user:",
          err.response?.data?.message || err.message,
        )
      })

    return () => {
      isMounted = false
    }
  }, [serverUrl])

  const value = {
    serverUrl,
    userdata,
    setUserData,
    isAuthLoading,
    frontendimage,
    setFrontendImage,
    backendimage,
    setBackendImage,
    selectimage,
    setSelectImage,
    getGeminiResponse,
  }

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  )
}
