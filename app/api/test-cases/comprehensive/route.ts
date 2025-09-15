import { NextRequest, NextResponse } from 'next/server';

// Required for static export
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { createClient } from '@/lib/supabase';

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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const includeData = searchParams.get('includeData') === 'true';

    const supabase = createClient();

    console.log(`🔍 Fetching comprehensive test cases - Category: ${category}, Protocol: ${protocol}, Layer: ${layer}`);

    // Build query
    let query = supabase
      .from('test_cases')
      .select(`
        *,
        test_case_categories!inner(name, description, protocol_focus, layer_focus),
        test_case_messages(
          id, step_id, step_order, timestamp_ms, direction, layer, protocol,
          message_type, message_name, message_description, standard_reference,
          message_template_id, message_variant, message_priority,
          message_templates!inner(template_name, message_structure, validation_rules)
        ),
        test_case_information_elements(
          id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
          ie_size, mandatory, is_valid, standard_reference,
          information_element_library!inner(ie_description, ie_structure, allowed_values, value_range)
        ),
        test_case_layer_parameters(
          id, layer, parameter_name, parameter_type, parameter_value,
          parameter_unit, context, source, standard_reference,
          layer_parameter_library!inner(parameter_description, data_type, min_value, max_value)
        )
      `)
      .order('name')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq('test_case_categories.name', category);
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
      countQuery = countQuery.eq('test_case_categories.name', category);
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
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,test_scenario.ilike.%${search}%`);
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
            acc[tc.protocol] = (acc[tc.protocol] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byLayer: data.reduce((acc, tc) => {
            acc[tc.layer] = (acc[tc.layer] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          byComplexity: data.reduce((acc, tc) => {
            acc[tc.complexity] = (acc[tc.complexity] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        return { data: stats, error: null };
      });

    console.log(`✅ Fetched ${testCases?.length || 0} test cases successfully`);

    return NextResponse.json({
      success: true,
      data: {
        testCases: testCases || [],
        pagination: {
          total: count || 0,
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
        }
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

    const supabase = createClient();

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