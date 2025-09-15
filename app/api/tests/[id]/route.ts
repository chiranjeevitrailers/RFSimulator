import { NextRequest, NextResponse } from 'next/server';

// Required for static export
import { createClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const testId = params.id;
    
    // Get test case details
    const { data: testCase, error: testError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('test_case_id', testId)
      .single();
    
    if (testError) {
      console.error('Database error:', testError);
      return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
    }
    
    // Get test case messages
    const { data: messages, error: messagesError } = await supabase
      .from('test_case_messages')
      .select('*')
      .eq('test_case_id', testCase.id)
      .order('step_order');
    
    if (messagesError) {
      console.error('Database error:', messagesError);
      return NextResponse.json({ error: 'Failed to fetch test messages' }, { status: 500 });
    }
    
    // Get information elements
    const { data: informationElements, error: iesError } = await supabase
      .from('test_case_information_elements')
      .select('*')
      .eq('test_case_id', testCase.id);
    
    if (iesError) {
      console.error('Database error:', iesError);
      return NextResponse.json({ error: 'Failed to fetch information elements' }, { status: 500 });
    }
    
    // Get layer parameters
    const { data: layerParameters, error: layerError } = await supabase
      .from('test_case_layer_parameters')
      .select('*')
      .eq('test_case_id', testCase.id);
    
    if (layerError) {
      console.error('Database error:', layerError);
      return NextResponse.json({ error: 'Failed to fetch layer parameters' }, { status: 500 });
    }
    
    // Format the response
    const response = {
      id: testCase.id,
      test_case_id: testCase.test_case_id,
      name: testCase.name,
      description: testCase.description,
      category: testCase.category,
      protocol: testCase.protocol,
      complexity: testCase.complexity,
      test_type: testCase.test_type,
      duration_minutes: testCase.duration_minutes,
      tags: testCase.tags,
      protocol_layers: testCase.protocol_layers,
      test_data: testCase.test_data,
      expected_results: testCase.expected_results,
      success_criteria: testCase.success_criteria,
      failure_thresholds: testCase.failure_thresholds,
      performance_targets: testCase.performance_targets,
      is_premium: testCase.is_premium,
      is_featured: testCase.is_featured,
      created_at: testCase.created_at,
      messages: messages?.map(msg => ({
        step_id: msg.step_id,
        step_order: msg.step_order,
        timestamp_ms: msg.timestamp_ms,
        direction: msg.direction,
        layer: msg.layer,
        protocol: msg.protocol,
        message_type: msg.message_type,
        message_name: msg.message_name,
        message_description: msg.message_description,
        standard_reference: msg.standard_reference,
        release_version: msg.release_version,
        dependencies: msg.dependencies,
        expected_response_step_id: msg.expected_response_step_id,
        timeout_ms: msg.timeout_ms,
        validation_criteria: msg.validation_criteria
      })) || [],
      information_elements: informationElements?.map(ie => ({
        ie_name: ie.ie_name,
        ie_type: ie.ie_type,
        ie_value: ie.ie_value,
        ie_value_hex: ie.ie_value_hex,
        ie_value_binary: ie.ie_value_binary,
        ie_size: ie.ie_size,
        mandatory: ie.mandatory,
        is_valid: ie.is_valid,
        validation_errors: ie.validation_errors,
        validation_warnings: ie.validation_warnings,
        standard_reference: ie.standard_reference
      })) || [],
      layer_parameters: layerParameters?.map(layer => ({
        layer: layer.layer,
        layer_configuration: layer.layer_configuration,
        layer_capabilities: layer.layer_capabilities,
        performance_metrics: layer.performance_metrics
      })) || []
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}