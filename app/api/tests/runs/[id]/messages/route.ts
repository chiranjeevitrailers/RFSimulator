import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin!;
    const runId = params.id;
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const layer = searchParams.get('layer');
    const protocol = searchParams.get('protocol');
    const direction = searchParams.get('direction');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query for decoded messages
    let query = supabase
      .from('decoded_messages')
      .select(`
        *,
        decoded_information_elements(*),
        decoded_layer_parameters(*)
      `)
      .eq('test_run_id', runId)
      .order('timestamp_us', { ascending: true });
    
    // Apply filters
    if (layer && layer !== 'all') {
      query = query.eq('layer', layer);
    }
    
    if (protocol && protocol !== 'all') {
      query = query.eq('protocol', protocol);
    }
    
    if (direction && direction !== 'all') {
      query = query.eq('message_direction', direction);
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data: messages, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
    
    // Get layer statistics
    const { data: layerStats } = await supabase
      .rpc('get_layer_statistics', { test_run_uuid: runId });
    
    // Get protocol statistics
    const { data: protocolStats } = await supabase
      .rpc('get_protocol_statistics', { test_run_uuid: runId });
    
    // Get total count
    const { count } = await supabase
      .from('decoded_messages')
      .select('*', { count: 'exact', head: true })
      .eq('test_run_id', runId);
    
    // Format messages for frontend
    const formattedMessages = messages?.map(msg => ({
      id: msg.id,
      message_id: msg.message_id,
      timestamp_us: msg.timestamp_us,
      timestamp_ms: Math.floor(msg.timestamp_us / 1000),
      protocol: msg.protocol,
      message_type: msg.message_type,
      message_name: msg.message_name,
      message_direction: msg.message_direction,
      layer: msg.layer,
      sublayer: msg.sublayer,
      source_entity: msg.source_entity,
      target_entity: msg.target_entity,
      decoded_data: msg.decoded_data,
      information_elements: msg.decoded_information_elements || [],
      layer_parameters: msg.decoded_layer_parameters || [],
      validation_status: msg.validation_status,
      validation_errors: msg.validation_errors,
      validation_warnings: msg.validation_warnings,
      standard_reference: msg.standard_reference,
      ie_count: msg.ie_count
    })) || [];
    
    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        total: count || 0,
        limit,
        offset,
        has_more: (offset + limit) < (count || 0)
      },
      statistics: {
        layers: layerStats || [],
        protocols: protocolStats || []
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}