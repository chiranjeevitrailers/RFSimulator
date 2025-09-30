"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Phone } from "lucide-react"

interface ImsLayerViewProps {
  appState?: any
  onStateChange?: (state: any) => void
}

const ImsLayerView: React.FC<ImsLayerViewProps> = ({ appState, onStateChange }) => {
  const [logs, setLogs] = useState<any[]>([])
  const [imsStats, setImsStats] = useState<any>({})

  useEffect(() => {
    // Listen for IMS layer updates
    const handleImsUpdate = (event: CustomEvent) => {
      const imsLogs = event.detail.filter(
        (log: any) =>
          log.layer === "IMS" ||
          log.protocol === "SIP" ||
          log.component === "IMS" ||
          log.message?.includes("SIP") ||
          log.message?.includes("INVITE") ||
          log.message?.includes("REGISTER") ||
          log.message?.includes("BYE"),
      )
      setLogs(imsLogs)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("imslayerupdate", handleImsUpdate as EventListener)
      window.addEventListener("immediate-logs-update", handleImsUpdate as EventListener)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("imslayerupdate", handleImsUpdate as EventListener)
        window.removeEventListener("immediate-logs-update", handleImsUpdate as EventListener)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Phone className="w-6 h-6 text-purple-600 mr-3" />
          IMS/SIP Analysis
        </h1>
        <p className="text-gray-600 mt-2">IP Multimedia Subsystem and Session Initiation Protocol Analysis</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total SIP Messages</h3>
            <p className="text-3xl font-bold text-purple-600">{logs.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-green-600">
              {logs.filter((l) => l.message?.includes("INVITE")).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Registrations</h3>
            <p className="text-3xl font-bold text-blue-600">
              {logs.filter((l) => l.message?.includes("REGISTER")).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">IMS/SIP Messages</h3>
          </div>
          <div className="p-4">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No IMS/SIP messages available. Run a test case to see data.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-500">{log.timestamp}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          log.direction === "UL" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {log.direction || "N/A"}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{log.type || "SIP Message"}</div>
                    <div className="text-xs text-gray-600 mt-1">{log.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImsLayerView
