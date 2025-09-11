# Log Format Reference Guide

## srsRAN gNB Log Format

### General Format
```
<Timestamp> [Component] [Log Level] [Slot] Message
```

### Components
- `GNB`: General gNB info
- `PHY`: Physical layer
- `MAC`: MAC layer
- `RLC`: RLC layer
- `SCHED`: Scheduler
- `GTPU`: GTP-U tunnel
- `DU-MNG`: DU Management
- `DU-F1`: F1 interface
- `CU-CP-F1`: CU-CP F1 interface

### Log Levels
- `[I]`: Info
- `[W]`: Warning
- `[E]`: Error
- `[D]`: Debug

### Examples
```
[PHY] [I] [931.6] PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us
[MAC] [I] [938.5] DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55
[RLC] [I] du=0 ue=0 SRB1 DL: TX PDU. dc=data p=1 si=full sn=0 pdu_len=53 grant_len=55
```

---

## Open5GS Log Format

### General Format
```
MM/DD HH:MM:SS.mmm: [component] level: message
```

### Components
- `amf`: Access and Mobility Management Function
- `smf`: Session Management Function
- `upf`: User Plane Function
- `ausf`: Authentication Server Function
- `udm`: Unified Data Management
- `udr`: Unified Data Repository
- `pcf`: Policy and Charging Function
- `nrf`: NF Repository Function
- `mme`: Mobility Management Entity (4G)
- `sgwc/sgwu`: Serving Gateway Control/User Plane
- `pgwc/pgwu`: Packet Gateway Control/User Plane

### Log Levels
- `fatal`: Fatal errors
- `error`: Error messages
- `warn`: Warning messages
- `info`: Information messages (default)
- `debug`: Debug messages
- `trace`: Trace messages

### Examples
```
09/06 11:44:07.168: [amf] INFO: AMF initialize...done (../src/amf/context.c:543)
09/06 11:44:07.168: [amf] INFO: [4b0f842e-6c7c-41ef-90b1-28c7e5f8c5c1] NF registered [Heartbeat:10s] (../lib/sbi/context.c:2025)
09/06 11:44:07.200: [smf] INFO: UE SUPI[imsi-001010000000001] DNN[internet] IPv4[10.45.0.2] IPv6[] (../src/smf/context.c:1050)
09/06 11:44:07.201: [upf] INFO: [Added] Number of UPF-Sessions is now 1 (../src/upf/context.c:209)
```

---

## Kamailio SIP Server Log Format

### General Format
```
MMM DD HH:MM:SS hostname kamailio[PID]: LEVEL: <core> [cfg_line]: message
```

### Components
- `<core>`: Core SIP processing
- `<script>`: Configuration script
- `<tm>`: Transaction Module
- `<registrar>`: Registration Module  
- `<usrloc>`: User Location Module
- `<auth>`: Authentication Module
- `<dialog>`: Dialog Module

### Log Levels
- `CRITICAL`: Critical system errors
- `ERROR`: Error conditions
- `WARNING`: Warning conditions
- `NOTICE`: Normal but significant conditions
- `INFO`: Informational messages
- `DEBUG`: Debug messages

### xlog() Custom Format
```
xlog("L_INFO", "CALL: $rm from $fu to $ru via $si:$sp")
```

### Examples
```
Sep  6 11:44:07 server kamailio[12345]: INFO: <core> [cfg.y:3581]: yyparse(): config file ok, exiting...
Sep  6 11:44:07 server kamailio[12345]: INFO: <script>: CALL: INVITE from sip:alice@example.com to sip:bob@example.com via 192.168.1.100:5060
Sep  6 11:44:07 server kamailio[12345]: INFO: <tm> [t_lookup.c:1025]: t_check_msg(): msg (0x7f8b1c0a4d68) debug: T(0x7f8b1c0a4d68)=0x(nil)
Sep  6 11:44:07 server kamailio[12345]: WARNING: <registrar> [save.c:247]: test_contact(): contact 'sip:alice@192.168.1.101:5060' has expires=3600
```

### SIP Message Fields (available in xlog)
- `$rm`: Request method (INVITE, REGISTER, etc.)
- `$fu`: From URI
- `$tu`: To URI 
- `$ru`: Request URI
- `$si`: Source IP
- `$sp`: Source Port
- `$ci`: Call-ID
- `$cs`: CSeq
- `$ua`: User-Agent