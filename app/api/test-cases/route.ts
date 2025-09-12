import { NextRequest, NextResponse } from 'next/server';
import { ComprehensiveTestCaseGenerator } from '@/lib/comprehensive-test-case-generator';

export async function GET(request: NextRequest) {
  try {
    const generator = ComprehensiveTestCaseGenerator.getInstance();
    const testCases = generator.generateComprehensiveTestCases();
    
    return NextResponse.json({
      success: true,
      data: testCases,
      count: testCases.length
    });
  } catch (error) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test cases' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCaseId, userId, config } = body;
    
    // This would typically start a test execution
    // For now, we'll return a mock response
    return NextResponse.json({
      success: true,
      executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Test execution started'
    });
  } catch (error) {
    console.error('Error starting test execution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start test execution' },
      { status: 500 }
    );
  }
}