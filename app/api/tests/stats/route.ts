import { NextRequest, NextResponse } from 'next/server';

// Required for static export
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get total test counts
    const { count: totalTests } = await supabase
      .from('test_cases')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    const { count: premiumTests } = await supabase
      .from('test_cases')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_premium', true);
    
    // Get protocol distribution
    const { data: protocolData } = await supabase
      .from('test_cases')
      .select('category')
      .eq('is_active', true);
    
    const protocolCounts = protocolData?.reduce((acc: any, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Get test type distribution
    const { data: testTypeData } = await supabase
      .from('test_cases')
      .select('test_type')
      .eq('is_active', true);
    
    const testTypeCounts = testTypeData?.reduce((acc: any, item) => {
      acc[item.test_type] = (acc[item.test_type] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Get recent runs and success rate
    const { data: recentRuns } = await supabase
      .from('test_case_executions')
      .select('status')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days
    
    const recentRunsCount = recentRuns?.length || 0;
    const successfulRuns = recentRuns?.filter(run => run.status === 'completed').length || 0;
    const successRate = recentRunsCount > 0 ? (successfulRuns / recentRunsCount) * 100 : 0;
    
    return NextResponse.json({
      total_tests: totalTests || 0,
      available_tests: totalTests || 0,
      premium_tests: premiumTests || 0,
      protocols: {
        '5G_NR': protocolCounts['5G_NR'] || 0,
        '4G_LTE': protocolCounts['4G_LTE'] || 0,
        'IMS_SIP': protocolCounts['IMS_SIP'] || 0,
        'O_RAN': protocolCounts['O_RAN'] || 0,
        'NB_IoT': protocolCounts['NB_IoT'] || 0,
        'V2X': protocolCounts['V2X'] || 0,
        'NTN': protocolCounts['NTN'] || 0
      },
      test_types: {
        functional: testTypeCounts['functional'] || 0,
        performance: testTypeCounts['performance'] || 0,
        stability: testTypeCounts['stability'] || 0,
        stress: testTypeCounts['stress'] || 0,
        interoperability: testTypeCounts['interoperability'] || 0,
        security: testTypeCounts['security'] || 0,
        mobility: testTypeCounts['mobility'] || 0,
        conformance: testTypeCounts['conformance'] || 0
      },
      recent_runs: recentRunsCount,
      success_rate: successRate
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}