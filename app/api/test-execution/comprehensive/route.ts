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
      const { data: testCase, error: testCaseError } = await supabase
        .from('test_cases')
        .select(`
          *,
          test_case_categories!inner(name, description, protocol_focus, layer_focus, complexity_level),
          test_case_messages(
            id, step_id, step_order, timestamp_ms, direction, layer, protocol,
            message_type, message_name, message_description, standard_reference,
            message_variant, message_priority, retry_count, retry_interval_ms,
            success_criteria, failure_criteria, measurement_criteria,
            message_sequence_group, parallel_execution, conditional_execution,
            message_payload, expected_response_time_ms, max_response_time_ms,
            message_size_bytes, compression_enabled, encryption_required,
            message_templates!inner(template_name, message_structure, mandatory_fields, optional_fields, validation_rules)
          ),
          test_case_information_elements(
            id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
            ie_size, mandatory, is_valid, standard_reference,
            ie_variant, ie_priority, ie_condition, ie_validation_rules,
            ie_measurement_criteria, ie_relationship, ie_dependencies,
            ie_alternatives, ie_encoding, ie_compression, ie_encryption,
            information_element_library!inner(ie_description, ie_structure, allowed_values, value_range, ie_examples)
          ),
          test_case_layer_parameters(
            id, layer, parameter_name, parameter_type, parameter_value,
            parameter_unit, context, source, standard_reference,
            parameter_variant, parameter_priority, parameter_condition,
            parameter_validation_rules, parameter_measurement_criteria,
            parameter_relationship, parameter_dependencies, parameter_alternatives,
            parameter_accuracy, parameter_precision, parameter_resolution,
            parameter_calibration, parameter_measurement_method,
            layer_parameter_library!inner(parameter_description, data_type, min_value, max_value, parameter_examples)
          ),
          test_case_dependencies(
            id, depends_on_test_case_id, dependency_type, dependency_condition,
            dependency_description, is_mandatory,
            depends_on_test_case:test_cases!test_case_dependencies_depends_on_test_case_id_fkey(name, protocol, layer)
          )
        `)
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
      const { data: execution, error: executionError } = await supabase
        .from('test_case_executions')
        .select(`
          *,
          test_cases!inner(name, protocol, layer, standard_reference),
          decoded_messages(
            id, message_id, timestamp_us, protocol, message_type, message_name,
            message_direction, layer, sublayer, source_entity, target_entity,
            decoded_data, information_elements, ie_count, validation_status,
            validation_errors, validation_warnings, message_size, processing_time_ms,
            decoded_information_elements(
              id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
              ie_size, mandatory, is_valid, validation_errors, validation_warnings,
              standard_reference, ie_description
            ),
            decoded_layer_parameters(
              id, layer, parameter_name, parameter_type, parameter_value,
              parameter_unit, context, source, is_valid, validation_errors,
              validation_warnings, standard_reference, parameter_description
            )
          ),
          message_flow_compliance(
            id, flow_name, flow_type, protocol, compliance_score, timing_compliance,
            ie_compliance, layer_compliance, standard_reference, release_version,
            compliance_details, timing_details, ie_details, layer_details
          ),
          ie_validation_results(
            id, ie_name, ie_type, expected_value, actual_value, is_valid,
            validation_errors, validation_warnings, standard_reference
          ),
          layer_parameter_analysis(
            id, layer, parameter_name, expected_value, actual_value, is_valid,
            validation_errors, validation_warnings, performance_score,
            standard_reference
          ),
          message_timing_analysis(
            id, message_type, expected_timing_ms, actual_timing_ms, timing_delta_ms,
            is_within_spec, timing_violations, standard_reference
          )
        `)
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
      const { data: templates, error: templatesError } = await supabase
        .from('test_execution_templates')
        .select('*')
        .eq('protocol', testCaseData.protocol)
        .eq('layer', testCaseData.layer);

      if (templatesError) {
        console.error('Templates fetch error:', templatesError);
      } else {
        executionTemplates = templates;
      }
    }

    // Organize comprehensive data
    const comprehensiveData = {
      // Test case definition
      testCase: testCaseData ? {
        id: testCaseData.id,
        name: testCaseData.name,
        description: testCaseData.description,
        protocol: testCaseData.protocol,
        layer: testCaseData.layer,
        complexity: testCaseData.complexity,
        category: testCaseData.test_case_categories,
        testScenario: testCaseData.test_scenario,
        testObjective: testCaseData.test_objective,
        standardReference: testCaseData.standard_reference,
        releaseVersion: testCaseData.release_version,
        expectedDurationMinutes: testCaseData.expected_duration_minutes,
        executionPriority: testCaseData.execution_priority,
        automationLevel: testCaseData.automation_level,
        testDataRequirements: testCaseData.test_data_requirements,
        kpiRequirements: testCaseData.kpi_requirements,
        dependencies: testCaseData.test_case_dependencies || []
      } : null,

      // Expected message flow
      expectedMessages: testCaseData?.test_case_messages?.map(msg => ({
        id: msg.id,
        stepId: msg.step_id,
        stepOrder: msg.step_order,
        timestampMs: msg.timestamp_ms,
        direction: msg.direction,
        layer: msg.layer,
        protocol: msg.protocol,
        messageType: msg.message_type,
        messageName: msg.message_name,
        messageDescription: msg.message_description,
        standardReference: msg.standard_reference,
        messageVariant: msg.message_variant,
        messagePriority: msg.message_priority,
        retryCount: msg.retry_count,
        retryIntervalMs: msg.retry_interval_ms,
        successCriteria: msg.success_criteria,
        failureCriteria: msg.failure_criteria,
        measurementCriteria: msg.measurement_criteria,
        messageSequenceGroup: msg.message_sequence_group,
        parallelExecution: msg.parallel_execution,
        conditionalExecution: msg.conditional_execution,
        messagePayload: msg.message_payload,
        expectedResponseTimeMs: msg.expected_response_time_ms,
        maxResponseTimeMs: msg.max_response_time_ms,
        messageSizeBytes: msg.message_size_bytes,
        compressionEnabled: msg.compression_enabled,
        encryptionRequired: msg.encryption_required,
        template: msg.message_templates
      })) || [],

      // Expected information elements
      expectedInformationElements: testCaseData?.test_case_information_elements?.map(ie => ({
        id: ie.id,
        ieName: ie.ie_name,
        ieType: ie.ie_type,
        ieValue: ie.ie_value,
        ieValueHex: ie.ie_value_hex,
        ieValueBinary: ie.ie_value_binary,
        ieSize: ie.ie_size,
        mandatory: ie.mandatory,
        isValid: ie.is_valid,
        standardReference: ie.standard_reference,
        ieVariant: ie.ie_variant,
        iePriority: ie.ie_priority,
        ieCondition: ie.ie_condition,
        ieValidationRules: ie.ie_validation_rules,
        ieMeasurementCriteria: ie.ie_measurement_criteria,
        ieRelationship: ie.ie_relationship,
        ieDependencies: ie.ie_dependencies,
        ieAlternatives: ie.ie_alternatives,
        ieEncoding: ie.ie_encoding,
        ieCompression: ie.ie_compression,
        ieEncryption: ie.ie_encryption,
        library: ie.information_element_library
      })) || [],

      // Expected layer parameters
      expectedLayerParameters: testCaseData?.test_case_layer_parameters?.map(param => ({
        id: param.id,
        layer: param.layer,
        parameterName: param.parameter_name,
        parameterType: param.parameter_type,
        parameterValue: param.parameter_value,
        parameterUnit: param.parameter_unit,
        context: param.context,
        source: param.source,
        standardReference: param.standard_reference,
        parameterVariant: param.parameter_variant,
        parameterPriority: param.parameter_priority,
        parameterCondition: param.parameter_condition,
        parameterValidationRules: param.parameter_validation_rules,
        parameterMeasurementCriteria: param.parameter_measurement_criteria,
        parameterRelationship: param.parameter_relationship,
        parameterDependencies: param.parameter_dependencies,
        parameterAlternatives: param.parameter_alternatives,
        parameterAccuracy: param.parameter_accuracy,
        parameterPrecision: param.parameter_precision,
        parameterResolution: param.parameter_resolution,
        parameterCalibration: param.parameter_calibration,
        parameterMeasurementMethod: param.parameter_measurement_method,
        library: param.layer_parameter_library
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
        messageId: msg.message_id,
        timestampUs: msg.timestamp_us,
        protocol: msg.protocol,
        messageType: msg.message_type,
        messageName: msg.message_name,
        messageDirection: msg.message_direction,
        layer: msg.layer,
        sublayer: msg.sublayer,
        sourceEntity: msg.source_entity,
        targetEntity: msg.target_entity,
        decodedData: msg.decoded_data,
        informationElements: msg.information_elements,
        ieCount: msg.ie_count,
        validationStatus: msg.validation_status,
        validationErrors: msg.validation_errors,
        validationWarnings: msg.validation_warnings,
        messageSize: msg.message_size,
        processingTimeMs: msg.processing_time_ms,
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
        ])],
        protocols: [...new Set([
          ...(testCaseData?.test_case_messages?.map(msg => msg.protocol) || []),
          ...(executionData?.decoded_messages?.map(msg => msg.protocol) || [])
        ])],
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