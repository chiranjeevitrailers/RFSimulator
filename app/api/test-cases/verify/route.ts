import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Test Case Verification API
 * GET /api/test-cases/verify - Verify test cases exist and return real IDs
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin!;
    
    console.log('🔍 Verifying test cases in database...');
    
    // Get all test cases to see what actually exists
    const { data: allTestCases, error: allError } = await supabase
      .from('test_cases')
      .select('id, test_case_id, name, category, protocol, test_type')
      .limit(50);
    
    if (allError) {
      console.error('Error fetching all test cases:', allError);
      return NextResponse.json({ error: 'Database error', details: allError.message }, { status: 500 });
    }
    
    // Group by category
    const testCasesByCategory = (allTestCases || []).reduce((acc: any, tc) => {
      const category = tc.category || 'UNKNOWN';
      if (!acc[category]) acc[category] = [];
      acc[category].push({
        id: tc.id,
        test_case_id: tc.test_case_id,
        name: tc.name,
        protocol: tc.protocol,
        test_type: tc.test_type
      });
      return acc;
    }, {});
    
    // Test specific test case IDs
    const testIds = ['GCF-001', 'PTCRB-001', 'TC_5G_NR_INITIAL_ACCESS_001', 'TC_4G_LTE_ATTACH_001'];
    const verificationResults = {};
    
    for (const testId of testIds) {
      try {
        const { data: testCase, error: testError } = await supabase
          .from('test_cases')
          .select(`
            *,
            test_case_messages(id, message_name, layer, protocol, message_type),
            test_case_information_elements(id, ie_name, ie_type, ie_value),
            test_case_layer_parameters(id, layer, parameter_name, parameter_value)
          `)
          .or(`id.eq.${testId},test_case_id.eq.${testId}`)
          .single();
        
        (verificationResults as any)[testId] = {
          exists: !testError && !!testCase,
          error: testError?.message,
          data: testCase ? {
            id: testCase.id,
            name: testCase.name,
            category: testCase.category,
            messagesCount: testCase.test_case_messages?.length || 0,
            iesCount: testCase.test_case_information_elements?.length || 0,
            layerParamsCount: testCase.test_case_layer_parameters?.length || 0
          } : null
        };
      } catch (e) {
        (verificationResults as any)[testId] = {
          exists: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        };
      }
    }
    
    console.log('✅ Test case verification complete');
    
    return NextResponse.json({
      success: true,
      data: {
        totalTestCases: allTestCases?.length || 0,
        testCasesByCategory,
        verificationResults,
        categories: Object.keys(testCasesByCategory),
        sampleRealIds: Object.values(testCasesByCategory).flat().slice(0, 10).map((tc: any) => tc.test_case_id || tc.id)
      },
      message: 'Test case verification completed'
    });
    
  } catch (error) {
    console.error('❌ Test case verification error:', error);
    return NextResponse.json(
      { 
        error: 'Verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}