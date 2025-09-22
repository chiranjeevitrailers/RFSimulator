import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Simple Test Execution API - Works with basic test_cases table data
 * GET /api/test-execution/simple?testCaseId=uuid
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId is required' },
        { status: 400 }
      );
    }

    // Use service role key to bypass RLS policies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log(`🔍 Simple execution fetch for test case: ${testCaseId}`);

    // Fetch basic test case data without complex joins
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .select('*')
      .or(`id.eq.${testCaseId},test_case_id.eq.${testCaseId}`)
      .single();

    if (testCaseError || !testCase) {
      console.error('Test case fetch error:', testCaseError);
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    // Create comprehensive data structure from basic test case
    const comprehensiveData = {
      // Test case definition
      testCase: {
        id: testCase.id,
        name: testCase.name,
        description: testCase.description,
        protocol: testCase.protocol,
        category: testCase.category,
        test_type: testCase.test_type,
        complexity: testCase.complexity,
        priority: testCase.priority,
        tags: testCase.tags || [],
        duration_seconds: testCase.duration_seconds
      },

      // Generate expected messages from test_steps if available
      expectedMessages: testCase.test_steps ? 
        (Array.isArray(testCase.test_steps) ? testCase.test_steps : JSON.parse(testCase.test_steps || '[]'))
          .map((step: any, index: number) => ({
            id: `msg_${index}`,
            stepOrder: step.step || index + 1,
            timestampMs: (step.duration_ms || 1000) * index,
            direction: index % 2 === 0 ? 'UL' : 'DL',
            layer: step.layer || 'RRC',
            protocol: testCase.protocol || '5G_NR',
            messageType: step.description?.split(' ')[0] || 'Message',
            messageName: step.description || `Step ${index + 1}`,
            messageDescription: step.description,
            messagePayload: step.values || { step: index + 1 }
          })) : [
            {
              id: 'msg_1',
              stepOrder: 1,
              timestampMs: 1000,
              direction: 'UL',
              layer: 'RRC',
              protocol: testCase.protocol || '5G_NR',
              messageType: 'RRCSetupRequest',
              messageName: 'RRC Setup Request',
              messageDescription: 'Initial RRC setup request',
              messagePayload: { ue_identity: '0x12345678' }
            },
            {
              id: 'msg_2',
              stepOrder: 2,
              timestampMs: 2000,
              direction: 'DL',
              layer: 'RRC',
              protocol: testCase.protocol || '5G_NR',
              messageType: 'RRCSetup',
              messageName: 'RRC Setup',
              messageDescription: 'RRC setup response',
              messagePayload: { rrc_transaction_id: 1 }
            }
          ],

      // Generate expected IEs
      expectedInformationElements: [
        {
          id: 'ie_1',
          ieName: 'UE-Identity',
          ieType: 'MANDATORY',
          ieValue: '0x12345678',
          ieSize: 32,
          mandatory: true
        },
        {
          id: 'ie_2',
          ieName: 'Transaction-ID',
          ieType: 'MANDATORY',
          ieValue: '1',
          ieSize: 8,
          mandatory: true
        }
      ],

      // Generate expected layer parameters
      expectedLayerParameters: [
        {
          id: 'param_1',
          layer: 'RRC',
          parameterName: 'TransactionID',
          parameterType: 'CONFIG',
          parameterValue: 1,
          parameterUnit: 'integer'
        },
        {
          id: 'param_2',
          layer: 'PHY',
          parameterName: 'RSRP',
          parameterType: 'MEASUREMENT',
          parameterValue: -85,
          parameterUnit: 'dBm'
        }
      ],

      // Summary for simulation
      simulation: {
        testCaseId: testCase.id,
        totalExpectedMessages: testCase.test_steps ? 
          (Array.isArray(testCase.test_steps) ? testCase.test_steps.length : JSON.parse(testCase.test_steps || '[]').length) : 2,
        layers: ['PHY', 'MAC', 'RRC', 'NAS'],
        protocols: [testCase.protocol || '5G_NR'],
        status: 'ready',
        complianceScore: 100
      }
    };

    console.log(`✅ Simple execution data created for: ${testCase.name}`);
    console.log(`   Expected Messages: ${comprehensiveData.expectedMessages.length}`);
    console.log(`   Expected IEs: ${comprehensiveData.expectedInformationElements.length}`);
    console.log(`   Expected Layer Params: ${comprehensiveData.expectedLayerParameters.length}`);

    return NextResponse.json({
      success: true,
      data: comprehensiveData,
      message: 'Simple test case execution data created successfully'
    });

  } catch (error) {
    console.error('❌ Simple execution API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}