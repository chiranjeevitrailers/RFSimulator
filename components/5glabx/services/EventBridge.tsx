"use client"

import type React from "react"
import { useEffect } from "react"

/**
 * Event Bridge Service - Bridges Test Manager events to 5GLabX Platform
 * Fixes the event dispatch mismatch between Test Manager and Log Views
 */
export const EventBridge: React.FC = () => {
  useEffect(() => {
    console.log("[v0] 🔗 EventBridge: Initializing event bridge service...")

    const handleTestCaseExecutionStarted = (event: CustomEvent) => {
      console.log("[v0] 🔗 EventBridge: Received testCaseExecutionStarted event")
      console.log("[v0] 📊 EventBridge: Event detail:", {
        executionId: event.detail.executionId,
        testCaseId: event.detail.testCaseId,
        hasTestCaseData: !!event.detail.testCaseData,
        messageCount: event.detail.testCaseData?.expectedMessages?.length || 0,
      })

      try {
        const { testCaseId, testCaseData, executionId } = event.detail
        // Accept multiple shapes: expectedMessages (UI), realtimeMessages (UI), test_case_messages (DB)
        const messages =
          (testCaseData?.expectedMessages && Array.isArray(testCaseData.expectedMessages) && testCaseData.expectedMessages)
          || (testCaseData?.realtimeMessages && Array.isArray(testCaseData.realtimeMessages) && testCaseData.realtimeMessages)
          || (testCaseData?.test_case_messages && Array.isArray(testCaseData.test_case_messages) && testCaseData.test_case_messages)
          || []

        console.log("[v0] 🔗 EventBridge: Processing messages:", {
          messageCount: messages.length,
          hasExpectedMessages: !!testCaseData?.expectedMessages,
        })

        if (testCaseData && messages.length > 0) {
          console.log(`[v0] 🔗 EventBridge: Converting ${messages.length} messages to logs format`)

          const logs = messages.map((message: any, index: number) => ({
            id: `bridge-${testCaseId}-${index}-${Date.now()}`,
            timestamp: (Date.now() / 1000).toFixed(1),
            level: "I",
            component: message.layer || "RRC",
            message: `${message.messageName || message.message_type || message.messageType || "Message"}: ${JSON.stringify((message.messagePayload || message.message_payload || message.payload || {}), null, 2)}`,
            type: message.messageType || message.message_type || "TEST_MESSAGE",
            source: "TestManager",
            testCaseId: testCaseId,
            executionId: executionId,
            direction: message.direction || message.message_direction || "UL",
            protocol: message.protocol || "5G_NR",
            rawData: JSON.stringify((message.messagePayload || message.message_payload || message.payload || {}), null, 2),
            informationElements: message.informationElements || message.test_case_information_elements || {},
            layerParameters: message.layerParameters || message.test_case_layer_parameters || {},
            standardReference: message.standardReference || "Unknown",
            messagePayload: message.messagePayload || message.message_payload || message.payload || {},
            ies: (message.informationElements || message.test_case_information_elements)
              ? Object.entries(message.informationElements)
                  .map(([k, v]: [string, any]) => `${k}=${typeof v === "object" ? v.value || JSON.stringify(v) : v}`)
                  .join(", ")
              : Object.entries(message.messagePayload || message.message_payload || message.payload || {})
                  .map(([k, v]) => `${k}=${v}`)
                  .join(", "),
          }))

          console.log("[v0] 🔗 EventBridge: Dispatching immediate-logs-update event with", logs.length, "logs")

          setTimeout(() => {
            const immediateLogsEvent = new CustomEvent("immediate-logs-update", {
              detail: {
                logs: logs,
                source: "EventBridge",
                testCaseId: testCaseId,
                executionId: executionId,
                originalEvent: "testCaseExecutionStarted",
              },
            })

            window.dispatchEvent(immediateLogsEvent)
            console.log(`[v0] ✅ EventBridge: Dispatched immediate-logs-update with ${logs.length} logs`)
          }, 100) // 100ms delay to ensure listeners are ready
        } else {
          console.warn("[v0] ⚠️ EventBridge: No messages found in testCaseData")
        }
      } catch (error) {
        console.error("[v0] ❌ EventBridge: Error processing testCaseExecutionStarted event:", error)
      }
    }

    // Bridge 5GLABX_TEST_EXECUTION postMessage to immediate-logs-update
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "5GLABX_TEST_EXECUTION") {
        console.log("[v0] 🔗 EventBridge: Received 5GLABX_TEST_EXECUTION postMessage")
        console.log("[v0] 📊 EventBridge: PostMessage data:", {
          executionId: event.data.executionId,
          testCaseId: event.data.testCaseId,
          hasTestCaseData: !!event.data.testCaseData,
          messageCount:
            event.data.testCaseData?.expectedMessages?.length || event.data.testCaseData?.realtimeMessages?.length || 0,
        })

        // Add error handling
        try {
          const { testCaseId, testCaseData, executionId } = event.data

          // Handle both expectedMessages and realtimeMessages structures
          const messages = testCaseData?.expectedMessages || testCaseData?.realtimeMessages || []

          if (testCaseData && messages.length > 0) {
            console.log(`[v0] 🔗 EventBridge: Converting postMessage ${messages.length} messages to logs format`)

            // Convert messages to logs format (works with both expectedMessages and realtimeMessages)
            const logs = messages.map((message: any, index: number) => ({
              id: `bridge-post-${testCaseId}-${index}-${Date.now()}`,
              timestamp: (Date.now() / 1000).toFixed(1),
              level: "I",
              component: message.layer || "RRC",
              message: `${message.messageName || message.messageType}: ${JSON.stringify(message.messagePayload || {})}`,
              type: message.messageType || "TEST_MESSAGE",
              source: "PostMessage",
              testCaseId: testCaseId,
              executionId: executionId,
              direction: message.direction || "UL",
              protocol: message.protocol || "5G_NR",
              rawData: JSON.stringify(message.messagePayload || {}, null, 2),
              informationElements: message.informationElements || {},
              layerParameters: message.layerParameters || {},
              standardReference: message.standardReference || "Unknown",
              messagePayload: message.messagePayload || {},
              ies: message.informationElements
                ? Object.entries(message.informationElements)
                    .map(([k, v]: [string, any]) => `${k}=${typeof v === "object" ? v.value || JSON.stringify(v) : v}`)
                    .join(", ")
                : Object.entries(message.messagePayload || {})
                    .map(([k, v]) => `${k}=${v}`)
                    .join(", "),
            }))

            // Dispatch immediate-logs-update event
            const immediateLogsEvent = new CustomEvent("immediate-logs-update", {
              detail: {
                logs: logs,
                source: "EventBridge-PostMessage",
                testCaseId: testCaseId,
                executionId: executionId,
                originalEvent: "5GLABX_TEST_EXECUTION",
              },
            })

            window.dispatchEvent(immediateLogsEvent)
            console.log(
              `[v0] ✅ EventBridge: Dispatched immediate-logs-update from postMessage with ${logs.length} logs`,
            )
          }
        } catch (error) {
          console.error("[v0] ❌ EventBridge: Error processing postMessage event:", error)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("testCaseExecutionStarted", handleTestCaseExecutionStarted as EventListener)
      window.addEventListener("message", handlePostMessage)

      console.log("[v0] ✅ EventBridge: Event listeners registered")

      return () => {
        window.removeEventListener("testCaseExecutionStarted", handleTestCaseExecutionStarted as EventListener)
        window.removeEventListener("message", handlePostMessage)
        console.log("[v0] 🔗 EventBridge: Event listeners cleaned up")
      }
    }
  }, [])

  // This component doesn't render anything, it's just a service
  return null
}

export default EventBridge
