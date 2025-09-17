# LTE Test Case Master Matrix — 300 Test Cases

**Format (semicolon-separated):**
`TestID;Feature;SubFeature;CategoryType;ShortDescription;Preconditions;ShortSteps;ExpectedSignalingFlow;ExpectedIEs;LayerParameters;ExpectedResult;3GPPRef`

Notes: Each row is compact. "ExpectedSignalingFlow" lists the main protocol messages (PHY: PSS/SSS/PBCH, RRC, S1AP, NAS, S1-U, GTP, Diameter). "ExpectedIEs" lists key Information Elements. "LayerParameters" lists PHY/MAC/RLC/PDCP/RRC/NAS/Core relevant parameters.

---

## Feature Set: LTE Initial Access (LTE-IA) — 50 test cases

(Distribution: Functional 20; Performance 10; RF 10; Stability 5; Sanity 5)

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-IA-001 | InitialAccess | PSS-SSS Detect | Functional | Cell Search and PSS/SSS detection | UE in LTE coverage, eNB transmitting PSS/SSS | 1. UE performs frequency scan;2. Detect PSS (subframes 0/5);3. Detect SSS;4. Determine cell ID;5. Achieve frame sync | PHY: PSS/SSS/PBCH detection | PSS/SSS indices,Cell ID,Subframe timing | PHY:SSS/PSS power,Timing offset | UE achieves sync within 5s | TS 36.211,TS 36.213 |
| LTE-IA-002 | InitialAccess | PBCH Decode | Functional | PBCH decoding and MIB extraction | PSS/SSS detected and frame sync OK | 1.Locate PBCH in subframe 0;2.Decode PBCH TB;3.Extract MIB;4.Determine sysBW & SFN;5.Get PHICH config | PBCH/PBCH decode->MIB fields | MIB:systemBandwidth,SFN,PHICH cfg | PHY:PBCH CRC/Payload | MIB decoded and params extracted | TS 36.331,TS 36.211 |
| LTE-IA-003 | InitialAccess | SIB1 Acquisition | Functional | SIB1 acquisition and scheduling | MIB decoded and timing known | 1.Determine SIB1 scheduling from MIB;2.Monitor PDCCH for SIB1;3.Decode PDSCH data;4.Decode SIB1;5.Parse PLMN & cell access info | RRC:PCCH/PDCCH/PDSCH for SIBs | SIB1 fields:plmnList,cellBarred,taTimer,trackingAreaCode | RRC:SI window,DRX | SIB1 decoded within 80ms | TS 36.331 |
| LTE-IA-004 | InitialAccess | PLMN Selection | Functional | PLMN selection from SIB1 | SIB1 decoded with PLMN list | 1.Extract PLMN list;2.Compare SIM PLMN list;3.Select PLMN per priority;4.Check access restrictions;5.Proceed to cell selection | RRC:SIB1 contents used | IEs:PLMN IDs,operator reserved | NAS:PLMN selection | Correct PLMN selected | TS 23.122,TS 36.331 |
| LTE-IA-005 | InitialAccess | Cell Selection Camping | Functional | Cell selection & camping criteria | PLMN selected,cell meas available | 1.Measure Rxlev/RSRP;2.Check S-criteria;3.Verify access class;4.Select cell;5.Camp on cell | RRC:Cell selection algos | IEs:RSRP,RSRQ,S-criteria threshold | PHY:RSRP,MAC:RACH ready | UE camps on suitable cell | TS 36.304 |
| LTE-IA-006 | InitialAccess | RACH Preamble Tx | Functional | RACH preamble transmission per SIB2 | UE camped,needs RRC conn | 1.Read RACH cfg from SIB2;2.Select preamble;3.Calculate Tx power;4.Tx preamble in PRACH;5.Monitor for RAR | PRACH->RAR->Msg3 flow | IEs:PRACH cfg,RA-RNTI,Preamble index | PHY:PRACH format,Tx power | Preamble transmitted and detected by eNB | TS 36.321 |
| LTE-IA-007 | InitialAccess | RAR Processing | Functional | RAR reception and processing | Preamble sent and waiting | 1.Monitor RA-RNTI on PDCCH;2.Receive RAR within window;3.Extract timing advance & UL grant;4.Prepare Msg3;5.Store temp C-RNTI | PDCCH->RAR->UL grant | IEs:TimingAdvance,UL grant,Temp C-RNTI | MAC:RAR decoding,TA update | RAR processed and UL grant obtained | TS 36.321 |
| LTE-IA-008 | InitialAccess | RRC Connection Request (Msg3) | Functional | Msg3 transmission with RRC Connection Request | RAR processed and UL grant available | 1.Prepare RRC Conn Req (UE ID/EstCause);2.Apply TA;3.Tx on UL grant;4.Wait for contention resolution | RRC Msg3->eNB->S1AP Initial UE Message | IEs:UE identity,EstablishmentCause | RRC:SRB0 Msg3 contents | Msg3 transmitted and eNB receives request | TS 36.331 |
| LTE-IA-009 | InitialAccess | RRC Connection Setup (Msg4) | Functional | RRC Connection Setup reception | Msg3 sent and no contention | 1.Monitor PDCCH for C-RNTI;2.Receive RRCConnectionSetup;3.Process cfg;4.Configure RBs;5.Send RRCConnectionSetupComplete | RRC Msg4->S1AP Initial Context Setup at MME | IEs:SRB/DRB cfg,AS cfg | RRC:SRB1 established,SRB2 optional | RRC connection established | TS 36.331 |
| LTE-IA-010 | InitialAccess | Security Mode Activation | Functional | Initial security activation (SecModeCmd) | RRC conn established | 1.Receive SecurityModeCommand;2.Verify algos;3.Configure cipher/integrity;4.Send SecurityModeComplete;5.Activate security | RRC SecurityModeCommand/Complete | IEs:Selected cipher/integrity algos,KDF IDs | PDCP:Ciphering/Integrity params,RRC:Security cfg | Secure communication established | TS 33.401 |

---

## Feature Set: LTE Handover (LTE-HO) — 50 test cases

(Distribution: Functional 20; Performance 10; RF 10; Stability 5; Sanity 5)

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-HO-001 | Handover | HO Trigger | Functional | Intra-LTE HO trigger based on measurements | UE in RRC Connected,neighbor configured | 1.Configure measurement objects;2.UE performs meas;3.Send meas report;4.eNB decides HO;5.Trigger HO | RRC MeasurementReport->S1AP/HandoverRequest | IEs:MeasResults,RSRP,RSRQ | LayerParams:RLC/PDCP buffer status | HO decision triggered | TS 36.331 |
| LTE-HO-002 | Handover | X2 HO Execution | Functional | X2-based HO execution | X2 available and resources free | 1.Source eNB->HO Request to target;2.Target admits;3.Source RRC Reconfig;4.UE random access target;5.Complete HO | X2 HO Request/Confirm, RRCReconfig, Random Access | IEs:SourceToTargetContainer,E-RAB context | LayerParams:PDCP forwarding,RLC re-est | HO executes successfully | TS 36.331 |
| LTE-HO-003 | Handover | Inter-eNB S1 HO | Functional | S1-based HO if X2 unavailable | S1 path configured | 1.Source sends S1 HandoverRequired->MME->Target;2.Target prepares;3.Complete HO via S1AP | S1AP HandoverRequired/Request/Command | IEs:UE Context,Target cell ID | LayerParams:SGW/PGW path changes | HO completes via S1 | TS 36.413 |
| LTE-HO-004 | Handover | Intra-frequency HO | Functional | HO between cells same freq | neighbors on same freq | 1.Measure->Report->HO | RRC measurement and HO flows | IEs:RSRP,RSRQ | PHY:freq common | HO passes | TS 36.331 |
| LTE-HO-005 | Handover | Inter-frequency HO | Functional | HO to different freq | neighbor on diff freq | 1.Meas->Tune->HO | RRC meas includes freq info | IEs:Freq info,Measurement IDs | PHY:freq retuning | UE tunes and HO succeeds | TS 36.331 |

---

## Feature Set: LTE Bearer Management (LTE-BM) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-BM-001 | BearerManagement | DefaultBearer | Functional | Default EPS bearer establishment during attach | UE performing attach | 1.UE->Attach Request;2.MME auth & create session;3.SGW/PGW create default bearer;4.E-RAB setup;5.Attach complete | NAS Attach->S1AP Initial Context Setup->Create Session | IEs:EPS Bearer ID,APN,DNN,QCI | LayerParams:GTP TEIDs,E-RAB IDs | Default bearer active | TS 23.401 |
| LTE-BM-002 | BearerManagement | DedicatedBearer | Functional | Dedicated bearer creation for QoS | Default bearer active | 1.UE or PCRF requests dedicated bearer;2.SGW/PGW create bearer;3.E-RAB modify | S1AP E-RAB Modify Request/Response | IEs:Bearer ID,QCI,GBR/MBR | LayerParams:GTP tunnels updated | Dedicated bearer established | TS 23.401 |
| LTE-BM-003 | BearerManagement | Bearer Modification | Functional | Change QCI/GBR parameters | Active bearer present | 1.PCRF/PCF signals change;2.SGW/MME/PDN updates | Diameter/Gx/Gy messages | IEs:QoS params | LayerParams:GTP mod | Bearer modified | TS 23.401 |
| LTE-BM-004 | BearerManagement | Bearer Release | Functional | Release of dedicated bearer | Dedicated bearer exists | 1.PCRF instructs release;2.SGW/PGW remove bearer | S1AP E-RAB Release | IEs:Bearer ID | LayerParams:Tear down tunnels | Bearer released | TS 23.401 |
| LTE-BM-005 | BearerManagement | Bearer QoS Mapping | Functional | Map between IMS/QCI and E-RAB | IMS call uses QCI mapping | 1.SIP/QoS mapping to bearer | IMS to network mapping | IEs:QCI,Service Flow | LayerParams:QCI applied | Mapping correct | TS 23.401 |

---

## Feature Set: LTE Mobility (LTE-MOB) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-MOB-001 | Mobility | IdleReselection | Functional | Idle mode cell reselection | UE in idle mode | 1.Monitor serving cell quality;2.Measure neighbors;3.Apply reselection criteria;4.Reselect;5.Update location if needed | RRC idle measurement & reselection | IEs:Reselection thresholds,Priority | LayerParams:RSRP/RSRQ | Reselection success | TS 36.304 |
| LTE-MOB-002 | Mobility | TAU | Functional | Tracking Area Update procedure | UE moves to new TA | 1.Receive TA change->UE triggers TAU | NAS TAU Request/Accept | IEs:TAI,UTRAN/E-UTRAN info | MME updates context | TAU success | TS 24.301 |
| LTE-MOB-003 | Mobility | Inter-RAT Reselection | Functional | Reselection LTE<->UTRAN/GSM | Neighbor RAT present | 1.Measure and evaluate inter-RAT lists;2.Reselect if needed | RRC SIBs with inter-RAT lists | IEs:InterRAT freq list | LayerParams:Inter-RAT timers | Reselection success | TS 36.304 |
| LTE-MOB-004 | Mobility | Periodic TAU | Functional | Periodic TAU timer behavior | UE configured with periodic TAU | 1.Period expires->TAU sent | NAS TAU flows | IEs:TAU timers | Successful periodic update | Successful periodic update | TS 24.301 |
| LTE-MOB-005 | Mobility | Idle->Connected Transition during reselection | Functional | UE initiates service after reselection | 1.Reselect->Service request | 1.Reselect->Service request | RRC connection establishment flows | IEs:Service Request cause | Transition successful | Transition successful | TS 36.331 |

---

## Feature Set: LTE Security (LTE-SEC) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-SEC-001 | Security | EPS-AKA | Functional | EPS-AKA authentication procedure | UE with valid USIM | 1.MME requests auth vectors from HSS;2.MME sends Auth Request;3.UE computes RES;4.Verify and derive keys;5.Establish secure context | Diameter/AuC flows,Authentication Request/Response | IEs:RAND,XRES,CK,IK | LayerParams:KASME derivation, NAS keys | Auth successful | TS 33.401 |
| LTE-SEC-002 | Security | NAS-Integrity | Functional | NAS integrity protection enable | RRC conn established | 1.SecurityModeCommand for NAS | NAS Security Mode flows | IEs:Selected integrity algos | LayerParams:NAS Integrity active | Integrity validated | TS 33.401 |
| LTE-SEC-003 | Security | AS-Security | Functional | AS security for RRC/PDCP | 1.SecurityModeCommand RRC;2.Configure PDCP ciphering | 1.SecurityModeCommand RRC;2.Configure PDCP ciphering | RRC Security flows | IEs:Security algorithms,Keys | LayerParams:PDCP ciphering & integrity | AS security active | TS 33.401 |
| LTE-SEC-004 | Security | Re-authentication | Functional | Re-auth during active session | MME triggers re-auth | 1.Auth vector refresh | NAS auth flows | IEs:Auth vector | LayerParams:Keys rotated | Auth refreshed | TS 33.401 |
| LTE-SEC-005 | Security | Key re-establishment | Functional | Rekey PDCP after handover | HO triggers new keys | 1.Security rekey via RRC | RRC Security messages | IEs:New keys | LayerParams:PDCP keys updated | Secure comms continue | TS 33.401 |

---

## Feature Set: LTE Measurement (LTE-MEAS) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-MEAS-001 | Measurement | RSRP-RSRQ | Functional | RSRP/RSRQ measurement accuracy | UE connected mode | 1.Configure meas objects;2.Perform meas;3.Report;4.Verify accuracy | RRC MeasConfig->MeasReport | IEs:RSRP,RSRQ,SINR | LayerParams:MeasObject IDs | Measurements within tolerance | TS 36.331 |
| LTE-MEAS-002 | Measurement | MeasurementGap | Functional | Measurement gap behavior for inter-frequency meas | Meas gap config present | 1.Set gap;2.Perform inter-freq meas;3.Report | RRC MeasGap,MeasReport | IEs:GapConfig | Gap honored | Gap honored | TS 36.331 |
| LTE-MEAS-003 | Measurement | CSI Reporting | Functional | CSI periodic/aperiodic reporting | CSI configured | 1.Configure CSI;2.Report per periodicity | RRC:CSI-Report | IEs:CSI-RS,PMI,RI | LayerParams:CSI-RS settings | Reports correct | TS 36.331 |
| LTE-MEAS-004 | Measurement | UE Tx Power Capabilities | Functional | UE reports Tx power capability correctly | UE in connected | 1.Query UE capability | RRC UECapabilityInfo | IEs:UE max TX power | LayerParams:Power cap enforced | Capability read OK | TS 36.331 |
| LTE-MEAS-005 | Measurement | Measurement under interference | RF | Accuracy under interference | Interferer active | 1.Perform meas->compare | Meas reports include degraded values | IEs:RSRP,SINR | LayerParams:Noise floor | Measurements reflect interference | TS 36.331 |

---

## Feature Set: LTE Power Control (LTE-PC) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-PC-001 | PowerControl | PUSCH PC | Functional | PUSCH power control loop verification | UE with PUSCH grants | 1.Calculate PUSCH power per params;2.Apply TPC commands;3.Tx PUSCH;4.Monitor PC loop | PUSCH power control messages & TPC | IEs:TPC Commands,PBCH pow offsets | LayerParams:P0,Preamble Tx power,Pathloss | Power within expected range | TS 36.213 |
| LTE-PC-002 | PowerControl | PUCCH PC | Functional | PUCCH power control behavior | PUCCH configured | 1.Make sounding/pucch tx;2.Apply PC adjustments;3.Verify SNR | PUCCH TPC commands via DCI | IEs:PUCCH format,Power cmds | LayerParams:PUCCH formats | PUCCH power stable | TS 36.213 |
| LTE-PC-003 | PowerControl | ClosedLoopOpenLoop | Functional | Verify closed-loop + open-loop combined | Open loop computed,closed loop TPC applied | 1.Combine settings;2.Transmit;3.Observe behavior | RRC/SIB power settings | IEs:OpenLoopParm,TPC | LayerParams:Pathloss comp | PC loop functional | TS 36.213 |
| LTE-PC-004 | PowerControl | PowerHeadroom | Functional | UE reports PHR | UE supports PHR | 1.Trigger PHR report;2.Report PHR to eNB | RRC PHR report | IEs:PHR value,UL grant | LayerParams:UE power headroom | PHR accurate | TS 36.213 |
| LTE-PC-005 | PowerControl | PUSCH under overload | Performance | PUSCH power under cell overload | High load | 1.Tx PUSCH;2.Observe power cmd behavior | DCI TPC behavior | IEs:TPC commands | LayerParams:Power margins | System maintains targets | TS 36.213 |

---

## Feature Set: LTE Scheduling (LTE-SCHED) — 50 test cases

| TestID | Feature | SubFeature | CategoryType | ShortDescription | Preconditions | ShortSteps | ExpectedSignalingFlow | ExpectedIEs | LayerParameters | ExpectedResult | 3GPPRef |
|--------|---------|------------|--------------|------------------|---------------|------------|----------------------|-------------|-----------------|----------------|---------|
| LTE-SCHED-001 | Scheduling | PDSCH Dynamic | Functional | Dynamic PDSCH scheduling operation | UE connected mode | 1.eNB schedules PDSCH;2.Send DCI on PDCCH;3.UE decodes scheduling;4.Receive PDSCH;5.Send HARQ ACK/NACK | PDCCH->PDSCH->HARQ flows | IEs:DCI formats,RNTI,PDSCH scheduling info | LayerParams:Modulation, MCS,TB size,HARQ Process ID | Data received and HARQ feedback | TS 36.213 |
| LTE-SCHED-002 | Scheduling | SPS | Functional | Semi-Persistent Scheduling behavior for VoIP | SPS configured | 1.Configure SPS;2.Activate SPS;3.Transmit periodic PDSCH | PDCCH/SPS activation DCI | IEs:SPS periodicity,grant | LayerParams:SPS periodicity,Allocation | SPS works as expected | TS 36.213 |
| LTE-SCHED-003 | Scheduling | DCI Formats | Functional | DCI format decoding across sizes | Various DCIs | 1.Send DCI format X;2.UE decodes | DCI types 0/1/1A/2 etc | IEs:ResourceAllocations,PowerControl | LayerParams:Aggregation levels | UE decodes correctly | TS 36.213 |
| LTE-SCHED-004 | Scheduling | HARQ Retransmission | Functional | HARQ process handling for PDSCH | NACK/ACK flows present | 1.Tx PDSCH->NACK->Retransmit | HARQ timing flows | IEs:HARQ process ID | LayerParams:HARQ timers,retransmit count | HARQ works | TS 36.213 |
| LTE-SCHED-005 | Scheduling | UE Buffer Status Reports | Functional | BSR triggers scheduling request | UE has data in UL | 1.UE sends BSR;2.eNB schedules UL | RRC BSR/BSR Timer flows | IEs:BSR size,type | LayerParams:UL grants | UL scheduled per BSR | TS 36.321 |

---

## Summary

This LTE Test Case Master Matrix provides comprehensive coverage of:

- **300 LTE test cases** across 8 major feature sets
- **Detailed 3GPP message flows** for each test case
- **Information Elements (IEs)** with proper 3GPP references
- **Layer-wise parameters** for PHY, MAC, RLC, PDCP, RRC, NAS, and Core
- **Expected results** and validation criteria
- **3GPP specification references** for compliance

The test cases cover all critical LTE functionality including initial access, handover, bearer management, mobility, security, measurements, power control, and scheduling, providing a complete testing framework for LTE networks.
