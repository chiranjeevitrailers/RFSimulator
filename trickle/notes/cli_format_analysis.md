# CLI Log Format and Frontend Display Synchronization Analysis

## Current Issues Identified

### 1. **Parser Field Mapping Mismatch**
- `SrsranCliParser.extractPhyMetrics()` extracts fields like `rsrp`, `sinr`, `cqi` 
- `EnhancedLogsView` expects fields like `ies`, `rawData`, `channel`
- **Issue**: Field names don't match between parser output and UI expectations

### 2. **LogEntry Model vs Parser Output**
- `LogEntry` model has: `fields`, `layer`, `messageType`, `rnti`
- `SrsranMessageDecoder` expects: `informationElements`, `decodedMessage`, `channel`
- **Issue**: Different property names for same data

### 3. **Sample Data vs Real Parser**
- `EnhancedLogsView` uses hardcoded sample data with structure:
  ```js
  {id, timestamp, direction, layer, channel, sfn, messageType, rnti, message, rawData, ies}
  ```
- `SrsranCliParser` outputs different structure via `LogEntry`:
  ```js  
  {timestamp, level, source, component, message, rawLine, metrics, parsed}
  ```

### 4. **Missing Integration Points**
- No real CLI data flowing to `EnhancedLogsView`
- Mock data doesn't reflect actual srsRAN log format
- Decoder expects hex data but parser doesn't extract it

## Recommended Fixes

1. **Standardize field mapping** between parsers and UI components
2. **Update LogEntry model** to include all required fields
3. **Replace sample data** with real parser integration
4. **Add format validation** to ensure CLI output matches expectations