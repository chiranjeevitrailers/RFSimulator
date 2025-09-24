# 5GLabX End-to-End Test Cases Database

This directory contains the complete SQL database schema and data for all 8 End-to-End test cases in the 5GLabX platform.

## Database Files

### Schema Files
- **`schema.sql`** - Complete database schema with tables, indexes, constraints, and triggers
- **`insert_e2e_test_cases.sql`** - First 2 E2E test cases (SMS Service, 5G→LTE Handover) - **WARNING: May cause duplicate key errors if data exists**
- **`insert_remaining_e2e_test_cases.sql`** - Next 3 E2E test cases (MO Data, MT Data, MT CSFB) - **WARNING: May cause duplicate key errors if data exists**
- **`insert_final_e2e_test_cases.sql`** - Final 3 E2E test cases (MO CSFB, LTE→5G Handover, 3G→LTE Handover) - **WARNING: May cause duplicate key errors if data exists**

### Upsert Files (Recommended)
- **`upsert_e2e_test_cases.sql`** - First 2 E2E test cases with INSERT ... ON CONFLICT handling
- **`upsert_remaining_e2e_test_cases.sql`** - Next 3 E2E test cases with INSERT ... ON CONFLICT handling
- **`upsert_final_e2e_test_cases.sql`** - Final 3 E2E test cases with INSERT ... ON CONFLICT handling

## Database Structure

### Tables
1. **`test_cases`** - Main test case definitions
2. **`test_case_messages`** - Individual messages in test flows
3. **`test_case_information_elements`** - Information Elements (IEs)
4. **`test_case_layer_parameters`** - Layer-specific parameters
5. **`test_case_executions`** - Test execution records

### Key Features
- **UUID Primary Keys** for all tables
- **JSONB Fields** for flexible data storage
- **Comprehensive Indexes** for optimal performance
- **Check Constraints** for data validation
- **Automatic Timestamps** with triggers
- **Foreign Key Relationships** with cascade deletes

## All 8 End-to-End Test Cases

### 1. SMS Service E2E
- **ID**: `d427e8aa-d3c7-46e3-80f5-f955571934ea`
- **Flow**: MO → SMSC → MT Delivery
- **Protocol**: LTE
- **Messages**: 10 (PHY, MAC, RRC, NAS)
- **IEs**: 10 (MANDATORY, MEASUREMENT, CONFIG)
- **Layer Parameters**: 10

### 2. 5G→LTE Handover E2E
- **ID**: `7004525a-5fb2-4654-bc91-44ccde3eb358`
- **Flow**: Measurement → Handover → Bearer Update
- **Protocol**: Multi
- **Messages**: 10 (5G SSB/CSI-RS → LTE PSS/SSS)
- **IEs**: 10 (5G-GUTI, Measurement-ID, RSRP/RSRQ)
- **Layer Parameters**: 11

### 3. MO Data E2E
- **ID**: `a5131c90-ae41-4f5c-a2cb-2d4148022fb2`
- **Flow**: PDP Activation → Data Transfer
- **Protocol**: LTE
- **Messages**: 10 (PHY, MAC, RRC, NAS)
- **IEs**: 10 (UE-Identity, Transaction-ID, Cell-ID)
- **Layer Parameters**: 10

### 4. MT Data E2E
- **ID**: `d2aa6348-aa78-476a-aaa8-fbf7113d6b0b`
- **Flow**: Paging → Data Delivery
- **Protocol**: LTE
- **Messages**: 10 (Paging → Service Request)
- **IEs**: 10 (UE-Identity, Transaction-ID, Cell-ID)
- **Layer Parameters**: 10

### 5. MT CSFB E2E
- **ID**: `5eabd3f3-8c8a-4a0c-b3a6-b5dccc704966`
- **Flow**: Voice Call → Fallback → Connection
- **Protocol**: LTE
- **Messages**: 10 (Paging → CSFB Request)
- **IEs**: 10 (UE-Identity, Transaction-ID, Cell-ID)
- **Layer Parameters**: 10

### 6. MO CSFB E2E
- **ID**: `e2482966-76f0-433b-bcf6-2473595f5792`
- **Flow**: Voice Attempt → Fallback → Connection
- **Protocol**: LTE
- **Messages**: 10 (Service Request → CSFB Request)
- **IEs**: 10 (UE-Identity, Transaction-ID, Cell-ID)
- **Layer Parameters**: 10

### 7. LTE→5G Handover E2E
- **ID**: `ae7132e4-5f3a-42b1-9a38-d513f4ab5e07`
- **Flow**: Measurement → Handover → QoS Update
- **Protocol**: Multi
- **Messages**: 10 (LTE PSS/SSS → 5G SSB/CSI-RS)
- **IEs**: 10 (LTE-GUTI, Measurement-ID, RSRP/RSRQ)
- **Layer Parameters**: 11

### 8. 3G→LTE Handover E2E
- **ID**: `f951d40d-7c5b-44ce-b8e3-8af5a0ad4e6f`
- **Flow**: Measurement → Relocation → Bearer Update
- **Protocol**: Multi
- **Messages**: 10 (3G CPICH/P-CCPCH → LTE PSS/SSS)
- **IEs**: 10 (3G-GUTI, Measurement-ID, CPICH-RSCP/EcNo)
- **Layer Parameters**: 11

## Installation Instructions

### 1. Create Database
```sql
CREATE DATABASE 5glabx_e2e_tests;
```

### 2. Run Schema
```bash
psql -d 5glabx_e2e_tests -f schema.sql
```

### 3. Insert Test Cases (Recommended - Use Upsert Files)
```bash
# Use upsert files to handle existing data gracefully
psql -d 5glabx_e2e_tests -f upsert_e2e_test_cases.sql
psql -d 5glabx_e2e_tests -f upsert_remaining_e2e_test_cases.sql
psql -d 5glabx_e2e_tests -f upsert_final_e2e_test_cases.sql
```

**Alternative (May cause duplicate key errors if data exists):**
```bash
psql -d 5glabx_e2e_tests -f insert_e2e_test_cases.sql
psql -d 5glabx_e2e_tests -f insert_remaining_e2e_test_cases.sql
psql -d 5glabx_e2e_tests -f insert_final_e2e_test_cases.sql
```

## Data Summary

- **Total Test Cases**: 8
- **Total Messages**: 80 (10 per test case)
- **Total Information Elements**: 80 (10 per test case)
- **Total Layer Parameters**: 81 (10-11 per test case)
- **Layers Covered**: PHY, MAC, RRC, NAS
- **Protocols**: LTE, 5G NR, Multi-protocol
- **3GPP Standards**: TS 23.040, TS 23.401, TS 23.272, TS 36.331, TS 38.331, TS 25.331

## Usage

The database is designed to work seamlessly with the 5GLabX platform's API endpoints:
- `/api/test-execution/simple` - Retrieve test case data
- `/api/test-cases/create` - Create new test cases
- `/api/test-cases/update/[id]` - Update existing test cases

All test cases generate complete 3GPP-compliant data with proper message flows, Information Elements, and layer-wise parameters for professional-grade End-to-End testing.