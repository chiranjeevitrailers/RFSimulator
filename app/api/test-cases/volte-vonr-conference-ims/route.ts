import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * VoLTE, VoNR, Conference Call, and IMS Registration Test Cases API
 * GET /api/test-cases/volte-vonr-conference-ims?flowType=xxx&protocol=xxx&limit=xxx&offset=xxx
 * POST /api/test-cases/volte-vonr-conference-ims - Create new VoLTE/VoNR/Conference/IMS test case
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flowType = searchParams.get('flowType'); // 'volte', 'vonr', 'conference', 'ims_registration'
    const protocol = searchParams.get('protocol'); // 'VoLTE', 'VoNR', 'IMS'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const includeData = searchParams.get('includeData') === 'true';

    const supabase = createClient();

    console.log(`🔍 Fetching VoLTE/VoNR/Conference/IMS test cases - FlowType: ${flowType}, Protocol: ${protocol}`);

    // Build query for VoLTE/VoNR/Conference/IMS test cases
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

    // Apply filters for VoLTE/VoNR/Conference/IMS flows
    if (flowType) {
      switch (flowType) {
        case 'volte':
          query = query.or('protocol.eq.VoLTE,test_case_categories.name.ilike.%VoLTE%');
          break;
        case 'vonr':
          query = query.or('protocol.eq.VoNR,test_case_categories.name.ilike.%VoNR%');
          break;
        case 'conference':
          query = query.or('protocol.eq.IMS,test_case_categories.name.ilike.%Conference%');
          break;
        case 'ims_registration':
          query = query.or('protocol.eq.IMS,test_case_categories.name.ilike.%IMS Registration%');
          break;
      }
    }

    if (protocol) {
      query = query.eq('protocol', protocol);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,test_scenario.ilike.%${search}%`);
    }

    const { data: testCases, error: testCasesError } = await query;

    if (testCasesError) {
      console.error('VoLTE/VoNR/Conference/IMS test cases fetch error:', testCasesError);
      return NextResponse.json(
        { error: 'Failed to fetch VoLTE/VoNR/Conference/IMS test cases' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('test_cases')
      .select('id', { count: 'exact', head: true });

    if (flowType) {
      switch (flowType) {
        case 'volte':
          countQuery = countQuery.or('protocol.eq.VoLTE,test_case_categories.name.ilike.%VoLTE%');
          break;
        case 'vonr':
          countQuery = countQuery.or('protocol.eq.VoNR,test_case_categories.name.ilike.%VoNR%');
          break;
        case 'conference':
          countQuery = countQuery.or('protocol.eq.IMS,test_case_categories.name.ilike.%Conference%');
          break;
        case 'ims_registration':
          countQuery = countQuery.or('protocol.eq.IMS,test_case_categories.name.ilike.%IMS Registration%');
          break;
      }
    }

    if (protocol) {
      countQuery = countQuery.eq('protocol', protocol);
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,test_scenario.ilike.%${search}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Count fetch error:', countError);
    }

    // Get statistics for VoLTE/VoNR/Conference/IMS flows
    const { data: stats, error: statsError } = await supabase
      .from('test_cases')
      .select('protocol, layer, complexity, test_scenario')
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
          }, {} as Record<string, number>),
          byScenario: data.reduce((acc, tc) => {
            acc[tc.test_scenario] = (acc[tc.test_scenario] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        return { data: stats, error: null };
      });

    console.log(`✅ Fetched ${testCases?.length || 0} VoLTE/VoNR/Conference/IMS test cases successfully`);

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
          flowType,
          protocol,
          search
        }
      },
      message: 'VoLTE/VoNR/Conference/IMS test cases fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching VoLTE/VoNR/Conference/IMS test cases:', error);
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
 * Create a new VoLTE/VoNR/Conference/IMS test case
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      flowType, // 'volte', 'vonr', 'conference', 'ims_registration'
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

    if (!name || !flowType || !protocol) {
      return NextResponse.json(
        { error: 'Name, flowType, and protocol are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🚀 Creating VoLTE/VoNR/Conference/IMS test case: ${name}`);

    // Determine category based on flow type
    let categoryName = '';
    switch (flowType) {
      case 'volte':
        if (testScenario === 'call_setup') categoryName = 'VoLTE Call Setup';
        else if (testScenario === 'call_release') categoryName = 'VoLTE Call Release';
        else if (testScenario === 'call_handover') categoryName = 'VoLTE Call Handover';
        else if (testScenario === 'emergency_call') categoryName = 'VoLTE Emergency Call';
        break;
      case 'vonr':
        if (testScenario === 'call_setup') categoryName = 'VoNR Call Setup';
        else if (testScenario === 'call_release') categoryName = 'VoNR Call Release';
        else if (testScenario === 'call_handover') categoryName = 'VoNR Call Handover';
        else if (testScenario === 'emergency_call') categoryName = 'VoNR Emergency Call';
        break;
      case 'conference':
        if (testScenario === 'conference_setup') categoryName = 'IMS Conference Setup';
        else if (testScenario === 'conference_management') categoryName = 'IMS Conference Management';
        else if (testScenario === 'conference_release') categoryName = 'IMS Conference Release';
        break;
      case 'ims_registration':
        if (testScenario === 'initial_registration') categoryName = 'IMS Initial Registration';
        else if (testScenario === 're_registration') categoryName = 'IMS Re-registration';
        else if (testScenario === 'de_registration') categoryName = 'IMS De-registration';
        else if (testScenario === 'emergency_registration') categoryName = 'IMS Emergency Registration';
        break;
    }

    // Get category ID
    const { data: category, error: categoryError } = await supabase
      .from('test_case_categories')
      .select('id')
      .eq('name', categoryName)
      .single();

    if (categoryError) {
      console.error('Category fetch error:', categoryError);
      return NextResponse.json(
        { error: 'Invalid category for flow type' },
        { status: 400 }
      );
    }

    // Create test case
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .insert({
        name,
        description,
        category_id: category.id,
        protocol,
        layer: layer || 'IMS',
        complexity: complexity || 'intermediate',
        test_scenario: testScenario,
        test_objective: testObjective,
        standard_reference: standardReference,
        release_version: releaseVersion,
        expected_duration_minutes: expectedDurationMinutes || 3,
        execution_priority: executionPriority || 5,
        automation_level: automationLevel || 'semi_automated',
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

    console.log(`✅ VoLTE/VoNR/Conference/IMS test case created successfully: ${testCase.id}`);

    return NextResponse.json({
      success: true,
      data: {
        testCaseId: testCase.id,
        flowType,
        category: categoryName,
        message: 'VoLTE/VoNR/Conference/IMS test case created successfully'
      }
    });

  } catch (error) {
    console.error('❌ Error creating VoLTE/VoNR/Conference/IMS test case:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}