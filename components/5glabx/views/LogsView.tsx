"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Download, RefreshCw, Eye, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { createClient } from "@/lib/supabase"

const LogsView: React.FC<{
  appState: any
  onStateChange: (state: any) => void
}> = ({ appState, onStateChange }) => {
  const [logs, setLogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedComponent, setSelectedComponent] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [showDecoder, setShowDecoder] = useState(false)
  const [isReceivingData, setIsReceivingData] = useState(false)
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null)
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null)

  // Auto-reset receiving status after 5 seconds of inactivity
  useEffect(() => {
    if (isReceivingData && lastDataReceived) {
      const timeout = setTimeout(() => {
        setIsReceivingData(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isReceivingData, lastDataReceived])

  useEffect(() => {
    console.log("[v0] 🔥 LogsView: Setting up Supabase Realtime subscription...")

    let supabase: any = null
    try {
      supabase = createClient()
    } catch (e) {
      console.warn("[v0] ⚠️ LogsView: Supabase not configured, realtime disabled")
    }

    // Subscribe to decoded_messages table for real-time updates
    if (!supabase) {
      return () => {}
    }
    const channel = supabase
      .channel("decoded_messages_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "decoded_messages",
        },
        (payload) => {
          console.log("[v0] 📨 LogsView: Received real-time message from Supabase:", payload.new)

          const msg = payload.new as any

          // Normalize fields across schemas (enhanced vs legacy)
          const tsUs = msg.timestamp_us || (typeof msg.timestamp_ms === "number" ? msg.timestamp_ms * 1000 : undefined)
          const timestamp = tsUs ? (tsUs / 1_000_000).toFixed(1) : ((Date.now() / 1000).toFixed(1))
          const direction = msg.message_direction || msg.direction || "UL"
          const payloadData = msg.decoded_data || msg.message_payload || {}

          // Normalize IEs (object or array)
          let informationElements: any = msg.information_elements || msg.decoded_information_elements || {}
          if (Array.isArray(informationElements)) {
            informationElements = informationElements.reduce((acc: any, ie: any, idx: number) => {
              const key = ie.ie_name || ie.name || `IE_${idx + 1}`
              acc[key] = {
                type: ie.ie_type || ie.type,
                value: ie.ie_value ?? ie.value,
                presence: ie.presence,
                reference: ie.standard_reference || ie.reference,
                range: ie.range,
                criticality: ie.criticality,
              }
              return acc
            }, {})
          }

          // Normalize Layer Parameters
          let layerParameters: any = msg.layer_parameters || msg.decoded_layer_parameters || {}
          if (Array.isArray(layerParameters)) {
            layerParameters = layerParameters.reduce((acc: any, p: any) => {
              const key = p.parameter_name || p.name
              acc[key] = { value: p.parameter_value ?? p.value, unit: p.parameter_unit ?? p.unit, reference: p.standard_reference }
              return acc
            }, {})
          }

          const newLog = {
            id: msg.message_id || msg.id,
            timestamp,
            level: "I",
            component: msg.layer || "TEST",
            message: `${msg.message_name || msg.message_type}: ${JSON.stringify(payloadData, null, 2)}`,
            type: msg.message_type || "TEST_MESSAGE",
            source: "Supabase Realtime",
            testCaseId: msg.test_case_id || msg.testCaseId,
            direction,
            protocol: msg.protocol || "5G_NR",
            rawData: JSON.stringify(payloadData, null, 2),
            informationElements,
            layerParameters,
            standardReference: msg.standard_reference || "Unknown",
            messagePayload: payloadData,
            ies: informationElements && typeof informationElements === "object"
              ? Object.entries(informationElements)
                  .map(([k, v]: [string, any]) => `${k}=${typeof v === "object" ? (v.value ?? JSON.stringify(v)) : String(v)}`)
                  .join(", ")
              : "",
          }

          setLogs((prev) => [...prev, newLog])
          setIsReceivingData(true)
          setLastDataReceived(new Date())

          console.log("[v0] ✅ LogsView: Added real-time message to logs")
        },
      )
      .subscribe((status) => {
        console.log("[v0] 📡 Supabase Realtime subscription status:", status)
      })

    return () => {
      console.log("[v0] 🔌 LogsView: Unsubscribing from Supabase Realtime")
      supabase.removeChannel(channel)
    }
  }, [])  // Remove activeExecutionId dependency to keep subscription alive

  // Listen for Test Manager data and integrate with 5GLabX log analysis
  useEffect(() => {
    console.log("[v0] 🔍 LogsView: Initializing event listeners IMMEDIATELY...")

    const handleImmediateLogsUpdate = (event: any) => {
      console.log("[v0] 🔥 LogsView: Received immediate-logs-update event")
      console.log("[v0] 📊 LogsView: Event detail:", {
        source: event.detail?.source,
        logCount: event.detail?.logs?.length || 0,
        testCaseId: event.detail?.testCaseId,
        executionId: event.detail?.executionId,
      })

      const { logs: incomingLogs, source } = event.detail

      if (incomingLogs && incomingLogs.length > 0) {
        console.log(`[v0] 📋 LogsView: Processing ${incomingLogs.length} immediate logs from ${source}`)

        setLogs((prevLogs) => {
          const newLogs = [...prevLogs, ...incomingLogs]
          console.log(
            `[v0] ✅ LogsView: Updated logs state - Previous: ${prevLogs.length}, Added: ${incomingLogs.length}, Total: ${newLogs.length}`,
          )
          return newLogs
        })

        // Update receiving status
        setIsReceivingData(true)
        setLastDataReceived(new Date())

        // Notify parent component
        if (onStateChange) {
          onStateChange({
            currentView: "logs",
            testExecutionActive: true,
            testExecutionStatus: "active",
            logs: incomingLogs,
          })
        }
      } else {
        console.log("[v0] ⚠️ LogsView: No logs found in immediate-logs-update event")
      }
    }

    window.addEventListener("immediate-logs-update", handleImmediateLogsUpdate)
    console.log("[v0] ✅ LogsView: immediate-logs-update listener registered IMMEDIATELY")

    return () => {
      window.removeEventListener("immediate-logs-update", handleImmediateLogsUpdate)
      console.log("[v0] 🔗 LogsView: Event listeners cleaned up")
    }
  }, [onStateChange]) // Added onStateChange to dependency array

  // Listen for the regular 5GLABX_TEST_EXECUTION event
  useEffect(() => {
    console.log("🔥 LogsView: Setting up 5GLABX_TEST_EXECUTION event listener")

    const handleTestExecution = (event) => {
      console.log("🔥 LogsView: Received 5GLABX_TEST_EXECUTION event:", event.detail)
      console.log("📊 Event detail structure:", JSON.stringify(event.detail, null, 2))

      const { testCaseId, testCaseData, logs, executionId } = event.detail

      if (executionId) {
        console.log("[v0] 🎯 LogsView: Setting active execution ID:", executionId)
        setActiveExecutionId(executionId)
      }

      if (logs && logs.length > 0) {
        console.log(`📋 LogsView: Processing ${logs.length} logs from event`)
        console.log("📊 Log data structure:", JSON.stringify(logs[0], null, 2))

        // Normal state update
        setLogs((prev) => {
          const newLogs = [...prev, ...logs]
          return newLogs
        })

        setIsReceivingData(true)
        setLastDataReceived(new Date())
      } else if (testCaseData && (testCaseData.expectedMessages || testCaseData.realtimeMessages)) {
        console.log("🔥 LogsView: Processing testCaseData from 5GLABX_TEST_EXECUTION event")

        // Process the test case data directly - handle both expectedMessages and realtimeMessages
        const messages = testCaseData.expectedMessages || testCaseData.realtimeMessages || []
        console.log(`📋 Processing ${messages.length} messages from testCaseData`)

        const processedLogs = messages.map((message, index) => ({
          id: message.id || `event-${testCaseId}-${Date.now()}-${index}`,
          timestamp: (message.timestampMs / 1000).toFixed(1) || (Date.now() / 1000).toFixed(1),
          level: "I",
          component: message.layer || message.component || "TEST",
          message: `${message.messageName || message.messageType || "Test Message"}: ${JSON.stringify(message.messagePayload || {}, null, 2)}`,
          type: message.messageType || message.type || "TEST_MESSAGE",
          source: "5GLABX_TEST_EXECUTION",
          testCaseId: testCaseId,
          direction: message.direction || "UL",
          protocol: message.protocol || "5G_NR",
          rawData: JSON.stringify(message.messagePayload || message.payload || {}, null, 2),
          informationElements: message.informationElements || {},
          layerParameters: message.layerParameters || {},
          standardReference: message.standardReference || "Unknown",
          messagePayload: message.messagePayload || message.payload || {},
          ies: message.informationElements
            ? Object.entries(message.informationElements)
                .map(([k, v]) => `${k}=${typeof v === "object" ? v.value || JSON.stringify(v) : v}`)
                .join(", ")
            : Object.entries(message.messagePayload || message.payload || {})
                .map(([k, v]) => `${k}=${v}`)
                .join(", "),
        }))

        console.log(`✅ LogsView: Processed ${processedLogs.length} log entries from testCaseData`)

        // FORCE DISPLAY ATTEMPT 1
        setLogs((prev) => {
          const newLogs = [...prev, ...processedLogs]
          console.log(`✅ LogsView: Added ${processedLogs.length} log entries from testCaseData`)
          return newLogs
        })

        setIsReceivingData(true)
        setLastDataReceived(new Date())

        // FORCE DISPLAY ATTEMPT 2
        setTimeout(() => {
          setLogs((current) => [...current])
        }, 50)

        // FORCE DISPLAY ATTEMPT 3
        setTimeout(() => {
          if (onStateChange) {
            onStateChange({
              currentView: "logs",
              testExecutionActive: true,
              testExecutionStatus: "active",
              logs: processedLogs,
            })
          }
        }, 100)
      } else {
        console.log("⚠️  No logs or testCaseData found in 5GLABX_TEST_EXECUTION event:", event.detail)

        // Try to extract data from any format
        if (event.detail && typeof event.detail === "object") {
          console.log("🔍 Attempting to extract data from event detail...")
          console.log("📊 Event detail keys:", Object.keys(event.detail))

          if (event.detail.testCaseData) {
            console.log("🔍 Found testCaseData in event detail")
          }
        }
      }
    }

    window.addEventListener("5GLABX_TEST_EXECUTION", handleTestExecution)

    console.log("🔥 Enhanced Logs Advanced: Listening for 5GLABX_TEST_EXECUTION events")

    return () => {
      window.removeEventListener("5GLABX_TEST_EXECUTION", handleTestExecution)
    }
  }, [])

  // Process test data from various sources
  useEffect(() => {
    console.log("📡 LogsView: Setting up comprehensive event listeners...")

    const handleMessageEvent = (event: MessageEvent) => {
      console.log("📨 LogsView received message event:", event.data)
      console.log("📨 Event origin:", event.origin)
      console.log("📨 Event source:", event.source)

      if (event.data && event.data.type === "5GLABX_TEST_EXECUTION") {
        console.log("📊 LogsView: Processing 5GLABX_TEST_EXECUTION message")
        console.log("📊 Message details:", {
          testCaseId: event.data.testCaseId,
          runId: event.data.runId,
          hasTestCaseData: !!event.data.testCaseData,
          messageCount:
            event.data.testCaseData?.expectedMessages?.length || event.data.testCaseData?.realtimeMessages?.length || 0,
          dataKeys: Object.keys(event.data),
        })
        processTestData(event.data, "PostMessage")
      } else if (event.data && event.data.testCaseId) {
        console.log("📊 LogsView: Processing test case data from PostMessage")
        processTestData(event.data, "PostMessage")
      }
    }

    const handleCustomEvent = (event: CustomEvent) => {
      console.log("📨 LogsView received custom event:", event.type, event.detail)
      console.log("📨 Custom event detail keys:", Object.keys(event.detail || {}))

      if (event.type === "5GLABX_TEST_EXECUTION") {
        console.log("📊 LogsView: Processing 5GLABX_TEST_EXECUTION custom event")
        processTestData(event.detail, "CustomEvent")
      } else if (event.type === "testCaseExecutionStarted") {
        console.log("📊 LogsView: Processing testCaseExecutionStarted event")
        console.log("📊 Event detail:", JSON.stringify(event.detail, null, 2))
        processTestData(event.detail, "TestExecutionStarted")
      } else if (event.type === "5glabxLogAnalysis") {
        console.log("📊 LogsView: Processing 5glabxLogAnalysis event")
        processTestData(event.detail, "LogAnalysis")
      } else if (event.type === "5glabx-test-execution-start") {
        console.log("📊 LogsView: Test execution starting")
        onStateChange({
          currentView: "logs",
          testExecutionActive: true,
          testExecutionStatus: "starting",
        })
      } else if (event.type === "5glabx-test-execution-data") {
        console.log("📊 LogsView: Processing test execution data")
        console.log("📊 Event detail data:", JSON.stringify(event.detail, null, 2))
        processTestData(event.detail, "GlobalEvent")
      } else if (event.type === "5glabx-test-execution-complete") {
        console.log("📊 LogsView: Test execution completed")
        onStateChange({
          testExecutionActive: false,
          testExecutionStatus: "completed",
        })
      } else {
        console.log("📊 LogsView: Unknown custom event type:", event.type)
        // Try to process any event with test case data
        if (event.detail && event.detail.testCaseId) {
          console.log("📊 Processing unknown event with test case data")
          processTestData(event.detail, `CustomEvent-${event.type}`)
        }
      }
    }

    // Listen for all possible event types from test execution system
    window.addEventListener("message", handleMessageEvent)
    window.addEventListener("5GLABX_TEST_EXECUTION", handleCustomEvent as EventListener)
    window.addEventListener("testCaseExecutionStarted", handleCustomEvent as EventListener)
    window.addEventListener("5glabxLogAnalysis", handleCustomEvent as EventListener)
    window.addEventListener("5glabx-test-execution-start", handleCustomEvent as EventListener)
    window.addEventListener("5glabx-test-execution-data", handleCustomEvent as EventListener)
    window.addEventListener("5glabx-test-execution-complete", handleCustomEvent as EventListener)

    // Legacy event listeners
    window.addEventListener("logsViewUpdate", handleDirectLogUpdate as EventListener)

    console.log("✅ LogsView: All event listeners registered for Test Manager integration")

    // Check for TestCasePlaybackService availability
    checkTestCasePlaybackService()

    // Also set up integration with FiveGLabXDataReceiver if available
    if (window.FiveGLabXDataReceiver) {
      console.log("📡 LogsView: Connected to FiveGLabXDataReceiver")

      // Override the receiver methods to process data
      const originalOnTestExecutionData = window.FiveGLabXDataReceiver.onTestExecutionData
      window.FiveGLabXDataReceiver.onTestExecutionData = (data) => {
        console.log("📊 LogsView: Received data via FiveGLabXDataReceiver")
        console.log("📊 FiveGLabXDataReceiver data:", JSON.stringify(data, null, 2))
        processTestData(data, "FiveGLabXDataReceiver")
        if (originalOnTestExecutionData) {
          originalOnTestExecutionData(data)
        }
      }
    }

    // Removed global data injection - system now only processes real data through normal events
    // Removed direct data bridge - system now only processes real data through normal events

    return () => {
      window.removeEventListener("message", handleMessageEvent)
      window.removeEventListener("5GLABX_TEST_EXECUTION", handleCustomEvent as EventListener)
      window.removeEventListener("testCaseExecutionStarted", handleCustomEvent as EventListener)
      window.removeEventListener("5glabxLogAnalysis", handleCustomEvent as EventListener)
      window.removeEventListener("5glabx-test-execution-start", handleCustomEvent as EventListener)
      window.removeEventListener("5glabx-test-execution-data", handleCustomEvent as EventListener)
      window.removeEventListener("5glabx-test-execution-complete", handleCustomEvent as EventListener)
      window.removeEventListener("logsViewUpdate", handleDirectLogUpdate as EventListener)
    }
  }, [])

  const processTestData = (data: any, source = "unknown") => {
    console.log("📊 LogsView processing test case data:", {
      testCaseId: data.testCaseId,
      testCaseName: data.testCaseData?.testCase?.name || data.testCaseData?.name,
      messageCount: data.testCaseData?.expectedMessages?.length || data.testCaseData?.realtimeMessages?.length || 0,
      dataSource: source,
      dataType: data.type,
      hasTestCaseData: !!data.testCaseData,
      hasExpectedMessages: !!data.testCaseData?.expectedMessages,
      dataKeys: Object.keys(data),
      fullData: JSON.stringify(data, null, 2),
    })

    // Force immediate UI update for real-time display
    console.log("🚀 LogsView: Processing data immediately for display")

    // Process data through normal flow

    // Require real testCaseData; do not synthesize logs
    if (!data.testCaseData) return

    const testCaseData = data.testCaseData || data
    const testCaseId = data.testCaseId || testCaseData.testCaseId

    // Handle different data formats
    let messages = []
    if (testCaseData.expectedMessages) {
      messages = testCaseData.expectedMessages
    } else if (testCaseData.realtimeMessages) {
      messages = testCaseData.realtimeMessages
    } else if (testCaseData.messages) {
      messages = testCaseData.messages
    } else if (Array.isArray(testCaseData)) {
      messages = testCaseData
    }

    if (messages.length > 0) {
      console.log(`📋 Processing ${messages.length} messages from ${source}`)

      // Process each message as a log entry immediately (no setTimeout to ensure immediate display)
      messages.forEach((message: any, index: number) => {
        const newLog = {
          id: `test-${testCaseId}-${Date.now()}-${index}`,
          timestamp: (Date.now() / 1000).toFixed(1),
          level: "I",
          component: message.layer || message.component || "TEST",
          message: `${message.messageName || message.messageType || "Test Message"}: ${JSON.stringify(message.messagePayload || message.payload || {}, null, 2)}`,
          type: message.messageType || message.type || "TEST_MESSAGE",
          source: source || "TestManager",
          testCaseId: testCaseId,
          direction: message.direction || "UL",
          protocol: message.protocol || "5G_NR",
          // Enhanced data for IE viewing
          rawData: JSON.stringify(message.messagePayload || message.payload || {}, null, 2),
          informationElements: message.informationElements || {},
          layerParameters: message.layerParameters || {},
          standardReference: message.standardReference || "Unknown",
          messagePayload: message.messagePayload || message.payload || {},
          ies: message.informationElements
            ? Object.entries(message.informationElements)
                .map(([k, v]: [string, any]) => `${k}=${typeof v === "object" ? v.value || JSON.stringify(v) : v}`)
                .join(", ")
            : Object.entries(message.messagePayload || message.payload || {})
                .map(([k, v]) => `${k}=${v}`)
                .join(", "),
        }

        setLogs((prev) => {
          const newLogs = [...prev, newLog]
          return newLogs
        })
      })

      // Update receiving status
      setIsReceivingData(true)
      setLastDataReceived(new Date())

      console.log(`✅ Processed ${messages.length} messages, logs count now: ${logs.length + messages.length}`)

      // Normal state update - no forced updates needed

      // Also trigger state change in parent component
      setTimeout(() => {
        onStateChange({
          currentView: "logs",
          testExecutionActive: true,
          testExecutionStatus: "active",
          logs: logs.concat(
            messages.map((msg, idx) => ({
              id: `test-${testCaseId}-${Date.now()}-${idx}`,
              timestamp: (Date.now() / 1000).toFixed(1),
              level: "I",
              component: msg.layer || "TEST",
              message: `${msg.messageName || msg.messageType}: ${JSON.stringify(msg.messagePayload || {}, null, 2)}`,
              type: msg.messageType || "TEST_MESSAGE",
              source: source || "TestManager",
            })),
          ),
        })
      }, 300)
    } else {
      console.log("⚠️  No messages found in test data, checking alternative formats...")

      // Try to extract data from different formats
      if (testCaseData && typeof testCaseData === "object") {
        console.log("📋 Test case data structure:", Object.keys(testCaseData))
      }

      // Removed direct injection bypass - system now only processes real data through normal flow

      // If no messages but we have test case data, create a summary log
      if (testCaseData && (testCaseData.name || testCaseData.testCaseName)) {
        console.log("📋 Creating summary log entry for test case")
        const summaryLog = {
          id: `test-summary-${testCaseId}-${Date.now()}`,
          timestamp: (Date.now() / 1000).toFixed(1),
          level: "I",
          component: "TEST",
          message: `Test Case Started: ${testCaseData.name || testCaseData.testCaseName} (${testCaseId})`,
          type: "TEST_EXECUTION_START",
          source: source || "TestManager",
          testCaseId: testCaseId,
          direction: "N/A",
          protocol: testCaseData.protocol || "5G_NR",
          rawData: JSON.stringify(testCaseData, null, 2),
          informationElements: {},
          layerParameters: {},
          standardReference: "Test Execution",
        }

        setLogs((prev) => {
          const newLogs = [...prev, summaryLog]
          console.log("✅ Added summary log entry:", summaryLog.message)
          return newLogs
        })

        // Update receiving status
        setIsReceivingData(true)
        setLastDataReceived(new Date())

        // Force UI updates for summary log too
        setTimeout(() => {
          setLogs((current) => [...current])
        }, 50)
      }
    }
  }

  // Direct log updates
  const handleDirectLogUpdate = (event: CustomEvent) => {
    console.log("📊 LogsView: Direct log update received:", event.detail)
    const logData = event.detail

    const newLog = {
      id: logData.id || Date.now(),
      timestamp: logData.timestamp || (Date.now() / 1000).toFixed(1),
      level: logData.level || "I",
      component: logData.component || logData.layer || "TEST",
      message: logData.message || `${logData.messageType}: ${JSON.stringify(logData.payload || {})}`,
      type: logData.messageType || logData.type || "DATA",
      source: "TestManager",
    }

    setLogs((prev) => {
      const newLogs = [...prev.slice(-99), newLog]
      return newLogs
    })
  }

  // Check for TestCasePlaybackService availability (optional - don't retry)
  const checkTestCasePlaybackService = () => {
    if (window.TestCasePlaybackService) {
      console.log("✅ TestCasePlaybackService is available")
      console.log("📊 LogsView: TestCasePlaybackService integration ready")
    } else {
      console.log("ℹ️  TestCasePlaybackService not available - using Supabase Realtime instead")
      // Don't retry - use Supabase Realtime as primary data source
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesComponent = selectedComponent === "all" || log.component === selectedComponent

    return matchesSearch && matchesLevel && matchesComponent
  })

  // Clean system - no debug logging interference

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "E":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "W":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "I":
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "E":
        return "bg-red-100 text-red-800"
      case "W":
        return "bg-yellow-100 text-yellow-800"
      case "I":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  // Decode message function (like Enhanced Logs)
  const decodeMessage = (log: any) => {
    setSelectedMessage(log)
    setShowDecoder(true)
  }

  return (
    <div className="p-6 space-y-6" data-component="LogsView">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Logs Viewer</h1>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="E">Error</option>
            <option value="W">Warning</option>
            <option value="I">Info</option>
          </select>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Components</option>
            <option value="PHY">PHY</option>
            <option value="MAC">MAC</option>
            <option value="RLC">RLC</option>
            <option value="SCHED">SCHED</option>
          </select>
        </div>
      </div>

      {/* Data Reception Status Indicator */}
      <div className="bg-white p-4 rounded-lg border mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isReceivingData ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-3 h-3 rounded-full ${isReceivingData ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
              ></div>
              <span className="text-sm font-medium">
                {isReceivingData ? "🟢 Receiving Real-Time Data" : "⚪ Waiting for Data"}
              </span>
            </div>
            {lastDataReceived && (
              <span className="text-xs text-gray-500">Last update: {lastDataReceived.toLocaleTimeString()}</span>
            )}
            {logs.length > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">{logs.length} messages loaded</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Removed test buttons - system now only handles real test data */}
            {/* System only handles real test data from Supabase database */}
            <button
              onClick={() => {
                setLogs([])
                setIsReceivingData(false)
                setLastDataReceived(null)
                setActiveExecutionId(null) // Clear active execution ID on clear logs
              }}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full ${isReceivingData ? "bg-green-100 animate-pulse" : "bg-gray-100"} flex items-center justify-center mb-4`}
                      >
                        {isReceivingData ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-2">
                        {isReceivingData ? "🎯 Waiting for test execution data..." : "📭 No logs available"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {isReceivingData
                          ? "Run a test case to see live data streaming here"
                          : "Start a test execution to populate this view with real-time data"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                        <span className="ml-1">{log.level}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.component}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{log.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => decodeMessage(log)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                        title="View Information Elements (IEs)"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Errors: {logs.filter((l) => l.level === "E").length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Warnings: {logs.filter((l) => l.level === "W").length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Info: {logs.filter((l) => l.level === "I").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wireshark-style Decoder Modal */}
      {showDecoder && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  📊 Message Decoder - {selectedMessage.type} ({selectedMessage.component})
                </h3>
                <button onClick={() => setShowDecoder(false)} className="text-gray-500 hover:text-gray-700 p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Message Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Message Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Timestamp:</span>
                        <span className="font-mono">{selectedMessage.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Layer:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {selectedMessage.component}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Message Type:</span>
                        <span className="font-mono">{selectedMessage.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Direction:</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            selectedMessage.direction === "UL"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedMessage.direction || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Protocol:</span>
                        <span className="font-mono">{selectedMessage.protocol || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Standard:</span>
                        <span className="text-blue-600 text-xs">{selectedMessage.standardReference || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🔍 Information Elements (IEs)</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      {selectedMessage.informationElements &&
                      Object.keys(selectedMessage.informationElements).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(selectedMessage.informationElements).map(
                            ([ieName, ieData]: [string, any]) => (
                              <div key={ieName} className="border-l-4 border-blue-500 pl-3">
                                <div className="font-medium text-gray-900">{ieName}</div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  {ieData.type && (
                                    <div>
                                      <span className="font-medium">Type:</span> {ieData.type}
                                    </div>
                                  )}
                                  {ieData.value !== undefined && (
                                    <div>
                                      <span className="font-medium">Value:</span>
                                      <span className="font-mono ml-1">
                                        {typeof ieData.value === "object"
                                          ? JSON.stringify(ieData.value)
                                          : String(ieData.value)}
                                      </span>
                                    </div>
                                  )}
                                  {ieData.presence && (
                                    <div>
                                      <span className="font-medium">Presence:</span>
                                      <span
                                        className={`ml-1 px-1 py-0.5 rounded text-xs ${
                                          ieData.presence === "mandatory"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {ieData.presence}
                                      </span>
                                    </div>
                                  )}
                                  {ieData.criticality && (
                                    <div>
                                      <span className="font-medium">Criticality:</span>
                                      <span className="ml-1 text-orange-600">{ieData.criticality}</span>
                                    </div>
                                  )}
                                  {ieData.reference && (
                                    <div>
                                      <span className="font-medium">Reference:</span>
                                      <span className="ml-1 text-blue-600 text-xs">{ieData.reference}</span>
                                    </div>
                                  )}
                                  {ieData.range && (
                                    <div>
                                      <span className="font-medium">Range:</span>
                                      <span className="ml-1 font-mono text-xs">{ieData.range}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <div className="text-sm">No structured Information Elements available</div>
                          <div className="text-xs mt-1">Raw IEs: {selectedMessage.ies || "None"}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Raw Data and Layer Parameters */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📦 Raw Message Data</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {selectedMessage.rawData || JSON.stringify(selectedMessage.messagePayload || {}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">⚙️ Layer Parameters</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      {selectedMessage.layerParameters && Object.keys(selectedMessage.layerParameters).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(selectedMessage.layerParameters).map(
                            ([paramName, paramData]: [string, any]) => (
                              <div key={paramName} className="border-l-4 border-green-500 pl-3">
                                <div className="font-medium text-gray-900">{paramName}</div>
                                <div className="text-sm text-gray-600">
                                  {paramData.value !== undefined && (
                                    <div>
                                      <span className="font-medium">Value:</span>
                                      <span className="font-mono ml-1">
                                        {paramData.value} {paramData.unit && `${paramData.unit}`}
                                      </span>
                                    </div>
                                  )}
                                  {paramData.range && (
                                    <div>
                                      <span className="font-medium">Range:</span>
                                      <span className="ml-1 font-mono text-xs">{paramData.range}</span>
                                    </div>
                                  )}
                                  {paramData.reference && (
                                    <div>
                                      <span className="font-medium">Reference:</span>
                                      <span className="ml-1 text-blue-600 text-xs">{paramData.reference}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4 text-sm">No layer parameters available</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Message Summary</h4>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Source:</span> {selectedMessage.source}
                        </div>
                        <div>
                          <span className="font-medium">Test Case:</span> {selectedMessage.testCaseId || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Message:</span> {selectedMessage.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDecoder(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogsView
