import { NextRequest, NextResponse } from 'next/server';

// Required for static export
import { createClient } from '@/lib/supabase';

/**
 * Comprehensive Test Case Execution API
 * GET /api/test-execution/comprehensive?testCaseId=xxx - Get complete test case data for execution
 * POST /api/test-execution/comprehensive - Execute test case with complete data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');
    const runId = searchParams.get('runId');
    const includeTemplates = searchParams.get('includeTemplates') === 'true';

    if (!testCaseId && !runId) {
      return NextResponse.json(
        { error: 'Either testCaseId or runId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🔍 Fetching comprehensive test case execution data - TestCase: ${testCaseId}, RunId: ${runId}`);

    let testCaseData = null;
    let executionData = null;

    // Fetch test case data
    if (testCaseId) {
      // Build dynamic select query based on available columns
      let selectQuery = '*';
      let hasCategories = false;
      let hasMessages = false;
      let hasInformationElements = false;
      let hasLayerParameters = false;
      let hasDependencies = false;

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

      // Check if test_case_dependencies table exists
      try {
        const { data: deps, error: depError } = await supabase
          .from('test_case_dependencies')
          .select('id')
          .limit(1);

        if (!depError) {
          hasDependencies = true;
        }
      } catch (e) {
        console.warn('test_case_dependencies table not found, skipping dependency join');
      }

      // Build the select query dynamically
      if (hasCategories) {
        selectQuery += ',test_case_categories!inner(name, description, protocol_focus, layer_focus, complexity_level)';
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

      if (hasDependencies) {
        selectQuery += ',test_case_dependencies(*)';
      }

      console.log(`Dynamic select query: ${selectQuery}`);

      const { data: testCase, error: testCaseError } = await supabase
        .from('test_cases')
        .select(selectQuery)
        .eq('id', testCaseId)
        .single();

      if (testCaseError) {
        console.error('Test case fetch error:', testCaseError);
        return NextResponse.json(
          { error: 'Test case not found' },
          { status: 404 }
        );
      }

      testCaseData = testCase;
    }

    // Fetch execution data if runId provided
    if (runId) {
      // Build dynamic select query for execution data
      let executionSelectQuery = '*';
      let hasDecodedMessages = false;
      let hasMessageFlowCompliance = false;
      let hasIeValidationResults = false;
      let hasLayerParameterAnalysis = false;
      let hasMessageTimingAnalysis = false;

      // Check if decoded_messages table exists
      try {
        const { data: decodedMsgs, error: decodedError } = await supabase
          .from('decoded_messages')
          .select('id')
          .limit(1);

        if (!decodedError) {
          hasDecodedMessages = true;
        }
      } catch (e) {
        console.warn('decoded_messages table not found, skipping decoded messages');
      }

      // Check if message_flow_compliance table exists
      try {
        const { data: compliance, error: complianceError } = await supabase
          .from('message_flow_compliance')
          .select('id')
          .limit(1);

        if (!complianceError) {
          hasMessageFlowCompliance = true;
        }
      } catch (e) {
        console.warn('message_flow_compliance table not found, skipping compliance data');
      }

      // Check if ie_validation_results table exists
      try {
        const { data: ieResults, error: ieError } = await supabase
          .from('ie_validation_results')
          .select('id')
          .limit(1);

        if (!ieError) {
          hasIeValidationResults = true;
        }
      } catch (e) {
        console.warn('ie_validation_results table not found, skipping IE validation results');
      }

      // Check if layer_parameter_analysis table exists
      try {
        const { data: layerAnalysis, error: layerError } = await supabase
          .from('layer_parameter_analysis')
          .select('id')
          .limit(1);

        if (!layerError) {
          hasLayerParameterAnalysis = true;
        }
      } catch (e) {
        console.warn('layer_parameter_analysis table not found, skipping layer parameter analysis');
      }

      // Check if message_timing_analysis table exists
      try {
        const { data: timingAnalysis, error: timingError } = await supabase
          .from('message_timing_analysis')
          .select('id')
          .limit(1);

        if (!timingError) {
          hasMessageTimingAnalysis = true;
        }
      } catch (e) {
        console.warn('message_timing_analysis table not found, skipping message timing analysis');
      }

      // Build the execution select query dynamically
      if (hasDecodedMessages) {
        executionSelectQuery += ',decoded_messages(*)';
      }

      if (hasMessageFlowCompliance) {
        executionSelectQuery += ',message_flow_compliance(*)';
      }

      if (hasIeValidationResults) {
        executionSelectQuery += ',ie_validation_results(*)';
      }

      if (hasLayerParameterAnalysis) {
        executionSelectQuery += ',layer_parameter_analysis(*)';
      }

      if (hasMessageTimingAnalysis) {
        executionSelectQuery += ',message_timing_analysis(*)';
      }

      console.log(`Execution select query: ${executionSelectQuery}`);

      const { data: execution, error: executionError } = await supabase
        .from('test_case_executions')
        .select(executionSelectQuery)
        .eq('id', runId)
        .single();

      if (executionError) {
        console.error('Execution fetch error:', executionError);
        return NextResponse.json(
          { error: 'Execution not found' },
          { status: 404 }
        );
      }

      executionData = execution;
    }

    // Fetch execution templates if requested
    let executionTemplates = null;
    if (includeTemplates && testCaseData) {
      try {
        const { data: templates, error: templatesError } = await supabase
          .from('test_execution_templates')
          .select('*')
          .eq('protocol', testCaseData.protocol || '5G_NR')
          .eq('layer', testCaseData.layer || 'Multi');

        if (templatesError) {
          console.warn('Templates fetch error:', templatesError);
        } else {
          executionTemplates = templates || [];
        }
      } catch (e) {
        console.warn('test_execution_templates table not found, skipping template fetch');
        executionTemplates = [];
      }
    }

    // Organize comprehensive data
    const comprehensiveData = {
      // Test case definition
      testCase: testCaseData ? {
        id: testCaseData.id,
        name: testCaseData.name,
        description: testCaseData.description,
        protocol: testCaseData.protocol || '5G_NR',
        layer: testCaseData.layer || 'Multi',
        complexity: testCaseData.complexity || 'intermediate',
        category: testCaseData.test_case_categories || { name: '5G NR', description: '5G NR Test Cases' },
        testScenario: testCaseData.test_scenario || testCaseData.name,
        testObjective: testCaseData.test_objective || testCaseData.description,
        standardReference: testCaseData.standard_reference || 'TS 38.331',
        releaseVersion: testCaseData.release_version || 'Release 17',
        expectedDurationMinutes: testCaseData.expected_duration_minutes || 5,
        executionPriority: testCaseData.execution_priority || 5,
        automationLevel: testCaseData.automation_level || 'manual',
        testDataRequirements: testCaseData.test_data_requirements || {},
        kpiRequirements: testCaseData.kpi_requirements || {},
        dependencies: testCaseData.test_case_dependencies || []
      } : null,

      // Expected message flow
      expectedMessages: testCaseData?.test_case_messages?.map(msg => ({
        id: msg.id,
        stepId: msg.step_id || msg.id,
        stepOrder: msg.step_order || 1,
        timestampMs: msg.timestamp_ms || 0,
        direction: msg.direction || 'UL',
        layer: msg.layer || 'RRC',
        protocol: msg.protocol || '5G_NR',
        messageType: msg.message_type || 'RRCSetupRequest',
        messageName: msg.message_name || 'RRC Setup Request',
        messageDescription: msg.message_description || 'RRC Setup Request message',
        standardReference: msg.standard_reference || 'TS 38.331',
        messageVariant: msg.message_variant || 'standard',
        messagePriority: msg.message_priority || 'normal',
        retryCount: msg.retry_count || 0,
        retryIntervalMs: msg.retry_interval_ms || 1000,
        successCriteria: msg.success_criteria || 'Message sent successfully',
        failureCriteria: msg.failure_criteria || 'Message transmission failed',
        measurementCriteria: msg.measurement_criteria || 'Standard measurement criteria',
        messageSequenceGroup: msg.message_sequence_group || 'initial_access',
        parallelExecution: msg.parallel_execution || false,
        conditionalExecution: msg.conditional_execution || false,
        messagePayload: msg.message_payload || {},
        expectedResponseTimeMs: msg.expected_response_time_ms || 1000,
        maxResponseTimeMs: msg.max_response_time_ms || 5000,
        messageSizeBytes: msg.message_size_bytes || 100,
        compressionEnabled: msg.compression_enabled || false,
        encryptionRequired: msg.encryption_required || false,
        template: msg.message_templates || null
      })) || [],

      // Expected information elements
      expectedInformationElements: testCaseData?.test_case_information_elements?.map(ie => ({
        id: ie.id,
        ieName: ie.ie_name || 'IE_' + ie.id,
        ieType: ie.ie_type || 'integer',
        ieValue: ie.ie_value || 0,
        ieValueHex: ie.ie_value_hex || '00',
        ieValueBinary: ie.ie_value_binary || '00000000',
        ieSize: ie.ie_size || 8,
        mandatory: ie.mandatory !== undefined ? ie.mandatory : true,
        isValid: ie.is_valid !== undefined ? ie.is_valid : true,
        standardReference: ie.standard_reference || 'TS 38.331',
        ieVariant: ie.ie_variant || 'standard',
        iePriority: ie.ie_priority || 'normal',
        ieCondition: ie.ie_condition || 'always',
        ieValidationRules: ie.ie_validation_rules || {},
        ieMeasurementCriteria: ie.ie_measurement_criteria || 'Standard criteria',
        ieRelationship: ie.ie_relationship || 'standalone',
        ieDependencies: ie.ie_dependencies || [],
        ieAlternatives: ie.ie_alternatives || [],
        ieEncoding: ie.ie_encoding || 'binary',
        ieCompression: ie.ie_compression || false,
        ieEncryption: ie.ie_encryption || false,
        library: ie.information_element_library || {}
      })) || [],

      // Expected layer parameters
      expectedLayerParameters: testCaseData?.test_case_layer_parameters?.map(param => ({
        id: param.id,
        layer: param.layer || 'RRC',
        parameterName: param.parameter_name || 'default_parameter',
        parameterType: param.parameter_type || 'config',
        parameterValue: param.parameter_value || 0,
        parameterUnit: param.parameter_unit || 'none',
        context: param.context || 'default',
        source: param.source || 'configuration',
        standardReference: param.standard_reference || 'TS 38.331',
        parameterVariant: param.parameter_variant || 'standard',
        parameterPriority: param.parameter_priority || 'normal',
        parameterCondition: param.parameter_condition || 'always',
        parameterValidationRules: param.parameter_validation_rules || {},
        parameterMeasurementCriteria: param.parameter_measurement_criteria || 'Standard criteria',
        parameterRelationship: param.parameter_relationship || 'standalone',
        parameterDependencies: param.parameter_dependencies || [],
        parameterAlternatives: param.parameter_alternatives || [],
        parameterAccuracy: param.parameter_accuracy || 0.1,
        parameterPrecision: param.parameter_precision || 0.01,
        parameterResolution: param.parameter_resolution || 1,
        parameterCalibration: param.parameter_calibration || 'factory',
        parameterMeasurementMethod: param.parameter_measurement_method || 'direct',
        library: param.layer_parameter_library || {}
      })) || [],

      // Actual execution data (if runId provided)
      actualExecution: executionData ? {
        id: executionData.id,
        testCaseId: executionData.test_case_id,
        userId: executionData.user_id,
        status: executionData.status,
        startTime: executionData.start_time,
        endTime: executionData.end_time,
        expectedMessageCount: executionData.expected_message_count,
        actualMessageCount: executionData.actual_message_count,
        messageFlowCompliance: executionData.message_flow_compliance,
        layerAnalysisResults: executionData.layer_analysis_results,
        ieValidationResults: executionData.ie_validation_results,
        timingAnalysisResults: executionData.timing_analysis_results,
        testCase: executionData.test_cases
      } : null,

      // Actual decoded messages (if runId provided)
      actualMessages: executionData?.decoded_messages?.map(msg => ({
        id: msg.id,
        messageId: msg.message_id || msg.id,
        timestampUs: msg.timestamp_us || Date.now(),
        protocol: msg.protocol || '5G_NR',
        messageType: msg.message_type || 'RRCSetupRequest',
        messageName: msg.message_name || 'RRC Setup Request',
        messageDirection: msg.message_direction || 'UL',
        layer: msg.layer || 'RRC',
        sublayer: msg.sublayer || 'RRC',
        sourceEntity: msg.source_entity || 'UE',
        targetEntity: msg.target_entity || 'gNB',
        decodedData: msg.decoded_data || {},
        informationElements: msg.information_elements || [],
        ieCount: msg.ie_count || 0,
        validationStatus: msg.validation_status || 'valid',
        validationErrors: msg.validation_errors || [],
        validationWarnings: msg.validation_warnings || [],
        messageSize: msg.message_size || 100,
        processingTimeMs: msg.processing_time_ms || 10,
        decodedInformationElements: msg.decoded_information_elements || [],
        decodedLayerParameters: msg.decoded_layer_parameters || []
      })) || [],

      // Compliance analysis (if runId provided)
      complianceAnalysis: executionData?.message_flow_compliance || [],
      ieValidationResults: executionData?.ie_validation_results || [],
      layerParameterAnalysis: executionData?.layer_parameter_analysis || [],
      messageTimingAnalysis: executionData?.message_timing_analysis || [],

      // Execution templates (if requested)
      executionTemplates: executionTemplates || [],

      // Summary for real-time simulation
      simulation: {
        testCaseId: testCaseId,
        runId: runId,
        totalExpectedMessages: testCaseData?.test_case_messages?.length || 0,
        totalActualMessages: executionData?.decoded_messages?.length || 0,
        layers: [...new Set([
          ...(testCaseData?.test_case_messages?.map(msg => msg.layer) || []),
          ...(executionData?.decoded_messages?.map(msg => msg.layer) || [])
        ])] || ['RRC', 'NAS'],
        protocols: [...new Set([
          ...(testCaseData?.test_case_messages?.map(msg => msg.protocol) || []),
          ...(executionData?.decoded_messages?.map(msg => msg.protocol) || [])
        ])] || ['5G_NR'],
        duration: executionData?.decoded_messages?.length > 0
          ? Math.max(...executionData.decoded_messages.map(msg => msg.timestamp_us)) - Math.min(...executionData.decoded_messages.map(msg => msg.timestamp_us))
          : 0,
        status: executionData?.status || 'ready',
        complianceScore: executionData?.message_flow_compliance?.[0]?.compliance_score || 100
      }
    };

    console.log(`✅ Comprehensive test case execution data fetched successfully:`);
    console.log(`   Test Case: ${comprehensiveData.testCase?.name || 'N/A'}`);
    console.log(`   Expected Messages: ${comprehensiveData.expectedMessages.length}`);
    console.log(`   Expected IEs: ${comprehensiveData.expectedInformationElements.length}`);
    console.log(`   Expected Layer Params: ${comprehensiveData.expectedLayerParameters.length}`);
    console.log(`   Actual Messages: ${comprehensiveData.actualMessages.length}`);
    console.log(`   Layers: ${comprehensiveData.simulation.layers.join(', ')}`);
    console.log(`   Protocols: ${comprehensiveData.simulation.protocols.join(', ')}`);

    return NextResponse.json({
      success: true,
      data: comprehensiveData,
      message: 'Comprehensive test case execution data fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error fetching comprehensive test case execution data:', error);
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
 * Execute comprehensive test case
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      testCaseId,
      userId,
      executionMode = 'simulation',
      configuration = {},
      timeAcceleration = 1.0,
      logLevel = 'detailed',
      captureMode = 'full'
    } = body;

    if (!testCaseId || !userId) {
      return NextResponse.json(
        { error: 'testCaseId and userId are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    console.log(`🚀 Executing comprehensive test case: ${testCaseId}`);

    // Create test execution record
    const { data: execution, error: executionError } = await supabase
      .from('test_case_executions')
      .insert({
        test_case_id: testCaseId,
        user_id: userId,
        status: 'queued',
        execution_mode: executionMode,
        configuration: {
          time_acceleration: timeAcceleration,
          log_level: logLevel,
          capture_mode: captureMode,
          ...configuration
        }
      })
      .select()
      .single();

    if (executionError) {
      console.error('Test execution creation error:', executionError);
      return NextResponse.json(
        { error: 'Failed to create test execution' },
        { status: 500 }
      );
    }

    // Add to execution queue
    const { data: queueItem, error: queueError } = await supabase
      .from('test_run_queue')
      .insert({
        run_id: execution.id,
        user_id: userId,
        status: 'queued',
        priority: 0,
        scheduled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (queueError) {
      console.error('Queue creation error:', queueError);
      return NextResponse.json(
        { error: 'Failed to add to execution queue' },
        { status: 500 }
      );
    }

    console.log(`✅ Comprehensive test case execution queued successfully - RunId: ${execution.id}`);

    return NextResponse.json({
      success: true,
      data: {
        executionId: execution.id,
        queueId: queueItem.id,
        status: 'queued',
        message: 'Comprehensive test case execution queued successfully'
      }
    });

  } catch (error) {
    console.error('❌ Error executing comprehensive test case:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}