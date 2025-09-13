import { supabase } from './supabase';

export interface TestCaseMessage {
	id: string;
	test_case_id: string;
	order_index: number;
	layer: string;
	protocol: string;
	message_type: string;
	direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
	payload?: any;
}

export interface TestCaseInformationElement {
	id: string;
	test_case_id: string;
	message_id?: string;
	name: string;
	type: string;
	value: any;
	hex_value?: string;
	mandatory?: boolean;
}

export async function fetchActiveTestCases(limit = 100) {
	if (!supabase) throw new Error('Supabase not configured');
	const { data, error } = await supabase
		.from('test_cases')
		.select('*')
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.limit(limit);
	if (error) throw error;
	return data || [];
}

export async function fetchTestCaseMessages(testCaseId: string): Promise<TestCaseMessage[]> {
	if (!supabase) throw new Error('Supabase not configured');
	const { data, error } = await supabase
		.from('test_case_messages')
		.select('*')
		.eq('test_case_id', testCaseId)
		.order('order_index', { ascending: true });
	if (error) throw error;
	return (data as any[]) as TestCaseMessage[];
}

export async function fetchTestCaseIEs(testCaseId: string): Promise<TestCaseInformationElement[]> {
	if (!supabase) throw new Error('Supabase not configured');
	const { data, error } = await supabase
		.from('test_case_information_elements')
		.select('*')
		.eq('test_case_id', testCaseId);
	if (error) throw error;
	return (data as any[]) as TestCaseInformationElement[];
}

