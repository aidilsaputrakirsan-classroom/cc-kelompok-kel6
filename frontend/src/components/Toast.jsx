import { useEffect } from "react"

function Toast({ message, type, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!message) return null

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 18px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "bold",
      backgroundColor: type === "error" ? "#C00000" : "#548235",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      zIndex: 9999
    }}>
      {message}
    </div>
  )
}

export default Toast