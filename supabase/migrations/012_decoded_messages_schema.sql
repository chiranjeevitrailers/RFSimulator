-- ==============================================
-- 5GLabX Platform - Decoded Messages Schema
-- Tables for storing parsed log data from PCAP files
-- ==============================================

-- Decoded messages from log files (PCAP, QXDM, etc.)
CREATE TABLE IF NOT EXISTS public.decoded_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    log_file_id UUID NOT NULL, -- Reference to uploaded log file
    test_run_id UUID REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    
    -- Message identification
    message_id TEXT NOT NULL,
    timestamp_us BIGINT NOT NULL, -- Microsecond timestamp
    sequence_number INTEGER,
    
    -- Protocol information
    protocol TEXT NOT NULL, -- NR, LTE, SIP, E2, PC5, etc.
    protocol_version TEXT,
    message_type TEXT NOT NULL, -- RRCSetupRequest, SIP INVITE, etc.
    message_name TEXT NOT NULL,
    message_direction TEXT NOT NULL CHECK (message_direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    
    -- Layer mapping
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'E2', 'PC5')),
    sublayer TEXT, -- For sub-layer identification
    
    -- Network entities
    source_entity TEXT, -- UE, gNodeB, AMF, SMF, etc.
    target_entity TEXT,
    entity_id TEXT, -- Specific entity identifier
    
    -- Message data
    raw_data BYTEA, -- Original binary data
    hex_data TEXT, -- Hex representation
    decoded_data JSONB NOT NULL, -- Parsed message content
    
    -- Information elements
    information_elements JSONB DEFAULT '{}', -- Extracted IEs
    ie_count INTEGER DEFAULT 0,
    
    -- Validation and analysis
    validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'warning')),
    validation_errors TEXT[] DEFAULT '{}',
    validation_warnings TEXT[] DEFAULT '{}',
    
    -- Performance metrics
    message_size INTEGER,
    processing_time_ms INTEGER,
    
    -- 3GPP compliance
    standard_reference TEXT, -- TS 38.331, TS 36.331, etc.
    release_version TEXT, -- Rel-15, Rel-16, etc.
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Information elements extracted from messages
CREATE TABLE IF NOT EXISTS public.decoded_information_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.decoded_messages(id) ON DELETE CASCADE,
    
    -- IE identification
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL, -- integer, bit_string, enumerated, etc.
    ie_path TEXT, -- JSON path for nested IEs
    
    -- IE values
    ie_value JSONB, -- Parsed value
    ie_value_hex TEXT, -- Hex representation
    ie_value_binary TEXT, -- Binary representation
    ie_size INTEGER, -- Size in bits/bytes
    
    -- IE properties
    mandatory BOOLEAN DEFAULT false,
    presence TEXT DEFAULT 'present' CHECK (presence IN ('present', 'absent', 'optional')),
    
    -- Validation
    is_valid BOOLEAN DEFAULT true,
    validation_errors TEXT[] DEFAULT '{}',
    validation_warnings TEXT[] DEFAULT '{}',
    
    -- 3GPP compliance
    standard_reference TEXT,
    ie_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Layer parameters extracted from messages
CREATE TABLE IF NOT EXISTS public.decoded_layer_parameters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.decoded_messages(id) ON DELETE CASCADE,
    
    -- Layer information
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'E2', 'PC5')),
    parameter_category TEXT, -- radio, security, mobility, etc.
    
    -- Parameter data
    parameter_name TEXT NOT NULL,
    parameter_type TEXT NOT NULL,
    parameter_value JSONB NOT NULL,
    parameter_unit TEXT, -- ms, dBm, MHz, etc.
    
    -- Context
    context TEXT, -- measurement, configuration, status, etc.
    source TEXT, -- message, derived, calculated
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Log files uploaded for analysis
CREATE TABLE IF NOT EXISTS public.log_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_run_id UUID REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    
    -- File information
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL, -- pcap, qxdm, etw, etc.
    mime_type TEXT,
    
    -- Upload information
    upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_status TEXT DEFAULT 'uploaded' CHECK (processing_status IN ('uploaded', 'processing', 'completed', 'failed')),
    processing_error TEXT,
    
    -- Analysis results
    total_messages INTEGER DEFAULT 0,
    decoded_messages INTEGER DEFAULT 0,
    failed_messages INTEGER DEFAULT 0,
    processing_time_seconds INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message flow analysis results
CREATE TABLE IF NOT EXISTS public.message_flow_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    log_file_id UUID NOT NULL REFERENCES public.log_files(id) ON DELETE CASCADE,
    
    -- Flow identification
    flow_id TEXT NOT NULL,
    flow_type TEXT NOT NULL, -- initial_access, handover, call_setup, etc.
    flow_status TEXT DEFAULT 'active' CHECK (flow_status IN ('active', 'completed', 'failed', 'timeout')),
    
    -- Flow timing
    start_timestamp_us BIGINT NOT NULL,
    end_timestamp_us BIGINT,
    duration_ms INTEGER,
    
    -- Flow statistics
    total_messages INTEGER DEFAULT 0,
    successful_messages INTEGER DEFAULT 0,
    failed_messages INTEGER DEFAULT 0,
    retransmissions INTEGER DEFAULT 0,
    
    -- Flow entities
    ue_identity TEXT,
    cell_id TEXT,
    amf_id TEXT,
    smf_id TEXT,
    
    -- Flow results
    flow_result JSONB DEFAULT '{}',
    kpi_metrics JSONB DEFAULT '{}',
    error_analysis JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_decoded_messages_log_file_id ON public.decoded_messages(log_file_id);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_test_run_id ON public.decoded_messages(test_run_id);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_timestamp ON public.decoded_messages(timestamp_us);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_protocol ON public.decoded_messages(protocol);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_layer ON public.decoded_messages(layer);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_message_type ON public.decoded_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_direction ON public.decoded_messages(message_direction);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_validation_status ON public.decoded_messages(validation_status);

CREATE INDEX IF NOT EXISTS idx_decoded_ies_message_id ON public.decoded_information_elements(message_id);
CREATE INDEX IF NOT EXISTS idx_decoded_ies_name ON public.decoded_information_elements(ie_name);
CREATE INDEX IF NOT EXISTS idx_decoded_ies_type ON public.decoded_information_elements(ie_type);

CREATE INDEX IF NOT EXISTS idx_decoded_params_message_id ON public.decoded_layer_parameters(message_id);
CREATE INDEX IF NOT EXISTS idx_decoded_params_layer ON public.decoded_layer_parameters(layer);
CREATE INDEX IF NOT EXISTS idx_decoded_params_category ON public.decoded_layer_parameters(parameter_category);

CREATE INDEX IF NOT EXISTS idx_log_files_user_id ON public.log_files(user_id);
CREATE INDEX IF NOT EXISTS idx_log_files_test_run_id ON public.log_files(test_run_id);
CREATE INDEX IF NOT EXISTS idx_log_files_processing_status ON public.log_files(processing_status);
CREATE INDEX IF NOT EXISTS idx_log_files_file_type ON public.log_files(file_type);

CREATE INDEX IF NOT EXISTS idx_message_flow_test_run_id ON public.message_flow_analysis(test_run_id);
CREATE INDEX IF NOT EXISTS idx_message_flow_log_file_id ON public.message_flow_analysis(log_file_id);
CREATE INDEX IF NOT EXISTS idx_message_flow_flow_id ON public.message_flow_analysis(flow_id);
CREATE INDEX IF NOT EXISTS idx_message_flow_status ON public.message_flow_analysis(flow_status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.decoded_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoded_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoded_layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_flow_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decoded_messages
CREATE POLICY "Users can view messages from their test runs" ON public.decoded_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = decoded_messages.test_run_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages for their test runs" ON public.decoded_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = decoded_messages.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for decoded_information_elements
CREATE POLICY "Users can view IEs from their messages" ON public.decoded_information_elements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.decoded_messages dm
            JOIN public.test_case_executions tce ON dm.test_run_id = tce.id
            WHERE dm.id = decoded_information_elements.message_id 
            AND tce.user_id = auth.uid()
        )
    );

-- RLS Policies for decoded_layer_parameters
CREATE POLICY "Users can view parameters from their messages" ON public.decoded_layer_parameters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.decoded_messages dm
            JOIN public.test_case_executions tce ON dm.test_run_id = tce.id
            WHERE dm.id = decoded_layer_parameters.message_id 
            AND tce.user_id = auth.uid()
        )
    );

-- RLS Policies for log_files
CREATE POLICY "Users can view their own log files" ON public.log_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own log files" ON public.log_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own log files" ON public.log_files
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for message_flow_analysis
CREATE POLICY "Users can view flows from their test runs" ON public.message_flow_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = message_flow_analysis.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER update_decoded_messages_updated_at 
    BEFORE UPDATE ON public.decoded_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_log_files_updated_at 
    BEFORE UPDATE ON public.log_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get layer statistics
CREATE OR REPLACE FUNCTION get_layer_statistics(test_run_uuid UUID)
RETURNS TABLE (
    layer TEXT,
    message_count BIGINT,
    avg_size NUMERIC,
    error_count BIGINT,
    warning_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.layer,
        COUNT(*) as message_count,
        ROUND(AVG(dm.message_size), 2) as avg_size,
        COUNT(CASE WHEN dm.validation_status = 'invalid' THEN 1 END) as error_count,
        COUNT(CASE WHEN dm.validation_status = 'warning' THEN 1 END) as warning_count
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.layer
    ORDER BY dm.layer;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get protocol statistics
CREATE OR REPLACE FUNCTION get_protocol_statistics(test_run_uuid UUID)
RETURNS TABLE (
    protocol TEXT,
    message_count BIGINT,
    unique_message_types BIGINT,
    avg_processing_time NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.protocol,
        COUNT(*) as message_count,
        COUNT(DISTINCT dm.message_type) as unique_message_types,
        ROUND(AVG(dm.processing_time_ms), 2) as avg_processing_time
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.protocol
    ORDER BY dm.protocol;
END;
$$ LANGUAGE plpgsql;

-- Create a view for message flow timeline
CREATE OR REPLACE VIEW public.message_flow_timeline AS
SELECT 
    dm.id,
    dm.test_run_id,
    dm.timestamp_us,
    dm.protocol,
    dm.message_type,
    dm.message_name,
    dm.message_direction,
    dm.layer,
    dm.source_entity,
    dm.target_entity,
    dm.validation_status,
    dm.standard_reference,
    tce.user_id
FROM public.decoded_messages dm
JOIN public.test_case_executions tce ON dm.test_run_id = tce.id;

-- Grant permissions
GRANT SELECT ON public.message_flow_timeline TO authenticated;
GRANT EXECUTE ON FUNCTION get_layer_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_protocol_statistics(UUID) TO authenticated;

-- Add comments
COMMENT ON TABLE public.decoded_messages IS 'Decoded messages from log files with layer mapping and validation';
COMMENT ON TABLE public.decoded_information_elements IS 'Information elements extracted from decoded messages';
COMMENT ON TABLE public.decoded_layer_parameters IS 'Layer-specific parameters extracted from messages';
COMMENT ON TABLE public.log_files IS 'Uploaded log files for analysis';
COMMENT ON TABLE public.message_flow_analysis IS 'Analysis results of message flows';

COMMENT ON VIEW public.message_flow_timeline IS 'Timeline view of decoded messages for flow analysis';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Decoded messages schema migration completed successfully!';
    RAISE NOTICE '📊 Created 5 new tables for log analysis';
    RAISE NOTICE '🔒 Enabled Row Level Security on all tables';
    RAISE NOTICE '📈 Created performance indexes and views';
    RAISE NOTICE '🎯 Added layer mapping and validation support';
    RAISE NOTICE '⚡ Created utility functions for statistics';
END $$;