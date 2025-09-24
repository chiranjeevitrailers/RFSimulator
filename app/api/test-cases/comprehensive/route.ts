import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Comprehensive Test Cases API
 * GET /api/test-cases/comprehensive?category=xxx&protocol=xxx&layer=xxx&limit=xxx&offset=xxx
 * POST /api/test-cases/comprehensive - Create new test case
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const protocol = searchParams.get('protocol');
    const layer = searchParams.get('layer');
    const complexity = searchParams.get('complexity');
    const limit = parseInt(searchParams.get('limit') || '2000'); // Increased from 50 to 2000 to show more test cases
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const includeData = searchParams.get('includeData') === 'true';

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔍 Fetching comprehensive test cases - Category: ${category}, Protocol: ${protocol}, Layer: ${layer}`);

    // Build query dynamically based on available tables
    let selectQuery = '*';
    let hasCategories = false;
    let hasMessages = false;
    let hasInformationElements = false;
    let hasLayerParameters = false;

    // Check if test_case_categories table exists
    try {
      const { data: categories, error: catError } = await supabase
        .from('test_case_categories')
        .select('id')
        .limit(1);

      if (!catError) {
        hasCategories = true;
      }
    } catch (e) {
      console.warn('test_case_categories table not found, skipping category join');
    }

    // Check if test_case_messages table exists
    try {
      const { data: messages, error: msgError } = await supabase
        .from('test_case_messages')
        .select('id')
        .limit(1);

      if (!msgError) {
        hasMessages = true;
      }
    } catch (e) {
      console.warn('test_case_messages table not found, skipping message join');
    }

    // Check if test_case_information_elements table exists
    try {
      const { data: ies, error: ieError } = await supabase
        .from('test_case_information_elements')
        .select('id')
        .limit(1);

      if (!ieError) {
        hasInformationElements = true;
      }
    } catch (e) {
      console.warn('test_case_information_elements table not found, skipping IE join');
    }

    // Check if test_case_layer_parameters table exists
    try {
      const { data: params, error: paramError } = await supabase
        .from('test_case_layer_parameters')
        .select('id')
        .limit(1);

      if (!paramError) {
        hasLayerParameters = true;
      }
    } catch (e) {
      console.warn('test_case_layer_parameters table not found, skipping parameter join');
    }

    // Build the select query dynamically
    if (hasCategories) {
      selectQuery += ',test_case_categories(name, description, protocol_focus, layer_focus)';
    }

    if (hasMessages) {
      selectQuery += ',test_case_messages(*)';
    }

    if (hasInformationElements) {
      selectQuery += ',test_case_information_elements(*)';
    }

    if (hasLayerParameters) {
      selectQuery += ',test_case_layer_parameters(*)';
    }

    console.log(`Dynamic select query: ${selectQuery}`);

    // Build query
    let query = supabase
      .from('test_cases')
      .select(selectQuery)
      .order('name')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      // Filter directly on test_cases.category to avoid category-name mismatches
      query = query.eq('category', category);
    }
    if (protocol) {
      query = query.eq('protocol', protocol);
    }
    if (layer) {
      query = query.eq('layer', layer);
    }
    if (complexity) {
      query = query.eq('complexity', complexity);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,test_scenario.ilike.%${search}%`);
    }

    const { data: testCases, error: testCasesError } = await query;

    if (testCasesError) {
      console.error('Test cases fetch error:', testCasesError);
      return NextResponse.json(
        { error: 'Failed to fetch test cases' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('test_cases')
      .select('id', { count: 'exact', head: true });

    if (category) {
      countQuery = countQuery.eq('category', category);
    }
    if (protocol) {
      countQuery = countQuery.eq('protocol', protocol);
    }
    if (layer) {
      countQuery = countQuery.eq('layer', layer);
    }
    if (complexity) {
      countQuery = countQuery.eq('complexity', complexity);
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Count fetch error:', countError);
    }

    // Get statistics
    const { data: stats, error: statsError } = await supabase
      .from('test_cases')
      .select('protocol, layer, complexity')
      .then(({ data }) => {
        if (!data) return { data: null, error: null };

        const stats = {
          total: data.length,
          byProtocol: data.reduce((acc, tc) => {
            acc[tc.protocol || '5G_NR'] = (acc[tc.protocol || '5G_NR'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byLayer: data.reduce((acc, tc) => {
            acc[tc.layer || 'Multi'] = (acc[tc.layer || 'Multi'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byComplexity: data.reduce((acc, tc) => {
            acc[tc.complexity || 'intermediate'] = (acc[tc.complexity || 'intermediate'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        return { data: stats, error: null };
      });

    console.log(`✅ Fetched ${testCases?.length || 0} test cases successfully`);

    return NextResponse.json({
      success: true,
      data: testCases || [], // Return test cases directly, not nested
      count: testCases?.length || 0,
      total: count || 0,
      pagination: {
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      },
      statistics: stats || {},
      filters: {
        category,
        protocol,
        layer,
        complexity,
        search
      },
      message: 'Test cases fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching comprehensive test cases:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new comprehensive test case
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      categoryId,
      protocol,
      layer,
      complexity,
      testScenario,
      testObjective,
      standardReference,
      releaseVersion,
      expectedDurationMinutes,
      executionPriority,
      automationLevel,
      testDataRequirements,
      kpiRequirements,
      messages,
      informationElements,
      layerParameters
    } = body;

    if (!name || !protocol || !layer) {
      return NextResponse.json(
        { error: 'Name, protocol, and layer are required' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    console.log(`🚀 Creating comprehensive test case: ${name}`);

    // Start transaction
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .insert({
        name,
        description,
        category_id: categoryId,
        protocol,
        layer,
        complexity: complexity || 'intermediate',
        test_scenario: testScenario,
        test_objective: testObjective,
        standard_reference: standardReference,
        release_version: releaseVersion,
        expected_duration_minutes: expectedDurationMinutes || 5,
        execution_priority: executionPriority || 5,
        automation_level: automationLevel || 'manual',
        test_data_requirements: testDataRequirements || {},
        kpi_requirements: kpiRequirements || {},
        review_status: 'draft'
      })
      .select()
      .single();

    if (testCaseError) {
      console.error('Test case creation error:', testCaseError);
      return NextResponse.json(
        { error: 'Failed to create test case' },
        { status: 500 }
      );
    }

    // Insert messages if provided
    if (messages && messages.length > 0) {
      const messagesWithTestCaseId = messages.map((msg: any) => ({
        ...msg,
        test_case_id: testCase.id
      }));

      const { error: messagesError } = await supabase
        .from('test_case_messages')
        .insert(messagesWithTestCaseId);

      if (messagesError) {
        console.error('Messages creation error:', messagesError);
        // Continue execution, don't fail the entire operation
      }
    }

    // Insert information elements if provided
    if (informationElements && informationElements.length > 0) {
      const iesWithTestCaseId = informationElements.map((ie: any) => ({
        ...ie,
        test_case_id: testCase.id
      }));

      const { error: iesError } = await supabase
        .from('test_case_information_elements')
        .insert(iesWithTestCaseId);

      if (iesError) {
        console.error('Information elements creation error:', iesError);
        // Continue execution, don't fail the entire operation
      }
    }

    // Insert layer parameters if provided
    if (layerParameters && layerParameters.length > 0) {
      const paramsWithTestCaseId = layerParameters.map((param: any) => ({
        ...param,
        test_case_id: testCase.id
      }));

      const { error: paramsError } = await supabase
        .from('test_case_layer_parameters')
        .insert(paramsWithTestCaseId);

      if (paramsError) {
        console.error('Layer parameters creation error:', paramsError);
        // Continue execution, don't fail the entire operation
      }
    }

    console.log(`✅ Comprehensive test case created successfully: ${testCase.id}`);

    return NextResponse.json({
      success: true,
      data: {
        testCaseId: testCase.id,
        message: 'Comprehensive test case created successfully'
      }
    });

  } catch (error) {
    console.error('❌ Error creating comprehensive test case:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}