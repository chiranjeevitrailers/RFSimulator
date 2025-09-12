import { NextRequest, NextResponse } from 'next/server';
import { RealTimeTestExecutionEngine } from '@/lib/real-time-test-execution-engine';

export async function GET(request: NextRequest) {
  try {
    const engine = RealTimeTestExecutionEngine.getInstance();
    const executions = engine.getAllExecutions();
    
    return NextResponse.json({
      success: true,
      data: executions,
      count: executions.length
    });
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCaseId, userId, config } = body;
    
    const engine = RealTimeTestExecutionEngine.getInstance();
    const executionId = await engine.startRealTimeExecution({
      testCaseId,
      userId,
      executionMode: config?.executionMode || 'simulation',
      timeAcceleration: config?.timeAcceleration || 1,
      logLevel: config?.logLevel || 'detailed',
      captureMode: config?.captureMode || 'full',
      enableProtocolAnalyzer: config?.enableProtocolAnalyzer || true,
      enableLayerStatistics: config?.enableLayerStatistics || true,
      enablePerformanceMetrics: config?.enablePerformanceMetrics || true
    });
    
    return NextResponse.json({
      success: true,
      executionId,
      message: 'Test execution started successfully'
    });
  } catch (error) {
    console.error('Error starting test execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start test execution' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const executionId = searchParams.get('executionId');
    
    if (!executionId) {
      return NextResponse.json(
        { success: false, error: 'Execution ID is required' },
        { status: 400 }
      );
    }
    
    const engine = RealTimeTestExecutionEngine.getInstance();
    engine.stopExecution(executionId);
    
    return NextResponse.json({
      success: true,
      message: 'Test execution stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping test execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to stop test execution' },
      { status: 500 }
    );
  }
}