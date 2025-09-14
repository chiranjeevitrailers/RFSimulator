import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const protocol = searchParams.get('protocol');
    const test_type = searchParams.get('test_type');
    const complexity = searchParams.get('complexity');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const is_premium = searchParams.get('is_premium');
    
    // Build query
    let query = supabase
      .from('test_cases')
      .select('*', { count: 'exact' })
      .eq('is_active', true);
    
    // Apply filters
    if (protocol && protocol !== 'all') {
      query = query.eq('category', protocol);
    }
    
    if (test_type && test_type !== 'all') {
      query = query.eq('test_type', test_type);
    }
    
    if (complexity && complexity !== 'all') {
      query = query.eq('complexity', complexity);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,test_case_id.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (tags) {
      const tagArray = tags.split(',');
      query = query.overlaps('tags', tagArray);
    }
    
    if (is_premium === 'true') {
      query = query.eq('is_premium', true);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    // Execute query
    const { data: tests, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
    }
    
    // Get filter options
    const { data: protocols } = await supabase
      .from('test_cases')
      .select('category')
      .eq('is_active', true);
    
    const { data: testTypes } = await supabase
      .from('test_cases')
      .select('test_type')
      .eq('is_active', true);
    
    const { data: complexities } = await supabase
      .from('test_cases')
      .select('complexity')
      .eq('is_active', true);
    
    // Count by protocol
    const protocolCounts = protocols?.reduce((acc: any, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Count by test type
    const testTypeCounts = testTypes?.reduce((acc: any, item) => {
      acc[item.test_type] = (acc[item.test_type] || 0) + 1;
      return acc;
    }, {}) || {};
    
    // Count by complexity
    const complexityCounts = complexities?.reduce((acc: any, item) => {
      acc[item.complexity] = (acc[item.complexity] || 0) + 1;
      return acc;
    }, {}) || {};
    
    const totalPages = Math.ceil((count || 0) / limit);
    
    return NextResponse.json({
      tests: tests || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      },
      filters: {
        protocols: [
          { value: 'all', label: 'All Protocols', count: count || 0 },
          { value: '5G_NR', label: '5G NR', count: protocolCounts['5G_NR'] || 0 },
          { value: '4G_LTE', label: '4G LTE', count: protocolCounts['4G_LTE'] || 0 },
          { value: 'IMS_SIP', label: 'IMS/SIP', count: protocolCounts['IMS_SIP'] || 0 },
          { value: 'O_RAN', label: 'O-RAN', count: protocolCounts['O_RAN'] || 0 },
          { value: 'NB_IoT', label: 'NB-IoT', count: protocolCounts['NB_IoT'] || 0 },
          { value: 'V2X', label: 'V2X', count: protocolCounts['V2X'] || 0 },
          { value: 'NTN', label: 'NTN', count: protocolCounts['NTN'] || 0 }
        ],
        test_types: [
          { value: 'all', label: 'All Types', count: count || 0 },
          { value: 'functional', label: 'Functional', count: testTypeCounts['functional'] || 0 },
          { value: 'performance', label: 'Performance', count: testTypeCounts['performance'] || 0 },
          { value: 'stability', label: 'Stability', count: testTypeCounts['stability'] || 0 },
          { value: 'stress', label: 'Stress', count: testTypeCounts['stress'] || 0 },
          { value: 'interoperability', label: 'Interoperability', count: testTypeCounts['interoperability'] || 0 },
          { value: 'security', label: 'Security', count: testTypeCounts['security'] || 0 },
          { value: 'mobility', label: 'Mobility', count: testTypeCounts['mobility'] || 0 },
          { value: 'conformance', label: 'Conformance', count: testTypeCounts['conformance'] || 0 }
        ],
        complexities: [
          { value: 'all', label: 'All Levels', count: count || 0 },
          { value: 'beginner', label: 'Beginner', count: complexityCounts['beginner'] || 0 },
          { value: 'intermediate', label: 'Intermediate', count: complexityCounts['intermediate'] || 0 },
          { value: 'advanced', label: 'Advanced', count: complexityCounts['advanced'] || 0 },
          { value: 'expert', label: 'Expert', count: complexityCounts['expert'] || 0 }
        ]
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}