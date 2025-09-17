// Generate NSA (Non-Standalone) Test Cases with Multiple Split Bearer Scenarios
// Comprehensive EN-DC, NE-DC, and NGEN-DC test cases

class NSATestCaseGenerator {
  constructor() {
    this.testCases = [];
    this.testMessages = [];
    this.informationElements = [];
    this.layerParameters = [];
  }

  // Generate all NSA test cases
  generateAllNSATestCases() {
    console.log('🚀 Starting generation of NSA test cases...');
    
    // EN-DC Test Cases (LTE anchor + NR secondary)
    this.generateENDCTestCases();
    
    // NE-DC Test Cases (NR anchor + LTE secondary)
    this.generateNEDCTestCases();
    
    // NGEN-DC Test Cases (NG-RAN + E-UTRAN)
    this.generateNGENDCTestCases();
    
    // Multiple Split Bearer Test Cases
    this.generateMultipleSplitBearerTestCases();
    
    // NSA Handover Test Cases
    this.generateNSAHandoverTestCases();
    
    // NSA PDU Session Test Cases
    this.generateNSAPDUTestCases();
    
    console.log(`✅ Generated ${this.testCases.length} NSA test cases`);
    return {
      testCases: this.testCases,
      testMessages: this.testMessages,
      informationElements: this.informationElements,
      layerParameters: this.layerParameters
    };
  }

  // Generate EN-DC (E-UTRAN-NR Dual Connectivity) test cases
  generateENDCTestCases() {
    console.log('📡 Generating EN-DC test cases...');

    // EN-DC Initial Access Test Cases
    const endcInitialAccessTests = [
      {
        id: 'NSA-EN-DC-IA-001',
        name: 'EN-DC Initial Access - Basic Setup',
        description: 'Basic EN-DC setup with LTE anchor and NR secondary',
        category: 'EN-DC_Initial_Access',
        subcategory: 'Basic_Setup',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'intermediate',
        priority: 'high',
        estimatedDuration: 180,
        preconditions: [
          'LTE eNodeB operational',
          'NR gNodeB operational',
          'UE supports EN-DC',
          'X2 interface configured',
          'S1-MME interface configured'
        ],
        testSteps: [
          'UE performs LTE attach',
          'eNodeB initiates EN-DC capability exchange',
          'eNodeB requests NR secondary cell addition',
          'gNodeB performs admission control',
          'RRC Connection Reconfiguration with NR SCG',
          'UE synchronizes to NR secondary cell',
          'EN-DC setup complete'
        ],
        expectedSignalingFlow: [
          'RRC Connection Request (LTE)',
          'RRC Connection Setup (LTE)',
          'RRC Connection Setup Complete (LTE)',
          'Attach Request (LTE)',
          'Attach Accept (LTE)',
          'RRC Connection Reconfiguration (EN-DC)',
          'RRC Connection Reconfiguration Complete (EN-DC)'
        ],
        expectedIEs: [
          'UE Capability Information',
          'EN-DC Capability',
          'NR Secondary Cell Group Config',
          'SCG Configuration',
          'Bearer Context',
          'Security Context'
        ],
        layerParameters: [
          'PHY: LTE DL/UL frequencies',
          'PHY: NR DL/UL frequencies',
          'MAC: LTE and NR scheduling',
          'RLC: Split bearer configuration',
          'PDCP: Data duplication',
          'RRC: Dual connectivity config'
        ],
        expectedResult: 'EN-DC established successfully',
        threeGPPRef: 'TS 37.340, TS 38.331'
      },
      {
        id: 'NSA-EN-DC-IA-002',
        name: 'EN-DC with Multiple NR Secondary Cells',
        description: 'EN-DC setup with multiple NR secondary cells',
        category: 'EN-DC_Initial_Access',
        subcategory: 'Multi_Cell_Setup',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 240,
        preconditions: [
          'LTE eNodeB operational',
          'Multiple NR gNodeBs operational',
          'UE supports multi-cell EN-DC',
          'X2 interfaces configured',
          'Carrier aggregation enabled'
        ],
        testSteps: [
          'UE performs LTE attach',
          'eNodeB initiates multi-cell EN-DC',
          'Add first NR secondary cell',
          'Add second NR secondary cell',
          'Configure carrier aggregation',
          'Verify multi-cell operation'
        ],
        expectedSignalingFlow: [
          'RRC Connection Reconfiguration (Multi-cell)',
          'SCG Addition Request',
          'SCG Addition Response',
          'RRC Connection Reconfiguration Complete'
        ],
        expectedIEs: [
          'Multi-cell SCG Config',
          'Carrier Aggregation Config',
          'NR Secondary Cell List',
          'SCG Bearer Config'
        ],
        layerParameters: [
          'PHY: Multiple NR carriers',
          'MAC: Multi-cell scheduling',
          'RLC: Multi-cell split bearers',
          'PDCP: Multi-path data routing'
        ],
        expectedResult: 'Multi-cell EN-DC established',
        threeGPPRef: 'TS 37.340, TS 38.331'
      }
    ];

    // EN-DC Split Bearer Test Cases
    const endcSplitBearerTests = [
      {
        id: 'NSA-EN-DC-SB-001',
        name: 'EN-DC MCG Split Bearer Setup',
        description: 'Setup MCG split bearer in EN-DC configuration',
        category: 'EN-DC_Split_Bearer',
        subcategory: 'MCG_Split',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 200,
        preconditions: [
          'EN-DC established',
          'UE supports split bearers',
          'PDCP duplication enabled',
          'LTE and NR bearers configured'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Configure MCG split bearer',
          'Setup PDCP duplication',
          'Verify data flow on both paths',
          'Test bearer modification'
        ],
        expectedSignalingFlow: [
          'RRC Connection Reconfiguration',
          'Bearer Setup Request',
          'PDCP Configuration',
          'Bearer Setup Response'
        ],
        expectedIEs: [
          'MCG Split Bearer Config',
          'PDCP Duplication Config',
          'Bearer Context',
          'QoS Parameters'
        ],
        layerParameters: [
          'PDCP: Duplication mode',
          'RLC: AM mode configuration',
          'MAC: Scheduling on both cells',
          'PHY: Dual path transmission'
        ],
        expectedResult: 'MCG split bearer established',
        threeGPPRef: 'TS 37.340, TS 38.323'
      },
      {
        id: 'NSA-EN-DC-SB-002',
        name: 'EN-DC SCG Split Bearer Setup',
        description: 'Setup SCG split bearer in EN-DC configuration',
        category: 'EN-DC_Split_Bearer',
        subcategory: 'SCG_Split',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 200,
        preconditions: [
          'EN-DC established',
          'UE supports SCG split bearers',
          'NR PDCP duplication enabled',
          'SCG bearers configured'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Configure SCG split bearer',
          'Setup NR PDCP duplication',
          'Verify SCG data flow',
          'Test SCG bearer modification'
        ],
        expectedSignalingFlow: [
          'SCG Addition Request',
          'SCG Split Bearer Config',
          'PDCP Configuration',
          'SCG Addition Response'
        ],
        expectedIEs: [
          'SCG Split Bearer Config',
          'NR PDCP Config',
          'SCG Bearer Context',
          'NR QoS Parameters'
        ],
        layerParameters: [
          'NR PDCP: Duplication mode',
          'NR RLC: AM mode',
          'NR MAC: SCG scheduling',
          'NR PHY: SCG transmission'
        ],
        expectedResult: 'SCG split bearer established',
        threeGPPRef: 'TS 37.340, TS 38.323'
      }
    ];

    // Add EN-DC test cases
    this.testCases.push(...endcInitialAccessTests, ...endcSplitBearerTests);
  }

  // Generate NE-DC (NR-E-UTRAN Dual Connectivity) test cases
  generateNEDCTestCases() {
    console.log('📡 Generating NE-DC test cases...');

    const nedcTests = [
      {
        id: 'NSA-NE-DC-001',
        name: 'NE-DC Initial Access - NR Anchor',
        description: 'NE-DC setup with NR as anchor and LTE as secondary',
        category: 'NE-DC_Initial_Access',
        subcategory: 'NR_Anchor',
        protocol: 'NE-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 220,
        preconditions: [
          'NR gNodeB operational',
          'LTE eNodeB operational',
          'UE supports NE-DC',
          'Xn interface configured',
          'NG interface configured'
        ],
        testSteps: [
          'UE performs NR initial access',
          'gNodeB initiates NE-DC capability exchange',
          'gNodeB requests LTE secondary cell addition',
          'eNodeB performs admission control',
          'RRC Connection Reconfiguration with LTE SCG',
          'UE synchronizes to LTE secondary cell',
          'NE-DC setup complete'
        ],
        expectedSignalingFlow: [
          'RRC Setup Request (NR)',
          'RRC Setup (NR)',
          'RRC Setup Complete (NR)',
          'Registration Request (NR)',
          'Registration Accept (NR)',
          'RRC Connection Reconfiguration (NE-DC)',
          'RRC Connection Reconfiguration Complete (NE-DC)'
        ],
        expectedIEs: [
          'UE Capability Information',
          'NE-DC Capability',
          'LTE Secondary Cell Group Config',
          'SCG Configuration',
          'Bearer Context',
          'Security Context'
        ],
        layerParameters: [
          'PHY: NR DL/UL frequencies',
          'PHY: LTE DL/UL frequencies',
          'MAC: NR and LTE scheduling',
          'RLC: Split bearer configuration',
          'PDCP: Data duplication',
          'RRC: Dual connectivity config'
        ],
        expectedResult: 'NE-DC established successfully',
        threeGPPRef: 'TS 37.340, TS 38.331'
      }
    ];

    this.testCases.push(...nedcTests);
  }

  // Generate NGEN-DC (NG-RAN-E-UTRAN Dual Connectivity) test cases
  generateNGENDCTestCases() {
    console.log('📡 Generating NGEN-DC test cases...');

    const ngendcTests = [
      {
        id: 'NSA-NGEN-DC-001',
        name: 'NGEN-DC Initial Access',
        description: 'NGEN-DC setup with NG-RAN and E-UTRAN',
        category: 'NGEN-DC_Initial_Access',
        subcategory: 'NG_RAN_Setup',
        protocol: 'NGEN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 250,
        preconditions: [
          'NG-RAN gNodeB operational',
          'E-UTRAN eNodeB operational',
          'UE supports NGEN-DC',
          'Xn interface configured',
          'NG interface configured'
        ],
        testSteps: [
          'UE performs initial access to NG-RAN',
          'gNodeB initiates NGEN-DC capability exchange',
          'gNodeB requests E-UTRAN secondary cell addition',
          'eNodeB performs admission control',
          'RRC Connection Reconfiguration with E-UTRAN SCG',
          'UE synchronizes to E-UTRAN secondary cell',
          'NGEN-DC setup complete'
        ],
        expectedSignalingFlow: [
          'RRC Setup Request (NG-RAN)',
          'RRC Setup (NG-RAN)',
          'RRC Setup Complete (NG-RAN)',
          'Registration Request (NG-RAN)',
          'Registration Accept (NG-RAN)',
          'RRC Connection Reconfiguration (NGEN-DC)',
          'RRC Connection Reconfiguration Complete (NGEN-DC)'
        ],
        expectedIEs: [
          'UE Capability Information',
          'NGEN-DC Capability',
          'E-UTRAN Secondary Cell Group Config',
          'SCG Configuration',
          'Bearer Context',
          'Security Context'
        ],
        layerParameters: [
          'PHY: NG-RAN DL/UL frequencies',
          'PHY: E-UTRAN DL/UL frequencies',
          'MAC: NG-RAN and E-UTRAN scheduling',
          'RLC: Split bearer configuration',
          'PDCP: Data duplication',
          'RRC: Dual connectivity config'
        ],
        expectedResult: 'NGEN-DC established successfully',
        threeGPPRef: 'TS 37.340, TS 38.331'
      }
    ];

    this.testCases.push(...ngendcTests);
  }

  // Generate Multiple Split Bearer test cases
  generateMultipleSplitBearerTestCases() {
    console.log('📡 Generating Multiple Split Bearer test cases...');

    const multipleSplitBearerTests = [
      {
        id: 'NSA-MSB-001',
        name: 'Multiple MCG Split Bearers',
        description: 'Setup multiple MCG split bearers simultaneously',
        category: 'Multiple_Split_Bearer',
        subcategory: 'Multiple_MCG_Split',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 300,
        preconditions: [
          'EN-DC established',
          'UE supports multiple split bearers',
          'Sufficient bearer resources',
          'PDCP duplication enabled'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Configure first MCG split bearer',
          'Configure second MCG split bearer',
          'Configure third MCG split bearer',
          'Verify all bearers active',
          'Test data flow on all bearers'
        ],
        expectedSignalingFlow: [
          'RRC Connection Reconfiguration (Bearer 1)',
          'RRC Connection Reconfiguration (Bearer 2)',
          'RRC Connection Reconfiguration (Bearer 3)',
          'Bearer Setup Confirmations'
        ],
        expectedIEs: [
          'Multiple MCG Split Bearer Configs',
          'PDCP Duplication Configs',
          'Bearer Context List',
          'QoS Parameter Sets'
        ],
        layerParameters: [
          'PDCP: Multiple duplication modes',
          'RLC: Multiple AM configurations',
          'MAC: Multi-bearer scheduling',
          'PHY: Multi-path transmission'
        ],
        expectedResult: 'Multiple MCG split bearers established',
        threeGPPRef: 'TS 37.340, TS 38.323'
      },
      {
        id: 'NSA-MSB-002',
        name: 'Mixed MCG and SCG Split Bearers',
        description: 'Setup both MCG and SCG split bearers simultaneously',
        category: 'Multiple_Split_Bearer',
        subcategory: 'Mixed_Split_Bearers',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 350,
        preconditions: [
          'EN-DC established',
          'UE supports mixed split bearers',
          'Both MCG and SCG resources available',
          'PDCP duplication on both paths'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Configure MCG split bearer',
          'Configure SCG split bearer',
          'Verify mixed bearer operation',
          'Test data flow on both bearer types'
        ],
        expectedSignalingFlow: [
          'MCG Split Bearer Configuration',
          'SCG Split Bearer Configuration',
          'Mixed Bearer Setup Confirmations'
        ],
        expectedIEs: [
          'MCG Split Bearer Config',
          'SCG Split Bearer Config',
          'Mixed Bearer Context',
          'Dual Path QoS Parameters'
        ],
        layerParameters: [
          'LTE PDCP: MCG duplication',
          'NR PDCP: SCG duplication',
          'LTE RLC: MCG AM mode',
          'NR RLC: SCG AM mode',
          'MAC: Dual path scheduling',
          'PHY: Dual technology transmission'
        ],
        expectedResult: 'Mixed MCG and SCG split bearers established',
        threeGPPRef: 'TS 37.340, TS 38.323'
      },
      {
        id: 'NSA-MSB-003',
        name: 'Multiple SCG Split Bearers with CA',
        description: 'Multiple SCG split bearers with carrier aggregation',
        category: 'Multiple_Split_Bearer',
        subcategory: 'SCG_CA_Split',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 400,
        preconditions: [
          'EN-DC established',
          'NR carrier aggregation enabled',
          'Multiple NR carriers available',
          'UE supports CA with split bearers'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Configure NR carrier aggregation',
          'Setup first SCG split bearer on CA',
          'Setup second SCG split bearer on CA',
          'Verify CA split bearer operation',
          'Test data flow across CA carriers'
        ],
        expectedSignalingFlow: [
          'SCG Addition Request (CA)',
          'SCG Split Bearer Config (CA)',
          'CA Configuration',
          'SCG Addition Response (CA)'
        ],
        expectedIEs: [
          'SCG CA Configuration',
          'Multiple SCG Split Bearer Configs',
          'NR PDCP CA Configs',
          'CA Bearer Context'
        ],
        layerParameters: [
          'NR PDCP: CA duplication modes',
          'NR RLC: CA AM configurations',
          'NR MAC: CA scheduling',
          'NR PHY: CA transmission'
        ],
        expectedResult: 'Multiple SCG split bearers with CA established',
        threeGPPRef: 'TS 37.340, TS 38.323, TS 38.331'
      },
      {
        id: 'NSA-MSB-004',
        name: 'Dynamic Split Bearer Addition/Removal',
        description: 'Dynamic addition and removal of split bearers',
        category: 'Multiple_Split_Bearer',
        subcategory: 'Dynamic_Split_Bearers',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'medium',
        estimatedDuration: 450,
        preconditions: [
          'EN-DC established',
          'UE supports dynamic bearer management',
          'Bearer modification procedures enabled'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Add first split bearer',
          'Add second split bearer',
          'Remove first split bearer',
          'Add third split bearer',
          'Verify dynamic bearer management'
        ],
        expectedSignalingFlow: [
          'Bearer Addition Request',
          'Bearer Addition Response',
          'Bearer Removal Request',
          'Bearer Removal Response',
          'Bearer Modification Confirmations'
        ],
        expectedIEs: [
          'Dynamic Bearer Config',
          'Bearer Addition/Removal IEs',
          'Bearer Context Updates',
          'QoS Parameter Updates'
        ],
        layerParameters: [
          'PDCP: Dynamic duplication config',
          'RLC: Dynamic AM configuration',
          'MAC: Dynamic scheduling',
          'PHY: Dynamic path management'
        ],
        expectedResult: 'Dynamic split bearer management successful',
        threeGPPRef: 'TS 37.340, TS 38.323'
      },
      {
        id: 'NSA-MSB-005',
        name: 'Split Bearer Load Balancing',
        description: 'Load balancing across multiple split bearers',
        category: 'Multiple_Split_Bearer',
        subcategory: 'Load_Balancing',
        protocol: 'EN-DC',
        testType: 'performance',
        complexity: 'advanced',
        priority: 'medium',
        estimatedDuration: 500,
        preconditions: [
          'Multiple split bearers established',
          'Load balancing algorithms enabled',
          'Traffic generators available'
        ],
        testSteps: [
          'Establish multiple split bearers',
          'Generate traffic on all bearers',
          'Monitor load distribution',
          'Adjust load balancing parameters',
          'Verify balanced traffic distribution'
        ],
        expectedSignalingFlow: [
          'Load Balancing Configuration',
          'Traffic Distribution Updates',
          'Load Balancing Confirmations'
        ],
        expectedIEs: [
          'Load Balancing Config',
          'Traffic Distribution IEs',
          'Bearer Load Information',
          'Load Balancing Parameters'
        ],
        layerParameters: [
          'PDCP: Load balancing algorithms',
          'RLC: Traffic distribution',
          'MAC: Load-aware scheduling',
          'PHY: Load-balanced transmission'
        ],
        expectedResult: 'Load balancing across split bearers successful',
        threeGPPRef: 'TS 37.340, TS 38.323'
      }
    ];

    this.testCases.push(...multipleSplitBearerTests);
  }

  // Generate NSA Handover test cases
  generateNSAHandoverTestCases() {
    console.log('📡 Generating NSA Handover test cases...');

    const nsaHandoverTests = [
      {
        id: 'NSA-HO-001',
        name: 'EN-DC Handover with Split Bearer Preservation',
        description: 'EN-DC handover while preserving split bearers',
        category: 'NSA_Handover',
        subcategory: 'EN_DC_Split_Bearer_HO',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 300,
        preconditions: [
          'EN-DC with split bearers established',
          'Target eNodeB supports EN-DC',
          'X2 interface configured',
          'Handover procedures enabled'
        ],
        testSteps: [
          'Trigger EN-DC handover',
          'Preserve split bearer configuration',
          'Transfer PDCP contexts',
          'Maintain data flow continuity',
          'Verify split bearer operation post-HO'
        ],
        expectedSignalingFlow: [
          'Handover Required (EN-DC)',
          'Handover Request (EN-DC)',
          'Handover Request Acknowledge (EN-DC)',
          'RRC Connection Reconfiguration (EN-DC HO)',
          'Handover Notify (EN-DC)'
        ],
        expectedIEs: [
          'EN-DC Handover Config',
          'Split Bearer Context',
          'PDCP Context Transfer',
          'SCG Configuration'
        ],
        layerParameters: [
          'PDCP: Context preservation',
          'RLC: Context transfer',
          'MAC: Handover scheduling',
          'PHY: Handover execution'
        ],
        expectedResult: 'EN-DC handover with split bearer preservation successful',
        threeGPPRef: 'TS 37.340, TS 23.502'
      }
    ];

    this.testCases.push(...nsaHandoverTests);
  }

  // Generate NSA PDU Session test cases
  generateNSAPDUTestCases() {
    console.log('📡 Generating NSA PDU Session test cases...');

    const nsaPDUTests = [
      {
        id: 'NSA-PDU-001',
        name: 'EN-DC PDU Session with Split Bearer',
        description: 'PDU session establishment over EN-DC with split bearer',
        category: 'NSA_PDU_Session',
        subcategory: 'EN_DC_Split_PDU',
        protocol: 'EN-DC',
        testType: 'functional',
        complexity: 'advanced',
        priority: 'high',
        estimatedDuration: 250,
        preconditions: [
          'EN-DC established',
          'SMF/UPF configured for EN-DC',
          'Split bearer support enabled',
          'PDU session resources available'
        ],
        testSteps: [
          'Establish EN-DC connection',
          'Request PDU session establishment',
          'Configure split bearer for PDU session',
          'Setup data path over split bearer',
          'Verify PDU session data flow'
        ],
        expectedSignalingFlow: [
          'PDU Session Establishment Request',
          'SMF Selection',
          'PFCP Session Creation',
          'Split Bearer Configuration',
          'PDU Session Establishment Accept'
        ],
        expectedIEs: [
          'PDU Session ID',
          'Split Bearer Config',
          'DNN Information',
          'QoS Flow Information'
        ],
        layerParameters: [
          'PDCP: PDU session duplication',
          'RLC: PDU session bearers',
          'MAC: PDU session scheduling',
          'PHY: PDU session transmission'
        ],
        expectedResult: 'PDU session over EN-DC split bearer established',
        threeGPPRef: 'TS 23.502, TS 37.340'
      }
    ];

    this.testCases.push(...nsaPDUTests);
  }

  // Generate test messages for NSA test cases
  generateNSATestMessages() {
    console.log('📡 Generating NSA test messages...');

    const nsaMessages = [
      // EN-DC Messages
      {
        id: 'msg-endc-001',
        testCaseId: 'NSA-EN-DC-IA-001',
        messageName: 'RRC Connection Reconfiguration (EN-DC)',
        direction: 'eNodeB_to_UE',
        layer: 'RRC',
        sequenceNumber: 1,
        description: 'RRC Connection Reconfiguration message for EN-DC setup',
        informationElements: [
          'EN-DC Capability',
          'SCG Configuration',
          'NR Secondary Cell Config',
          'Bearer Context'
        ],
        layerParameters: [
          'RRC: EN-DC config',
          'PDCP: Split bearer config',
          'RLC: AM mode config',
          'MAC: Dual connectivity config'
        ]
      },
      {
        id: 'msg-endc-002',
        testCaseId: 'NSA-EN-DC-IA-001',
        messageName: 'RRC Connection Reconfiguration Complete (EN-DC)',
        direction: 'UE_to_eNodeB',
        layer: 'RRC',
        sequenceNumber: 2,
        description: 'RRC Connection Reconfiguration Complete for EN-DC',
        informationElements: [
          'EN-DC Setup Complete',
          'SCG Status',
          'NR Cell Status',
          'Bearer Status'
        ],
        layerParameters: [
          'RRC: EN-DC complete',
          'PDCP: Split bearer active',
          'RLC: AM mode active',
          'MAC: Dual connectivity active'
        ]
      },
      // Split Bearer Messages
      {
        id: 'msg-msb-001',
        testCaseId: 'NSA-MSB-001',
        messageName: 'PDCP Data PDU (Split Bearer)',
        direction: 'UE_to_Network',
        layer: 'PDCP',
        sequenceNumber: 1,
        description: 'PDCP Data PDU transmitted over split bearer',
        informationElements: [
          'PDCP Sequence Number',
          'Bearer ID',
          'Data Payload',
          'Duplication Flag'
        ],
        layerParameters: [
          'PDCP: Duplication mode',
          'RLC: AM mode',
          'MAC: Dual path scheduling',
          'PHY: Dual transmission'
        ]
      }
    ];

    this.testMessages.push(...nsaMessages);
  }

  // Generate information elements for NSA test cases
  generateNSAInformationElements() {
    console.log('📡 Generating NSA information elements...');

    const nsaIEs = [
      {
        id: 'ie-endc-001',
        testCaseId: 'NSA-EN-DC-IA-001',
        name: 'EN-DC Capability',
        type: 'EN-DC Capability Information',
        mandatory: true,
        description: 'UE capability information for EN-DC support',
        values: [
          'EN-DC supported',
          'NR frequency bands supported',
          'Maximum number of NR secondary cells',
          'Split bearer support'
        ],
        threeGPPRef: 'TS 37.340'
      },
      {
        id: 'ie-endc-002',
        testCaseId: 'NSA-EN-DC-IA-001',
        name: 'SCG Configuration',
        type: 'Secondary Cell Group Configuration',
        mandatory: true,
        description: 'Configuration for NR secondary cell group',
        values: [
          'SCG ID',
          'NR cell configuration',
          'Bearer configuration',
          'Security configuration'
        ],
        threeGPPRef: 'TS 38.331'
      },
      {
        id: 'ie-msb-001',
        testCaseId: 'NSA-MSB-001',
        name: 'Split Bearer Configuration',
        type: 'Split Bearer Configuration Information',
        mandatory: true,
        description: 'Configuration for split bearer setup',
        values: [
          'Bearer ID',
          'Split type (MCG/SCG)',
          'PDCP duplication config',
          'QoS parameters'
        ],
        threeGPPRef: 'TS 37.340, TS 38.323'
      }
    ];

    this.informationElements.push(...nsaIEs);
  }

  // Generate layer parameters for NSA test cases
  generateNSALayerParameters() {
    console.log('📡 Generating NSA layer parameters...');

    const nsaLayerParams = [
      {
        id: 'param-endc-001',
        testCaseId: 'NSA-EN-DC-IA-001',
        layer: 'PHY',
        parameterName: 'LTE_DL_Frequency',
        value: '1850 MHz',
        description: 'LTE downlink frequency for EN-DC anchor',
        unit: 'MHz',
        range: '700-2600 MHz'
      },
      {
        id: 'param-endc-002',
        testCaseId: 'NSA-EN-DC-IA-001',
        layer: 'PHY',
        parameterName: 'NR_DL_Frequency',
        value: '3500 MHz',
        description: 'NR downlink frequency for EN-DC secondary',
        unit: 'MHz',
        range: '1000-6000 MHz'
      },
      {
        id: 'param-msb-001',
        testCaseId: 'NSA-MSB-001',
        layer: 'PDCP',
        parameterName: 'Duplication_Mode',
        value: 'Enabled',
        description: 'PDCP duplication mode for split bearers',
        unit: 'Boolean',
        range: 'Enabled/Disabled'
      },
      {
        id: 'param-msb-002',
        testCaseId: 'NSA-MSB-001',
        layer: 'RLC',
        parameterName: 'AM_Mode_Configuration',
        value: 'Acknowledged Mode',
        description: 'RLC acknowledged mode for split bearers',
        unit: 'Mode',
        range: 'AM/UM/TM'
      }
    ];

    this.layerParameters.push(...nsaLayerParams);
  }

  // Export all NSA test data
  exportNSATestData() {
    this.generateNSATestMessages();
    this.generateNSAInformationElements();
    this.generateNSALayerParameters();

    return {
      testCases: this.testCases,
      testMessages: this.testMessages,
      informationElements: this.informationElements,
      layerParameters: this.layerParameters
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NSATestCaseGenerator;
} else {
  window.NSATestCaseGenerator = NSATestCaseGenerator;
}

console.log('📡 NSA Test Case Generator loaded');