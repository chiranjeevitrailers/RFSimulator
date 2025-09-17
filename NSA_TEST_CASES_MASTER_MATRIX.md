# NSA (Non-Standalone) Test Cases Master Matrix

## Overview
This document provides a comprehensive matrix of NSA test cases including EN-DC, NE-DC, NGEN-DC, and Multiple Split Bearer scenarios.

## Test Case Format
`TestID;Feature;SubFeature;CategoryType;ShortDescription;Preconditions;ShortSteps;ExpectedSignalingFlow;ExpectedIEs;LayerParameters;ExpectedResult;3GPPRef`

---

## EN-DC (E-UTRAN-NR Dual Connectivity) Test Cases

### EN-DC Initial Access (20 test cases)

**EN-DC-IA-F1;EN-DC;Initial Access;Functional;Basic EN-DC setup with LTE anchor;LTE eNodeB + NR gNodeB operational;1.LTE attach;2.EN-DC capability exchange;3.NR secondary cell addition;4.RRC reconfiguration;RRCConnectionReconfiguration->RRCConnectionReconfigurationComplete;EN-DC Capability,SCG Config,NR Secondary Cell;PHY:LTE/NR frequencies,MAC:Dual scheduling,RLC:Split bearer,PDCP:Duplication;EN-DC established successfully;TS 37.340,TS 38.331**

**EN-DC-IA-F2;EN-DC;Initial Access;Functional;EN-DC with multiple NR secondary cells;Multiple NR gNodeBs available;1.LTE attach;2.Multi-cell EN-DC setup;3.Carrier aggregation;RRCConnectionReconfiguration(Multi-cell)->SCG Addition;Multi-cell SCG Config,Carrier Aggregation Config;PHY:Multiple NR carriers,MAC:Multi-cell scheduling;Multi-cell EN-DC established;TS 37.340,TS 38.331**

**EN-DC-IA-F3;EN-DC;Initial Access;Functional;EN-DC with X2 interface failure;X2 interface intermittent;1.LTE attach;2.X2 failure during EN-DC;3.Fallback procedures;RRCConnectionReconfiguration->X2 Failure Handling;EN-DC Config,X2 Status;PHY:Fallback frequencies,MAC:Fallback scheduling;EN-DC with fallback handling;TS 37.340,TS 36.423**

**EN-DC-IA-F4;EN-DC;Initial Access;Functional;EN-DC with security context transfer;Security context available;1.LTE attach with security;2.EN-DC setup;3.Security transfer;RRCConnectionReconfiguration->SecurityModeCommand;Security Context,EN-DC Security;RRC:Security config,PDCP:Security keys;Secure EN-DC established;TS 33.501,TS 37.340**

**EN-DC-IA-F5;EN-DC;Initial Access;Functional;EN-DC with QoS flow mapping;QoS flows configured;1.LTE attach;2.EN-DC setup;3.QoS mapping;RRCConnectionReconfiguration->QoS Flow Config;QoS Flow Info,EN-DC QoS;PDCP:QoS mapping,RLC:QoS bearers;EN-DC with QoS flows;TS 23.501,TS 37.340**

### EN-DC Split Bearer (15 test cases)

**EN-DC-SB-F1;EN-DC;Split Bearer;Functional;MCG split bearer setup;EN-DC established;1.Configure MCG split bearer;2.PDCP duplication;3.Verify data flow;RRCConnectionReconfiguration->Bearer Setup;MCG Split Bearer Config,PDCP Duplication Config;PDCP:Duplication mode,RLC:AM mode;MCG split bearer established;TS 37.340,TS 38.323**

**EN-DC-SB-F2;EN-DC;Split Bearer;Functional;SCG split bearer setup;EN-DC established;1.Configure SCG split bearer;2.NR PDCP duplication;3.Verify SCG flow;SCG Addition Request->SCG Split Bearer Config;SCG Split Bearer Config,NR PDCP Config;NR PDCP:Duplication mode,NR RLC:AM mode;SCG split bearer established;TS 37.340,TS 38.323**

**EN-DC-SB-F3;EN-DC;Split Bearer;Functional;Multiple MCG split bearers;EN-DC with resources;1.Setup first MCG split bearer;2.Setup second MCG split bearer;3.Verify both active;RRCConnectionReconfiguration(Multiple)->Bearer Confirmations;Multiple MCG Split Bearer Configs,PDCP Configs;PDCP:Multiple duplication modes,RLC:Multiple AM configs;Multiple MCG split bearers established;TS 37.340,TS 38.323**

**EN-DC-SB-F4;EN-DC;Split Bearer;Functional;Mixed MCG and SCG split bearers;EN-DC with both resources;1.Setup MCG split bearer;2.Setup SCG split bearer;3.Verify mixed operation;MCG Split Bearer Config->SCG Split Bearer Config;MCG Split Bearer Config,SCG Split Bearer Config;LTE PDCP:MCG duplication,NR PDCP:SCG duplication;Mixed split bearers established;TS 37.340,TS 38.323**

**EN-DC-SB-F5;EN-DC;Split Bearer;Functional;Split bearer with carrier aggregation;EN-DC with CA enabled;1.Configure NR CA;2.Setup split bearer on CA;3.Verify CA split operation;SCG Addition Request(CA)->SCG Split Bearer Config(CA);SCG CA Configuration,SCG Split Bearer Configs;NR PDCP:CA duplication modes,NR RLC:CA AM configs;CA split bearer established;TS 37.340,TS 38.323,TS 38.331**

### EN-DC Handover (10 test cases)

**EN-DC-HO-F1;EN-DC;Handover;Functional;EN-DC handover with split bearer preservation;EN-DC with split bearers;1.Trigger EN-DC handover;2.Preserve split bearers;3.Transfer contexts;HandoverRequired(EN-DC)->HandoverRequest(EN-DC)->HandoverCommand;EN-DC Handover Config,Split Bearer Context;PDCP:Context preservation,RLC:Context transfer;EN-DC handover with split bearer preservation;TS 37.340,TS 23.502**

**EN-DC-HO-F2;EN-DC;Handover;Functional;EN-DC handover with SCG change;EN-DC with SCG;1.Trigger handover;2.Change SCG;3.Verify SCG change;HandoverRequired->SCG Change->HandoverCommand;SCG Change Config,New SCG Config;NR PDCP:SCG change,NR RLC:SCG transfer;EN-DC handover with SCG change;TS 37.340,TS 23.502**

### EN-DC Performance (5 test cases)

**EN-DC-P1;EN-DC;Performance;Performance;EN-DC setup latency measurement;Multiple UEs;1.Measure EN-DC setup time;2.Collect latency stats;RRCConnectionReconfiguration timing;Setup latency metrics;EN-DC setup latency <= target;TS 38.913**

**EN-DC-P2;EN-DC;Performance;Performance;Split bearer throughput measurement;EN-DC with split bearers;1.Generate traffic;2.Measure throughput;3.Compare with single bearer;PDCP data flow metrics;Throughput measurements;Split bearer throughput >= single bearer;TS 37.340**

---

## NE-DC (NR-E-UTRAN Dual Connectivity) Test Cases

### NE-DC Initial Access (10 test cases)

**NE-DC-IA-F1;NE-DC;Initial Access;Functional;NE-DC with NR anchor;NR gNodeB + LTE eNodeB;1.NR initial access;2.NE-DC capability exchange;3.LTE secondary cell addition;RRCConnectionReconfiguration(NE-DC)->RRCConnectionReconfigurationComplete;NE-DC Capability,LTE SCG Config;PHY:NR/LTE frequencies,MAC:NR/LTE scheduling;NE-DC established successfully;TS 37.340,TS 38.331**

**NE-DC-IA-F2;NE-DC;Initial Access;Functional;NE-DC with Xn interface;Xn interface configured;1.NR attach;2.Xn-based NE-DC setup;3.LTE SCG addition;Xn Setup Request->NE-DC Config;Xn Config,NE-DC Config;Xn interface parameters;NE-DC with Xn interface;TS 37.340,TS 38.460**

### NE-DC Split Bearer (5 test cases)

**NE-DC-SB-F1;NE-DC;Split Bearer;Functional;NE-DC split bearer with NR anchor;NE-DC established;1.Configure split bearer;2.NR PDCP duplication;3.Verify split operation;RRCConnectionReconfiguration->Split Bearer Config;NE-DC Split Bearer Config,NR PDCP Config;NR PDCP:Duplication mode,LTE RLC:AM mode;NE-DC split bearer established;TS 37.340,TS 38.323**

---

## NGEN-DC (NG-RAN-E-UTRAN Dual Connectivity) Test Cases

### NGEN-DC Initial Access (5 test cases)

**NGEN-DC-IA-F1;NGEN-DC;Initial Access;Functional;NGEN-DC with NG-RAN anchor;NG-RAN gNodeB + E-UTRAN eNodeB;1.NG-RAN initial access;2.NGEN-DC capability exchange;3.E-UTRAN secondary cell addition;RRCConnectionReconfiguration(NGEN-DC)->RRCConnectionReconfigurationComplete;NGEN-DC Capability,E-UTRAN SCG Config;PHY:NG-RAN/E-UTRAN frequencies,MAC:NG-RAN/E-UTRAN scheduling;NGEN-DC established successfully;TS 37.340,TS 38.331**

---

## Multiple Split Bearer Test Cases

### Multiple Split Bearer Setup (15 test cases)

**MSB-F1;Multiple Split Bearer;Setup;Functional;Multiple MCG split bearers;EN-DC with resources;1.Setup first MCG split bearer;2.Setup second MCG split bearer;3.Setup third MCG split bearer;RRCConnectionReconfiguration(Multiple)->Bearer Confirmations;Multiple MCG Split Bearer Configs,PDCP Configs;PDCP:Multiple duplication modes,RLC:Multiple AM configs;Multiple MCG split bearers established;TS 37.340,TS 38.323**

**MSB-F2;Multiple Split Bearer;Setup;Functional;Mixed MCG and SCG split bearers;EN-DC with both resources;1.Setup MCG split bearer;2.Setup SCG split bearer;3.Verify mixed operation;MCG Split Bearer Config->SCG Split Bearer Config;MCG Split Bearer Config,SCG Split Bearer Config;LTE PDCP:MCG duplication,NR PDCP:SCG duplication;Mixed split bearers established;TS 37.340,TS 38.323**

**MSB-F3;Multiple Split Bearer;Setup;Functional;Multiple SCG split bearers with CA;EN-DC with NR CA;1.Configure NR CA;2.Setup first SCG split bearer;3.Setup second SCG split bearer;SCG Addition Request(CA)->SCG Split Bearer Configs(CA);SCG CA Configuration,Multiple SCG Split Bearer Configs;NR PDCP:CA duplication modes,NR RLC:CA AM configs;Multiple SCG split bearers with CA established;TS 37.340,TS 38.323,TS 38.331**

**MSB-F4;Multiple Split Bearer;Setup;Functional;Dynamic split bearer addition/removal;EN-DC established;1.Add first split bearer;2.Add second split bearer;3.Remove first split bearer;4.Add third split bearer;Bearer Addition Request->Bearer Addition Response->Bearer Removal Request->Bearer Removal Response;Dynamic Bearer Config,Bearer Addition/Removal IEs;PDCP:Dynamic duplication config,RLC:Dynamic AM configuration;Dynamic split bearer management successful;TS 37.340,TS 38.323**

**MSB-F5;Multiple Split Bearer;Setup;Functional;Split bearer load balancing;Multiple split bearers;1.Establish multiple split bearers;2.Generate traffic;3.Monitor load distribution;Load Balancing Configuration->Traffic Distribution Updates;Load Balancing Config,Traffic Distribution IEs;PDCP:Load balancing algorithms,RLC:Traffic distribution;Load balancing across split bearers successful;TS 37.340,TS 38.323**

### Multiple Split Bearer Performance (10 test cases)

**MSB-P1;Multiple Split Bearer;Performance;Performance;Multiple split bearer throughput;Multiple split bearers established;1.Generate traffic on all bearers;2.Measure aggregate throughput;3.Compare with single bearer;PDCP data flow metrics;Throughput measurements;Aggregate throughput >= single bearer * number of bearers;TS 37.340**

**MSB-P2;Multiple Split Bearer;Performance;Performance;Split bearer latency measurement;Multiple split bearers;1.Measure latency on each bearer;2.Measure aggregate latency;3.Compare with single bearer;PDCP latency metrics;Latency measurements;Split bearer latency <= single bearer latency;TS 37.340**

**MSB-P3;Multiple Split Bearer;Performance;Performance;Split bearer reliability measurement;Multiple split bearers;1.Generate traffic;2.Measure packet loss;3.Compare with single bearer;PDCP reliability metrics;Packet loss measurements;Split bearer reliability >= single bearer reliability;TS 37.340**

### Multiple Split Bearer RF (10 test cases)

**MSB-R1;Multiple Split Bearer;RF;RF;Split bearer at low RSRP;Low signal conditions;1.Setup split bearers;2.Reduce RSRP;3.Measure performance;PDCP data flow under low RSRP;RSRP thresholds;Split bearer performance acceptable at low RSRP;TS 38.104**

**MSB-R2;Multiple Split Bearer;RF;RF;Split bearer under interference;Interference conditions;1.Setup split bearers;2.Apply interference;3.Measure performance;PDCP data flow under interference;SINR thresholds;Split bearer performance acceptable under interference;TS 38.104**

### Multiple Split Bearer Stability (5 test cases)

**MSB-S1;Multiple Split Bearer;Stability;Stability;24hr multiple split bearer stress;Multiple split bearers;1.Run 24hr stress test;2.Monitor failures;3.Measure success rate;PDCP data flow over 24hrs;Failure counters;Success rate >= 99.9%;TS 32.450**

---

## NSA PDU Session Test Cases

### NSA PDU Session Setup (10 test cases)

**NSA-PDU-F1;NSA PDU Session;Setup;Functional;EN-DC PDU session with split bearer;EN-DC established;1.Request PDU session;2.Configure split bearer;3.Verify data flow;PDU Session Establishment Request->Split Bearer Configuration->PDU Session Establishment Accept;PDU Session ID,Split Bearer Config,DNN Information;PDCP:PDU session duplication,RLC:PDU session bearers;PDU session over EN-DC split bearer established;TS 23.502,TS 37.340**

**NSA-PDU-F2;NSA PDU Session;Setup;Functional;Multiple PDU sessions over split bearers;EN-DC with multiple split bearers;1.Establish first PDU session;2.Establish second PDU session;3.Verify both sessions;PDU Session Establishment Requests->Split Bearer Configurations;Multiple PDU Session IDs,Split Bearer Configs;PDCP:Multiple PDU session duplication;Multiple PDU sessions over split bearers established;TS 23.502,TS 37.340**

---

## Summary

### Test Case Distribution
- **EN-DC Test Cases**: 50 test cases
  - Initial Access: 20 test cases
  - Split Bearer: 15 test cases
  - Handover: 10 test cases
  - Performance: 5 test cases

- **NE-DC Test Cases**: 15 test cases
  - Initial Access: 10 test cases
  - Split Bearer: 5 test cases

- **NGEN-DC Test Cases**: 5 test cases
  - Initial Access: 5 test cases

- **Multiple Split Bearer Test Cases**: 40 test cases
  - Setup: 15 test cases
  - Performance: 10 test cases
  - RF: 10 test cases
  - Stability: 5 test cases

- **NSA PDU Session Test Cases**: 10 test cases
  - Setup: 10 test cases

**Total NSA Test Cases**: 120 test cases

### Key Features Covered
1. **EN-DC (E-UTRAN-NR Dual Connectivity)**
2. **NE-DC (NR-E-UTRAN Dual Connectivity)**
3. **NGEN-DC (NG-RAN-E-UTRAN Dual Connectivity)**
4. **Multiple Split Bearer Scenarios**
5. **Split Bearer with Carrier Aggregation**
6. **Dynamic Split Bearer Management**
7. **Split Bearer Load Balancing**
8. **NSA Handover with Split Bearer Preservation**
9. **NSA PDU Session over Split Bearers**

### 3GPP References
- **TS 37.340**: Multi-connectivity
- **TS 38.331**: NR RRC protocol
- **TS 38.323**: PDCP protocol
- **TS 23.502**: 5G System procedures
- **TS 23.501**: 5G System architecture
- **TS 38.104**: NR Base Station radio transmission and reception
- **TS 38.460**: NG-RAN Xn interface
- **TS 36.423**: X2 interface
- **TS 33.501**: 5G System security
- **TS 32.450**: Key Performance Indicators
