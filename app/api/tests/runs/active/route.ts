import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

/**
 * Get Active Test Execution
 * Returns the most recent running test execution if any
 */
export async function GET() {
  try {
    // Query for active/running test executions
    const { data: activeExecution, error } = await supabaseAdmin
      .from("test_executions")
      .select("*")
      .eq("status", "running")
      .order("start_time", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Error fetching active execution:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // No active execution found - this is normal
    if (!activeExecution) {
      return NextResponse.json({ 
        active: false,
        message: "No active test executions"
      }, { status: 200 })
    }

    // Return active execution
    return NextResponse.json({
      active: true,
      execution_id: activeExecution.id,
      test_case_id: activeExecution.test_case_id,
      test_case_name: activeExecution.current_message || 'Test Execution',
      status: activeExecution.status,
      start_time: activeExecution.start_time,
      progress_percentage: activeExecution.progress || 0,
      current_step: activeExecution.current_message,
    })
  } catch (error) {
    console.error("Unexpected error in active runs endpoint:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
