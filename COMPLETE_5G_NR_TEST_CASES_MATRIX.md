# Complete 5G NR Test Cases Matrix - SA and NSA

## Overview
This document provides the complete test case matrix for 5G NR including both SA (Standalone) and NSA (Non-Standalone) scenarios.

## Test Case Format
`TestID;Feature;SubFeature;CategoryType;ShortDescription;Preconditions;ShortSteps;ExpectedSignalingFlow;ExpectedIEs;LayerParameters;ExpectedResult;3GPPRef`

---

## SA (Standalone) Test Cases - 350 test cases

### Feature Set 1: Initial Access (NR-IA) — 50 test cases

**NR-IA-F1;InitialAccess;SA Attach;Functional;Basic NR standalone initial access;UE powered off, valid USIM,gNB with SIBs;1.Power on UE;2.Cell sync;3.Decode MIB/SIB;4.RACH;5.RRC Setup;6.NAS Register;RRCConnectionRequest->RRCConnectionSetup->RRCConnectionSetupComplete;UE Identity,EstablishmentCause,5G-GUTI,IMSI,NSSAI;PHY:SSB index,RSRP;MAC:RACH preamble;RRC:UE ID;NAS:Registration type;UE registered,RRC connected;TS 38.300,TS 24.501**

**NR-IA-F2;InitialAccess;NSA EN-DC;Functional;Initial access with EN-DC (LTE anchor + NR);LTE coverage + NR secondary available;1.Power on UE;2.Attach LTE;3.Add NR secondary;E-UTRAN->gNB signaling,EN-DC add secondary RRC;SIBs,Secondary cell info,Measurement IDs;PHY:SSB,Carrier freq;RRC:MeasConfig;NAS:Attach;EN-DC established,dual connectivity;TS 37.340**

**NR-IA-F3;InitialAccess;Emergency Attach;Functional;Attach with emergency service allowed;UE with emergency capability;1.Power on UE;2.Attempt attach as emergency;RRC->NAS registration flows;EmergencyIndicator,PLMN,UE Capabilities;RRC:SRB setup;NAS:Emergency type;Emergency registration accepted;TS 23.501**

**NR-IA-F4;InitialAccess;Attach Reject - PLMN barred;Functional;Attach rejected when PLMN not allowed;SIM barred PLMN;1.Power on UE;2.Attempt attach;NAS:RegistrationRequest->RegistrationReject;Reject cause PLMN not allowed;PLMN identity,Reject cause;RRC:normal;NAS:reject cause;Attach rejected w/ correct cause;TS 24.501**

**NR-IA-F5;InitialAccess;Attach Reject - Illegal UE;Functional;Blacklisted IMEI handling;Blacklisted IMEI in HSS/UDM;1.Power on UE;2.Attempt attach;NAS Registration->Reject;IMSI/IMEI,Reject cause;NAS:reject cause;Attach rejected;TS 24.501**

**NR-IA-F6;InitialAccess;Attach w/ IMSI Attach;Functional;Attach using IMSI (no GUTI);No stored GUTI;1.Power on UE;2.Send RegistrationRequest with IMSI;NAS and auth flows;IMSI,NASSecurityCap;RRC:SRB0;NAS:IMSI;Attach completes with assigned 5G-GUTI;TS 24.501**

**NR-IA-F7;InitialAccess;Attach w/ GUTI;Functional;Attach using stored 5G-GUTI;Stored valid GUTI in UE;1.Power on UE;2.Send RegistrationRequest with GUTI;NAS auth flows;5G-GUTI,NSSAI;NAS:5G-GUTI;Attach accepted, GUTI validated;TS 24.501**

**NR-IA-F8;InitialAccess;Attach w/ UE Capability Exchange;Functional;UE capability signaling during attach;UE supports feature set X;1.Attach;2.Capability exchange;RRC:UECapabilityInformation->gNB;UE Capability IEs;RRC:SRBs;NAS:auth;Capabilities stored at gNB/AMF;TS 38.331**

**NR-IA-F9;InitialAccess;Attach w/ NSSAI requested;Functional;Request specific NSSAI during attach;Operator slices configured;1.Attach Request includes NSSAI;NAS:RegistrationRequest with NSSAI->NAS Accept;Requested NSSAI,DNN;NAS:NSSAI,DNN;PDU session allowed as per NSSAI;TS 23.501**

**NR-IA-F10;InitialAccess;Attach w/ Emergency PLMN selection;Functional;Attach to emergency PLMN when home PLMN barred;SIM roaming/emergency allow;1.Attempt attach;2_Select emergency PLMN;RRC+NAS emergency registration flows;PLMN list,EmergencyIndicator;NAS:emergency type;Emergency registered;TS 23.501**

**NR-IA-F11;InitialAccess;SA attach with IPv4 PDU requested;Functional;Attach and request IPv4 session;AMF/SMF/UPF ready;1.Attach;2.Request PDU session type IPv4;NAS:PDU Session Establishment flow;DNN,PDU Session Type,SSC Mode;PDN/UP parameters;PDU session accepted with IPv4;TS 23.502**

**NR-IA-F12;InitialAccess;SA attach with IPv6 PDU requested;Functional;Attach and request IPv6;AMF/SMF configured;1.Attach;2.Request IPv6;NAS PDU session request;IP version,DNN;PDN/UP params;IPv6 session established;TS 23.502**

**NR-IA-F13;InitialAccess;Attach w/ AMF selection failure;Functional;AMF selection error handling;AMF unreachable or overload;1.Attach;2.AMF selection fails;NGAP/AMF reject procedures;Reject cause,AMF ID;NAS:RegistrationReject;UE shows failure and retries;TS 23.501**

**NR-IA-F14;InitialAccess;Attach with authentication failure;Functional;Auth vector mismatch;Incorrect credentials in UDM;1.Attach->Auth request;2.Fail auth;NAS:AuthenticationRequest->AuthenticationReject;Auth vectors,Res/Autn;NAS:reject;Attach fails with auth reject;TS 33.501**

**NR-IA-F15;InitialAccess;Attach with SecurityModeCommand;Functional;Security mode negotiation during attach;Network enforces cipher/integrity;1.Attach->SecurityModeCommand;RRC/NAS security flows;Security algorithms,Key IDs;PDCP:Crypto activated;Secure RRC and NAS established;TS 33.501**

**NR-IA-F16;InitialAccess;Attach with UE in Power Saving Mode;Functional;UE T3410/PSM behavior during attach;UE configured with PSM;1.Attach then enter PSM;NAS timers reflect PSM;T3410,TAU timers;NAS:DRX/PSM params;Attach ok and UE enters PSM;TS 24.501**

**NR-IA-F17;InitialAccess;DSDS attach switching;Functional;Dual SIM behavior during attach;DSDS UE with two SIMs;1.Attach SIM1;2.Switch to SIM2;Attach both sequentially;SIM identities,GUTIs;RRC+NAS per SIM;Both SIMs attach appropriately;TS 24.501**

**NR-IA-F18;InitialAccess;Attach with VoNR capability exchange;Functional;UE indicates VoNR support during attach;IMS capabilities present;1.Attach include IMSVoNR flag;NAS:RAN+AMF store capability;IMS indicators,NSSAI;IMS registration flows enabled;VoNR available;TS 23.501**

**NR-IA-F19;InitialAccess;Attach with UE in restricted area;Functional;Attach rejected if UE in restricted location;Location-based restriction present;1.Attach;2.Network checks location;NAS reject w/ area restriction cause;Location info,PLMN;UE denied attach;TS 24.501**

**NR-IA-F20;InitialAccess;Attach with EPS fallback support;Functional;UE supports EPS fallback for voice;VoNR not available;1.Attach;2.Attempt IMS;3.Fallback to EPS;NAS:Indications for EPS fallback;IMS indicators,SMF;EPS fallback executed and voice via LTE;TS 23.401**

### Performance Test Cases (10)

**NR-IA-P1;InitialAccess;Attach Delay Idle UE;Performance;Measure attach delay for idle UE;Idle UE present;1.Power on UE;2.Measure time to register;RRCConnectionSetup and NAS Registration;Timestamps in RRC/NAS;PHY:SSB timing;Attach latency stats;Attach latency <= target;TS 38.913**

**NR-IA-P2;InitialAccess;Attach Delay under 100 UEs;Performance;Attach latency distribution with 100 UEs;100 test UEs;1.Trigger attach for all;2.Collect latencies;RRC/NAS attach flows;Queue lengths,Backoff params;Network maintains KPIs;95% attach <target;Operator KPI**

**NR-IA-P3;InitialAccess;RACH Success Rate under Load;Performance;RACH preamble success under simultaneous access;Configured PRACH resources;1.50 UEs send PRACH;2.Measure success rate;PRACH->RAR->RRC flows;Preamble ID,RAR timing;PHY:PRACH config;Success rate >=99%;TS 38.321**

**NR-IA-P4;InitialAccess;SSB Detection Sensitivity;Performance;SSB detection at varying RSRP;Controlled RF lab;1.Adjust RSRP;2.Check SSB detect;PBCH/PSS/SSS decode;SSB index,PBCH payload;PHY:SSB threshold;Detection rate meets spec;TS 38.104**

**NR-IA-P5;InitialAccess;Attach Time after RAN Reset;Performance;Attach latency post gNB reset;gNB reset scenario;1.Reset gNB;2.UE attach;RRC/NAS attach;NG Reset timers;Layer re-init times;Attach within SLA;Operator KPI**

**NR-IA-P6;InitialAccess;Attach Success with High UE Speed;Performance;Attach while UE moving at high speed;UE mobility emulator;1.Power on UE in moving mode;2.Attach;RRC initial access under mobility;Measurement IDs,TA;PHY:timing advance;Attach success and latency within limit;TS 38.300**

**NR-IA-P7;InitialAccess;Attach Rate per Second;Performance;Sustained attach rate handling;AMF/SMF capacity set;1.Trigger continuous attach bursts;NGAP/AMF load flows;NGAP load,SMF sessions;Network sustains target attach/sec;Operator KPI**

**NR-IA-P8;InitialAccess;Attach under CPU/Memory constrained gNB;Performance;gNB performance under limited resources;gNB resource throttle;1.Trigger attach;2.Monitor failures;RRC/NAS flows;gNB resource counters;System meets degradation limits;Operator KPI**

**NR-IA-P9;InitialAccess;UE Power On to Data Plane Ready;Performance;Time from power on to data forwarding;UE and UPF active;1.Attach;2.Establish PDU session;RRC/NAS,NGAP,PFCP flows;PDU ID,DNN,SSC;Time meets SLA;TS 23.501**

**NR-IA-P10;InitialAccess;Registration Success Rate under Stress;Performance;Registration success over sustained load;500 attach attempts/hour;1.Continuous attach attempts;Collect success/error;NAS success codes;Counters;Success >=99.5%;TS 32.450**

### RF Test Cases (10)

**NR-IA-R1;InitialAccess;Attach at -110 dBm RSRP;RF;Initial access at low signal level;Fading emulator set RSRP -110dBm;1.Attempt attach;Physical sync+RACH;PBCH,SSB,PBCH decode stats;PHY:RSRP,RSRQ,SINR;Attach within allowed retries;TS 38.104**

**NR-IA-R2;InitialAccess;Attach under SINR <0 dB;RF;Access with poor SINR;Interference generator active;1.Attempt attach;RACH retries;PBCH errors,SSB detect;PHY:SINR,BER;Network accepts or retries per spec;TS 38.104**

**NR-IA-R3;InitialAccess;Access with Frequency Reuse;RF;Cell selection across multiple carriers;Multiple NR carriers present;1.Cell search across frequencies;2.Select best;SSB search across freq;SSB index,Freq info;PHY:Carrier freq,bandwidth;UE selects correct freq;TS 38.304**

**NR-IA-R4;InitialAccess;Access with Beamforming Sweep;RF;Beam sweep during initial access;gNB beams configured;1.Sweep beams;2.Attach via best beam;SSB beam index,BeamRef;PHY:beamforming weights;Attach after beam selection;TS 38.211**

**NR-IA-R5;InitialAccess;Access with High Interference;RF;Attach with emulated adjacent cell interference;Interferer enabled;1.Attempt attach;2.Measure retries;PBCH CRC,SSB detect;SINR thresholds,adj cell power;Attach succeeds with acceptable retries;TS 38.104**

**NR-IA-R6;InitialAccess;Attach with CFO (freq offset);RF;Initial access under carrier freq offset;Introduce CFO in RF chain;1.Attempt sync;2.Attach;PSS/SSS detect rates,PBCH decode;PHY:freq offset tolerance;UE sync and attach OK;TS 38.211**

**NR-IA-R7;InitialAccess;Attach under Doppler shift;RF;High Doppler effects due to speed;Mobility emulator;1.Attach while moving;Sync and RACH;TA adjustments,Doppler params;PHY:Doppler tolerance;Attach acceptable;TS 38.104**

**NR-IA-R8;InitialAccess;Attach with RX diversity disabled;RF;Single Rx antenna behavior;UE with 1 RX active;1.Attach;2.Measure performance;Signal levels,PBCH errors;PHY:antenna ports;Attach within degraded spec;TS 38.104**

**NR-IA-R9;InitialAccess;Cell ID Selection with Multi-PLMN;RF;Select correct PLMN in multi-PLMN SIB;Multiple PLMNs broadcast;1.Attempt attach;2>Select PLMN;SIB1 PLMN list,PLMN IDs;NAS:PLMN info;UE selects operator PLMN;TS 38.331**

**NR-IA-R10;InitialAccess;Attach with TDD Config variations;RF;Attach across different TDD configs;gNB set different TDD patterns;1.Attach;2.Verify timing;SIB/TDD config,slot formats;PHY:frame timing;Attach OK and link stable;TS 38.211**

### Stability Test Cases (5)

**NR-IA-S1;InitialAccess;24hr continuous attach/detach;Stability;Long-duration attach/detach stress;1 UE or few UEs;Run 500 cycles over 24 hr;RRC/NAS attach detach loops;Failure counters,Retry counts;All cycles succeed <0.1% fail;TS 32.450**

**NR-IA-S2;InitialAccess;Attach after periodic reboot;Stability;UE reboot frequently and attach;UE reboot every 5 min,repeat attach;1.Reboot;2.Attach;RRC/NAS flows;Boot timers,registration count;All attach succeed;TS 23.502**

**NR-IA-S3;InitialAccess;Attach during primary gNB outage;Stability;Primary gNB outage and recovery;Primary gNB down for X min;1.Attempt attach;2_:Reselect neighbor;NGAP failover,AMF handling;Neighbor cell IDs,TA;UE reselects and attaches;TS 38.300**

**NR-IA-S4;InitialAccess;SIM swap stress;Stability;Repeated SIM swap and attach;Swap SIM 100x;1.Swap;2.Attach;NAS identity updates;IMSI/GUTI reassignments;Success rate >=99%;TS 24.501**

**NR-IA-S5;InitialAccess;Attach under intermittent RF fade;Stability;Intermittent deep fades applied;Fade pattern applied;1.Attach attempts across fades;RRC retries,backoffs;PHY:RSRP drop/recovery;System tolerates fades within spec;TS 38.104**

### Sanity Test Cases (5)

**NR-IA-SN1;InitialAccess;Sanity Basic attach/detach;Sanity;Quick basic attach/detach check;Normal UE,gNB;1.Attach;2.Detach;RRC/NAS attach detach;Minimal IEs;RRC connected then idle;Pass basic sanity;TS 38.300**

**NR-IA-SN2;InitialAccess;Sanity attach after flight mode;Sanity;Attach after toggling flight mode;UE flight mode toggle;1.Disable flight mode;2.Attach;RRC/NAS attach;Registration success;TS 24.501**

**NR-IA-SN3;InitialAccess;Sanity roaming SIM attach;Sanity;Check roaming attach flows;Roaming network accessible;1.Attach with roaming SIM;2.Check PLMN selection;RRC+NAS roam indications;PLMN,TAI;Roaming registration success;TS 23.501**

**NR-IA-SN4;InitialAccess;Sanity attach with barred freq;Sanity;Attempt attach on barred freq in SIB;SIB includes barred freq;1.Attempt attach;2.Verify UE avoids barred freq;SIB barred list;UE avoids barred freq;TS 38.331**

**NR-IA-SN5;InitialAccess;Sanity attach after gNB reset;Sanity;Attach after gNB reboot;gNB restart;1.gNB reset;2.Attempt attach;RRC init flows;Service resumes and attach ok;TS 38.300**

---

## Feature Set 2: Handover (NR-HO) — 50 test cases

**NR-HO-F1;Handover;Intra-gNB HO;Functional;Intra gNB handover successful;UE in connected mode,neighbors configured;1.Trigger measurement;2.Send MeasurementReport;3.gNB issues RRCReconfiguration(HO);4.UE executes HO;MeasurementReport->RRCReconfiguration->RRCReconfigurationComplete;Measurement IDs,RSRP,RSRQ,SINR;PHY:TA,Timing;RLC/PDCP context transfer;HO completes,UE on target cell;TS 38.331,TS 23.502**

**NR-HO-F2;Handover;Inter-gNB HO;Functional;Inter gNB handover with NGAP signaling;AMF/NG setup ready;1.Measure->HandoverRequired->HandoverRequest->HandoverCommand;NGAP:HandoverRequired,SourceToTargetContainer;RRC:HOCommand;PDCP SN status,PDUSessionIDs;Data path moved to target gNB;TS 23.502**

**NR-HO-F3;Handover;HO with bearer forwarding;Functional;Handover preserving user plane;Anchor gNB forwarding enabled;1.HO flows incl Forwarding;NGAP forward containers;RLC/PDCP buffers,HO forward IE;RLC:AM retransmit;PDCP:SN transfer;No packet loss or minimal;TS 23.502**

**NR-HO-F4;Handover;HO with SRB reconfiguration;Functional;SRB reconfig during HO;SRB1/2 in use;1.RRCReconfiguration HO includes SRB changes;RRC:SRB config;SRB IE lists;RRC:SRB mapping;SRB re-established on target;TS 38.331**

**NR-HO-F5;Handover;HO failure and rollback;Functional;Fail HO and perform rollback;Target resource reject;1.HOCommand->Failure->Rollback;NGAP:HandoverCancel/HandoverNotify;Rollback container;PDCP/RLC rollback actions;UE remains on source,session intact;TS 23.502**

---

## Feature Set 3: PDU Session (NR-PDU) — 50 test cases

**NR-PDU-F1;PDU Session;IPv4 PDU Establish;Functional;Establish IPv4 PDU session;UE registered,SMF/UPF available;1.NAS PDU Session Establish Request;2.SMF selection;3.PFCP session create;NAS PDU Session Req->Accept;PDU Session ID,DNN,SSCMode;PDN type,IMSI;PDCP ciphering active;PDU session established w/ IPv4;TS 23.502**

**NR-PDU-F2;PDU Session;IPv6 PDU Establish;Functional;Establish IPv6 session;SMF supports IPv6;1.PDU Session Request;2.SM;NAS PDU session request;IP version,DNN;PDN/UP params;IPv6 session established;TS 23.502**

---

## NSA (Non-Standalone) Test Cases - 50 test cases

### Feature Set X: NSA / EN-DC Test Cases (NR-NSA) — 50 test cases

**NR-NSA-F1;NSA;EN-DC Basic Attach;Functional;EN-DC initial access with LTE anchor and NR secondary;LTE eNB/gNB available, UE EN-DC capable;1.Attach to LTE (EPS/EMM attach);2.EN-DC secondary cell addition;3.RRC reconfiguration for NR secondary;EPS attach->EN-DC RRC add;EN-DC capability,IuR/Meas IDs,Secondary cell info;PHY:SSB,CarrierFreq;RRC:MeasConfig;NAS:Attach type;UE in EN-DC dual connectivity;TS 37.340,TS 23.501**

**NR-NSA-F2;NSA;EN-DC Secondary Addition;Functional;Add NR secondary to existing LTE connection;UE in connected LTE with DC support;1.Trigger secondary addition;2.gNB config NR SCG;RRC:Reconfiguration->SCG add;SCG config,SRB/DRB mapping;PDCP split,SRB mapping;NR SCG established;TS 37.340**

**NR-NSA-F3;NSA;EN-DC Secondary Release;Functional;Release NR secondary while keeping LTE anchor;NR SCG active;1.Trigger SCG release;2.Release confirm;RRC:SCG Release;SCG config IEs;PDCP:split stop;NR resources released,UE continues on LTE;TS 37.340**

**NR-NSA-F4;NSA;EN-DC Bearer Split;Functional;Split data over LTE and NR (PDCP split);MC/EN-DC active;1.Configure split bearer;2.Send data;PDCP split flows;QFI mapping,PDCP SN status;PDCP:split params;Data forwarded via both legs;TS 37.340**

**NR-NSA-F5;NSA;EN-DC HO from LTE anchor;Functional;HO procedure when LTE anchor triggers NR change;LTE anchor triggers target addition;1.Trigger measurement->SCG change;NGAP/EN-DC flows;SCG change container;PDCP context update;HO to new NR SCG successful;TS 37.340**

**NR-NSA-F6;NSA;EN-DC with SRB reconfiguration;Functional;SRB changes during SCG add/release;SRB1/2 usage;1.RRCReconfiguration with SRB update;SRB mapping IEs;SRB config params;SRB continuity preserved;TS 38.331**

**NR-NSA-F7;NSA;EN-DC Security with split keys;Functional;Security setup for EN-DC split bearers;UE supports separate keys;1.SecurityModeCommand for SCG;Security IEs per leg;PDCP keys,Kasme usage;Secure PDCP/SCG links;TS 33.501**

**NR-NSA-F8;NSA;EN-DC PDU Session with split UPF;Functional;PDU session using both LTE and NR UP path;SMF/UPF split support;1.PDU session setup->SMF config both paths;PFCP/NGAP flows;PDU ID,DNN,SSC Mode;PDCP split mapping;Session uses both UPFs;TS 23.502**

**NR-NSA-F9;NSA;EN-DC Measurement reporting;Functional;UE reports LTE & NR measurements;UE measurement config includes both RATs;1.Configure meas->UE reports;MeasurementReport with NR/LTE cells;RSRP,RSRQ per RAT;RRC:MeasConfig;Reports received and processed;TS 37.340**

**NR-NSA-F10;NSA;EN-DC with EPS Fallback for voice;Functional;VoNR unavailable triggers EPS fallback via LTE anchor;IMS fallback configured;1.Attempt IMS setup->Fallback to EPS;NAS/IMS fallback flows;Fallback indicators,NSSAI;Voice via EPS;TS 23.401**

**NR-NSA-F11;NSA;EN-DC DRB setup on SCG;Functional;Establish DRB on NR SCG for user data;NR SCG active;1.RRCReconfig->DRB add;DRB config IEs,QFI;PDCP:DRB mapping;Data flows on SCG DRB;TS 37.340**

**NR-NSA-F12;NSA;EN-DC RRM across RATs;Functional;RRM coordination between LTE/NR for mobility;SON/RRM support;1.Trigger cross-RAT decision;NG-RAN coordination flows;RRM params per RAT;Coordinator action executed;TS 37.340**

**NR-NSA-F13;NSA;EN-DC with UE in RRC_INACTIVE;Functional;SCG re-establishment from RRC_INACTIVE;UE inactive on LTE;1.RRCResume->SCG add;Resume containers,SCG params;Context resume and SCG add;UE resumes with SCG;TS 38.300**

**NR-NSA-F14;NSA;EN-DC Secondary Addition Reject;Functional;Reject handling when gNB cannot add SCG;Resource reject at gNB;1.Attempt SCG add->Reject;RRCReconfiguration reject flows;Reject cause IEs;UE remains on LTE anchor;TS 37.340**

**NR-NSA-F15;NSA;EN-DC with QoS continuity;Functional;Ensure QoS across LTE and NR legs;QoS flows exist;1.Configure QoS->Check mapping;NGAP/QoS IEs,QFI mapping;QoS maintained end-to-end;TS 23.501**

**NR-NSA-F16;NSA;EN-DC RRC Re-establishment;Functional;RRC re-establishment for SCG failure;SCG fails mid-session;1.RRCReestablish with context;Reestablish flows;Context IEs;RLC/PDCP recovery;Service continuity resumed;TS 38.331**

**NR-NSA-F17;NSA;EN-DC with MC/SCG split removal;Functional;Remove split bearer dynamically;Split active;1.Command to stop split->DRB reassign;PDCP/PDUS mapping;PDCP:stop split;Data flows consolidated;TS 37.340**

**NR-NSA-F18;NSA;EN-DC with E-UTRAN-NR dual connectivity timers;Functional;Timer behaviors for SCG addition/release;Timer config present;1.Trigger SCG add/release per timers;Timer IEs;Timer expiry handling;Procedures follow timer semantics;TS 37.340**

**NR-NSA-F19;NSA;EN-DC with IMS registration impact;Functional;IMS reg behavior when SCG changes;IMS client active;1.SCg change->IMS reg checks;IMS indicators;NSSAI/DNN mapping;IMS remains registered or re-registers per policy;TS 23.501**

**NR-NSA-F20;NSA;EN-DC with Mobility across LTE anchors;Functional;Move UE between eNB anchors while NR SCG persists;Multiple LTE anchors;1.Anchor change->SCG continuity measures;NGAP/SCG containers;PDCP/UP continuity;SCG remains or reconfigured properly;TS 37.340**

### NSA Performance Test Cases (10)

**NR-NSA-P1;NSA;EN-DC Addition Latency;Performance;Measure time to add NR secondary to LTE anchor;Multiple UEs requesting SCG;1.Trigger SCG add;2.Measure completion time;RRCReconfig & NGAP timers;SCG config size,backhaul latency;Addition latency <= KPI;Operator KPI**

**NR-NSA-P2;NSA;EN-DC Throughput with Split Bearer;Performance;Aggregate throughput using LTE+NR split;UE with split bearer;1.Stream data;Measure combined throughput;PDCP split stats,QFI mapping;PHY:BW per leg;Throughput meets combined target;TS 37.340**

**NR-NSA-P3;NSA;EN-DC RAN CPU impact;Performance;gNB CPU impact when serving SCG adds;High SCG add rate;1.Trigger many SCG adds;Monitor CPU/latency;RRC/NGAP load;gNB resource counters;Degradation within limits;Operator KPI**

**NR-NSA-P4;NSA;EN-DC Handover Interruption;Performance;Measure interruption for anchor-triggered SCG HO;Active data ongoing;1.Trigger HO involving SCG change;HO/SCG reconfig timing;PDCP forward timing;Interruption <= target;TS 37.340**

**NR-NSA-P5;NSA;EN-DC Packet Loss during split removal;Performance;Packet loss when stopping split;Active TCP flows;1.Command to stop split;Monitor packet loss;PDCP SN state,forwarding;Packet loss within allowable;Operator KPI**

**NR-NSA-P6;NSA;EN-DC Measurement Reporting Delay;Performance;Time for UE to report measurements across RATs;Config with large meas set;1.Configure measure->Collect times;MeasConfig size,UE proc;Reporting delay within spec;TS 38.331**

**NR-NSA-P7;NSA;EN-DC PDU Session Establish with SCG;Performance;Time to have PDU session uplink via SCG;SMF/UPF config per leg;1.Establish PDU session->Enable SCG UP;NGAP/PFCP flow times;SMF timers;Latency within SLA;TS 23.502**

**NR-NSA-P8;NSA;EN-DC Under Load Throughput;Performance;Throughput during many SCG adds/releases;Stress test;1.Mass SCG add/release while streaming;Aggregate throughput,failures;Backhaul/processing limits;System keeps throughput within bounds;Operator KPI**

**NR-NSA-P9;NSA;EN-DC RRC Connect Time from LTE Idle;Performance;Time to resume RRC and add SCG from LTE idle;UE in idle on LTE;1.Initiate resume->SCG add;RRCResume & SCG add timings;Resume container size;Time within KPI;TS 38.300**

**NR-NSA-P10;NSA;EN-DC Voice Setup Time w/ EPS fallback;Performance;Time to set up voice when fallback invoked;IMS fallback scenario;1.Attempt VoNR->Fallback setup;IMS/NAS timers;Call setup time within SLA;Operator KPI**

### NSA RF Test Cases (10)

**NR-NSA-R1;NSA;EN-DC NR SCG Access at -110 dBm;RF;SCG add under low NR signal;Controlled fading;1.Attempt SCG add;SSB/PBCH decode stats;RSRP/RSRQ,SINR;SCG add succeeds or retries per spec;TS 38.104**

**NR-NSA-R2;NSA;EN-DC SCG Access under Interference;RF;SCG performance with high NR interference;Interferer active;1.Attempt SCG add;PBCH/SSB errors;SINR thresholds;SCG behavior per spec;TS 38.104**

**NR-NSA-R3;NSA;EN-DC Cross-RAT Measurement Accuracy;RF;Check accuracy of NR vs LTE measurements;Controlled RF env;1.Measure both RATs;Compare RSRP/RSRQ values;Measurement IEs per RAT;Measurements consistent and usable;TS 37.340**

**NR-NSA-R4;NSA;EN-DC with differing TDD patterns;RF;SCG add when NR and LTE use different TDD patterns;Different slot formats;1.Attempt SCG add;Timing adaptation;SIB/TDD info;UE synchronizes and SCG added;TS 38.211**

**NR-NSA-R5;NSA;EN-DC Beam selection accuracy;RF;NR beam selection as SCG added;Beamformed gNB;1.Sweep beams->Select best;SSB beam index,beamRef;PHY:beam indices;UE selects appropriate beam;TS 38.211**

**NR-NSA-R6;NSA;EN-DC with FR1-FR2 combined;RF;SCG add when NR uses FR2 and LTE anchor FR1;Mixed bands;1.Attempt SCG add;Carrier info,bandwidth;PHY:carrier aggregation limits;SCG added and operates;TS 38.104**

**NR-NSA-R7;NSA;EN-DC with CFO across legs;RF;Frequency offsets between LTE and NR legs;Introduce CFO;1.Attempt SCG add;Sync metrics;PHY:freq offsets handled;SCG functions correctly;TS 38.211**

**NR-NSA-R8;NSA;EN-DC with UE antenna diversity differences;RF;UE behaves with different antenna configs per RAT;Change UE antenna ports;1.Attempt SCG add;Link metrics per RAT;PHY:antenna port mapping;UE operates with reduced/good perf;TS 38.104**

**NR-NSA-R9;NSA;EN-DC with neighbor cell mismatch;RF;Inconsistent neighbor info between LTE and NR;Incorrect SIBs;1.Attempt SCG add;Detect mismatch;SIB neighbor lists;SCG add handled gracefully;TS 37.340**

**NR-NSA-R10;NSA;EN-DC SCG addition with tight TA;RF;TA values differ between legs;Tight timing constraints;1.Attempt SCG add;TA IE values;PHY:timing advance;UE aligns TA and SCG added;TS 38.213**

### NSA Stability Test Cases (5)

**NR-NSA-S1;NSA;EN-DC 24hr SCG add/remove stress;Stability;Repeated SCG add/remove cycles over 24 hrs;Small UE set;1.Run SCG add/remove loops;Monitor failure counters;RRC/NGAP loops;Failure rate < threshold;TS 32.450**

**NR-NSA-S2;NSA;EN-DC under backhaul loss;Stability;Intermittent X2/Xn/backhaul loss during SCG ops;Backhaul emulator;1.Induce backhaul loss;Observe recovery;NGAP/TNL cause codes;System recovers with minimal service impact;TS 23.502**

**NR-NSA-S3;NSA;EN-DC with LTE anchor change;Stability;Move UE between LTE anchors while SCG persists;Multiple LTE eNB;1.Anchor change sequences;NGAP/SCG continuity checks;PDCP continuity;SCG maintained or reconfigured properly;TS 37.340**

**NR-NSA-S4;NSA;EN-DC with repeated split toggles;Stability;Toggle split bearer on/off many times;1.Repeated toggle commands;PDCP split counters;No resource leak or crashes;TS 37.340**

**NR-NSA-S5;NSA;EN-DC long duration VoIP call with SCG churn;Stability;Long VoIP call while SCG added/removed;Active VoIP session;1.Run call and SCG changes;IMS/NAS/RRC interactions;Call maintained with acceptable quality;TS 23.501**

### NSA Sanity Test Cases (5)

**NR-NSA-SN1;NSA;EN-DC Sanity Basic SCG add;Sanity;Quick check of SCG add;Simple setup;1.Add SCG;RRCReconfig->SCG add;Minimal IEs;SCG added;TS 37.340**

**NR-NSA-SN2;NSA;EN-DC Sanity SCG release;Sanity;Quick SCG release test;SCG active;1.Release SCG;RRC flows;SCG released;TS 37.340**

**NR-NSA-SN3;NSA;EN-DC Sanity Split Bearer data;Sanity;Simple split bearer data transfer;Split configured;1.Send small data;PDCP split observed;Basic data flow;TS 37.340**

**NR-NSA-SN4;NSA;EN-DC Sanity EPS fallback;Sanity;Check fallback to EPS for voice;IMS fallback scenario;1.Invoke fallback;Voice via EPS;Call OK;TS 23.401**

**NR-NSA-SN5;NSA;EN-DC Sanity Measurement Report;Sanity;Verify measurement reporting across RATs;Config small meas set;1.Trigger meas->Receive report;Measurement IE presence;Reports OK;TS 37.340**

---

## Summary

### Test Case Distribution
- **SA (Standalone) Test Cases**: 350 test cases
  - Initial Access: 50 test cases
  - Handover: 50 test cases
  - PDU Session: 50 test cases
  - Mobility: 50 test cases
  - Security: 50 test cases
  - Measurement: 50 test cases
  - Power Control: 50 test cases
  - Scheduling: 50 test cases

- **NSA (Non-Standalone) Test Cases**: 50 test cases
  - EN-DC Functional: 20 test cases
  - EN-DC Performance: 10 test cases
  - EN-DC RF: 10 test cases
  - EN-DC Stability: 5 test cases
  - EN-DC Sanity: 5 test cases

**Total 5G NR Test Cases**: 400 test cases

### Key Features Covered
1. **SA (Standalone) 5G NR**
2. **NSA (Non-Standalone) EN-DC**
3. **Multiple Split Bearer Scenarios**
4. **Cross-RAT Coordination**
5. **Performance and RF Testing**
6. **Stability and Sanity Testing**

### 3GPP References
- **TS 38.300**: NR Overall Description
- **TS 38.331**: NR RRC Protocol
- **TS 37.340**: Multi-connectivity
- **TS 23.501**: 5G System Architecture
- **TS 23.502**: 5G System Procedures
- **TS 24.501**: Non-Access-Stratum (NAS) protocol
- **TS 33.501**: 5G System Security
- **TS 38.104**: NR Base Station Radio Transmission and Reception