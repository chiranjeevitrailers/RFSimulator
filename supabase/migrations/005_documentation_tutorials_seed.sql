-- ==============================================
-- 5GLabX Platform - Documentation & Tutorials Seed Data
-- Production-ready documentation and tutorials for platform launch
-- ==============================================

-- Insert documentation
INSERT INTO public.documentation (
    title, slug, content, excerpt, category, tags, is_published, is_featured, view_count, published_at
) VALUES 
-- Getting Started Documentation
(
    'Getting Started with 5GLabX',
    'getting-started',
    '# Getting Started with 5GLabX

Welcome to 5GLabX, the professional 5G protocol simulator and analysis platform. This guide will help you get started with testing and analyzing 4G/5G protocols.

## What is 5GLabX?

5GLabX is a comprehensive platform for:
- **Protocol Testing**: Test 4G LTE, 5G NR, IMS/SIP, O-RAN, NB-IoT, V2X, and NTN protocols
- **Real-time Analysis**: Monitor protocol behavior in real-time with professional tools
- **3GPP Compliance**: Validate your implementations against 3GPP standards
- **Professional Interface**: Use tools similar to QXDM, Keysight, and other commercial analyzers

## Quick Start

1. **Sign Up**: Create your account and choose a subscription plan
2. **Select Test Case**: Browse our library of 3GPP-compliant test cases
3. **Configure Test**: Set up your test parameters and configuration
4. **Execute Test**: Run the test and monitor real-time results
5. **Analyze Results**: Use our professional analysis tools to review results

## Key Features

- **Professional Protocol Analyzer**: QXDM/Keysight-like interface
- **Real-time Log Viewer**: Advanced filtering and analysis
- **Layer-by-layer Analysis**: PHY, MAC, RLC, PDCP, RRC, NAS visualization
- **3GPP Compliance**: Standard references and validation
- **Export Capabilities**: Export data for further analysis

## Next Steps

- Explore our [Test Case Library](/test-cases)
- Learn about [Configuration Management](/configurations)
- Check out our [API Documentation](/api-docs)
- Join our [Community Forum](/community)',
    'Complete guide to getting started with 5GLabX platform for 4G/5G protocol testing and analysis.',
    'getting-started',
    ARRAY['getting-started', 'tutorial', 'guide', '5G', 'protocol-testing'],
    true,
    true,
    0,
    NOW()
),

-- API Documentation
(
    'API Documentation',
    'api-documentation',
    '# 5GLabX API Documentation

The 5GLabX API provides programmatic access to all platform features for integration with your existing tools and workflows.

## Authentication

All API requests require authentication using Bearer tokens:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.5glabx.com/v1/test-cases
```

## Base URL

```
https://api.5glabx.com/v1
```

## Endpoints

### Test Cases

#### List Test Cases
```http
GET /test-cases
```

#### Get Test Case
```http
GET /test-cases/{id}
```

#### Execute Test Case
```http
POST /test-cases/{id}/execute
```

### Test Executions

#### List Executions
```http
GET /executions
```

#### Get Execution
```http
GET /executions/{id}
```

#### Get Execution Results
```http
GET /executions/{id}/results
```

### Configurations

#### List Configurations
```http
GET /configurations
```

#### Create Configuration
```http
POST /configurations
```

#### Update Configuration
```http
PUT /configurations/{id}
```

## Rate Limits

- **Free Plan**: 100 requests/hour
- **Pro Plan**: 1,000 requests/hour
- **Enterprise Plan**: 10,000 requests/hour

## SDKs

We provide SDKs for:
- Python
- JavaScript/Node.js
- Java
- C#

## Support

For API support, contact us at api-support@5glabx.com',
    'Complete API documentation for 5GLabX platform with endpoints, authentication, and examples.',
    'api',
    ARRAY['api', 'documentation', 'integration', 'sdk', 'rest'],
    true,
    true,
    0,
    NOW()
),

-- 3GPP Standards Guide
(
    '3GPP Standards Compliance',
    '3gpp-standards',
    '# 3GPP Standards Compliance

5GLabX ensures full compliance with 3GPP standards for all supported protocols.

## Supported Standards

### 5G NR (New Radio)
- **TS 38.211**: Physical channels and modulation
- **TS 38.212**: Multiplexing and channel coding
- **TS 38.213**: Physical layer procedures for control
- **TS 38.214**: Physical layer procedures for data
- **TS 38.321**: Medium Access Control (MAC) protocol
- **TS 38.322**: Radio Link Control (RLC) protocol
- **TS 38.323**: Packet Data Convergence Protocol (PDCP)
- **TS 38.331**: Radio Resource Control (RRC) protocol
- **TS 24.501**: Non-Access Stratum (NAS) protocol

### 4G LTE
- **TS 36.211**: Physical channels and modulation
- **TS 36.212**: Multiplexing and channel coding
- **TS 36.213**: Physical layer procedures
- **TS 36.214**: Physical layer procedures for data
- **TS 36.321**: Medium Access Control (MAC) protocol
- **TS 36.322**: Radio Link Control (RLC) protocol
- **TS 36.323**: Packet Data Convergence Protocol (PDCP)
- **TS 36.331**: Radio Resource Control (RRC) protocol
- **TS 24.301**: Non-Access Stratum (NAS) protocol

### IMS/SIP
- **TS 24.229**: IP multimedia call control protocol
- **TS 24.501**: Non-Access Stratum (NAS) protocol for 5G
- **TS 33.501**: Security architecture and procedures

## Compliance Validation

All test cases include:
- **Standard References**: Direct links to 3GPP specifications
- **Information Element Validation**: IEs validated against standards
- **Message Flow Compliance**: Proper sequencing per 3GPP
- **Performance Targets**: Based on 3GPP requirements

## Validation Process

1. **Message Structure**: Validated against 3GPP message definitions
2. **Information Elements**: IEs checked for type, range, and mandatory status
3. **Protocol Flow**: Message sequencing validated per standards
4. **Performance Metrics**: Targets based on 3GPP specifications

## Custom Validation

You can add custom validation rules for:
- Specific IE values
- Message timing requirements
- Performance thresholds
- Error scenarios',
    'Complete guide to 3GPP standards compliance in 5GLabX platform with supported specifications and validation process.',
    'standards',
    ARRAY['3gpp', 'standards', 'compliance', 'validation', 'specifications'],
    true,
    true,
    0,
    NOW()
),

-- Troubleshooting Guide
(
    'Troubleshooting Guide',
    'troubleshooting',
    '# Troubleshooting Guide

Common issues and solutions for using the 5GLabX platform.

## Test Execution Issues

### Test Case Fails to Start
**Symptoms**: Test case shows "Failed" status immediately
**Solutions**:
1. Check your subscription limits
2. Verify test case configuration
3. Ensure sufficient system resources
4. Contact support if issue persists

### Slow Test Execution
**Symptoms**: Tests take longer than expected
**Solutions**:
1. Reduce time acceleration factor
2. Check network connectivity
3. Verify system performance
4. Consider upgrading subscription plan

### Missing Test Results
**Symptoms**: Test completes but no results displayed
**Solutions**:
1. Refresh the page
2. Check browser console for errors
3. Verify data export permissions
4. Contact support with execution ID

## Configuration Issues

### Invalid Configuration
**Symptoms**: Configuration validation fails
**Solutions**:
1. Check required fields are filled
2. Verify parameter ranges
3. Use default configurations as reference
4. Review configuration documentation

### Configuration Not Saving
**Symptoms**: Changes not persisted
**Solutions**:
1. Check internet connection
2. Verify browser permissions
3. Try refreshing the page
4. Clear browser cache

## Performance Issues

### Slow Page Loading
**Solutions**:
1. Check internet connection speed
2. Clear browser cache
3. Disable browser extensions
4. Try different browser

### High Memory Usage
**Solutions**:
1. Close unused browser tabs
2. Reduce concurrent test executions
3. Use basic log level for large tests
4. Restart browser

## API Issues

### Authentication Errors
**Solutions**:
1. Verify API token is valid
2. Check token expiration
3. Ensure correct headers
4. Regenerate token if needed

### Rate Limit Exceeded
**Solutions**:
1. Implement request throttling
2. Upgrade subscription plan
3. Use batch operations
4. Contact support for limits

## Getting Help

### Support Channels
- **Email**: support@5glabx.com
- **Documentation**: /docs
- **Community Forum**: /community
- **Live Chat**: Available for Pro/Enterprise users

### Reporting Issues
When reporting issues, include:
1. Description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser and system information
5. Screenshots or error messages',
    'Comprehensive troubleshooting guide for common 5GLabX platform issues with solutions and support information.',
    'troubleshooting',
    ARRAY['troubleshooting', 'support', 'issues', 'solutions', 'help'],
    true,
    false,
    0,
    NOW()
),

-- Security Guide
(
    'Security and Privacy',
    'security-privacy',
    '# Security and Privacy

5GLabX takes security and privacy seriously. Learn about our security measures and data protection practices.

## Data Security

### Encryption
- **In Transit**: All data encrypted using TLS 1.3
- **At Rest**: Database encryption using AES-256
- **API**: All API communications encrypted
- **Files**: Uploaded files encrypted and secured

### Access Control
- **Authentication**: Multi-factor authentication supported
- **Authorization**: Role-based access control (RBAC)
- **API Keys**: Secure API key management
- **Session Management**: Secure session handling

### Infrastructure Security
- **Cloud Security**: AWS/Azure security best practices
- **Network Security**: VPC, firewalls, and DDoS protection
- **Monitoring**: 24/7 security monitoring
- **Updates**: Regular security updates and patches

## Data Privacy

### Data Collection
We collect only necessary data:
- Account information (email, name)
- Test case configurations
- Test execution results
- Usage analytics (anonymized)

### Data Usage
Your data is used for:
- Platform functionality
- Service improvement
- Support and troubleshooting
- Compliance and security

### Data Retention
- **Account Data**: Retained while account is active
- **Test Results**: Retained per subscription plan limits
- **Logs**: Retained for 90 days
- **Analytics**: Anonymized and retained for 1 year

### Data Sharing
We do not sell or share your data with third parties except:
- Service providers (under strict agreements)
- Legal requirements
- Business transfers (with notice)

## Compliance

### Standards Compliance
- **SOC 2 Type II**: Security and availability controls
- **ISO 27001**: Information security management
- **GDPR**: European data protection compliance
- **CCPA**: California privacy compliance

### Certifications
- **Security Audits**: Regular third-party audits
- **Penetration Testing**: Annual security testing
- **Vulnerability Scanning**: Continuous monitoring
- **Compliance Reviews**: Regular compliance assessments

## Your Rights

### Data Access
- View your personal data
- Export your test results
- Download your configurations
- Access audit logs

### Data Control
- Update your information
- Delete your account
- Modify data retention preferences
- Opt-out of communications

### Data Portability
- Export test case data
- Download execution results
- Transfer configurations
- API access for data migration

## Security Best Practices

### For Users
1. Use strong passwords
2. Enable two-factor authentication
3. Keep software updated
4. Be cautious with API keys
5. Report security issues

### For Organizations
1. Implement access controls
2. Regular security training
3. Monitor usage patterns
4. Use enterprise SSO
5. Regular security reviews

## Incident Response

### Security Incidents
- **Detection**: Automated monitoring and alerts
- **Response**: Immediate incident response team
- **Notification**: Affected users notified promptly
- **Recovery**: Rapid recovery procedures
- **Post-Incident**: Analysis and improvements

### Reporting Security Issues
Report security issues to: security@5glabx.com

Include:
- Description of the issue
- Steps to reproduce
- Potential impact
- Contact information

## Contact

For security questions:
- **Email**: security@5glabx.com
- **Phone**: +1-555-SECURITY
- **PGP Key**: Available on request',
    'Comprehensive guide to 5GLabX security measures, data privacy practices, and compliance standards.',
    'security',
    ARRAY['security', 'privacy', 'compliance', 'encryption', 'gdpr'],
    true,
    true,
    0,
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert tutorials
INSERT INTO public.tutorials (
    title, slug, description, content, difficulty, estimated_time_minutes, prerequisites, learning_objectives,
    is_published, is_featured, view_count, completion_count, rating, published_at
) VALUES 
-- Beginner Tutorial: First Test Case
(
    'Your First 5G Test Case',
    'first-5g-test-case',
    'Learn how to execute your first 5G NR test case and analyze the results using 5GLabX platform.',
    '# Your First 5G Test Case

Welcome to your first 5G test case tutorial! In this guide, you will learn how to execute a 5G NR initial access test case and analyze the results.

## Prerequisites

- 5GLabX account (Free plan or higher)
- Basic understanding of 5G concepts
- Web browser with JavaScript enabled

## Step 1: Access the Platform

1. Log in to your 5GLabX account
2. Navigate to the User Dashboard
3. Click on "Test Cases" in the navigation menu

## Step 2: Select a Test Case

1. Browse the test case library
2. Look for "5G NR Initial Access - Complete Flow"
3. Click on the test case to view details
4. Review the test case description and parameters

## Step 3: Configure the Test

1. Click "Configure Test" button
2. Select "Default 5G NR Configuration"
3. Review the configuration parameters:
   - Network settings (PLMN, cell ID, frequency)
   - UE settings (IMSI, capabilities, security)
   - Layer parameters (PHY, MAC, RLC, PDCP, RRC, NAS)
4. Click "Save Configuration"

## Step 4: Execute the Test

1. Click "Execute Test" button
2. Select execution mode:
   - **Simulation**: Faster execution for learning
   - **Real-time**: Realistic timing for analysis
3. Set time acceleration (1x for real-time, 10x for faster)
4. Click "Start Execution"

## Step 5: Monitor Execution

1. Watch the real-time progress bar
2. Monitor the Protocol Analyzer view:
   - Message flow with timestamps
   - Layer-by-layer processing
   - Information elements and parameters
3. Check the Log Viewer for detailed logs
4. Review Protocol Layer Display for statistics

## Step 6: Analyze Results

1. Wait for test completion
2. Review the execution summary:
   - Success rate and performance metrics
   - Layer statistics and throughput
   - Error analysis and compliance score
3. Export results if needed
4. Save configuration for future use

## Key Learning Points

- **Message Flow**: Understanding 5G NR initial access procedure
- **Layer Analysis**: How different protocol layers interact
- **3GPP Compliance**: Validation against standards
- **Performance Metrics**: Latency, throughput, and error rates

## Next Steps

- Try different test cases (handover, performance)
- Experiment with custom configurations
- Explore advanced analysis features
- Join the community forum for discussions

## Troubleshooting

### Common Issues
- **Test fails to start**: Check subscription limits
- **Slow execution**: Reduce time acceleration
- **Missing results**: Refresh the page

### Getting Help
- Check the troubleshooting guide
- Contact support at support@5glabx.com
- Join the community forum

## Conclusion

Congratulations! You have successfully executed your first 5G test case. You now understand:
- How to select and configure test cases
- How to execute tests and monitor progress
- How to analyze results and performance metrics
- How to use the professional protocol analyzer interface

Continue exploring the platform to learn more about 5G protocol testing and analysis.',
    'beginner',
    30,
    ARRAY['5GLabX account', 'Basic 5G knowledge'],
    ARRAY['Execute a 5G NR test case', 'Analyze protocol message flow', 'Understand layer interactions', 'Review performance metrics'],
    true,
    true,
    0,
    0,
    0.0,
    NOW()
),

-- Intermediate Tutorial: Custom Configuration
(
    'Creating Custom Test Configurations',
    'custom-test-configurations',
    'Learn how to create and manage custom test configurations for your specific testing needs.',
    '# Creating Custom Test Configurations

In this tutorial, you will learn how to create custom test configurations to tailor test cases to your specific requirements.

## Prerequisites

- 5GLabX Pro or Enterprise account
- Understanding of protocol parameters
- Completed "Your First 5G Test Case" tutorial

## Step 1: Access Configuration Management

1. Navigate to "Configurations" in the dashboard
2. Click "Create New Configuration"
3. Select the protocol type (5G NR, 4G LTE, IMS/SIP, etc.)

## Step 2: Basic Configuration Setup

1. **General Settings**:
   - Name: "My Custom 5G Config"
   - Description: Brief description of the configuration
   - Execution mode: Simulation, Real-time, or Batch
   - Time acceleration: 1x to 100x
   - Log level: Basic, Detailed, or Verbose

2. **Network Configuration**:
   - PLMN: Mobile Country Code (MCC) and Mobile Network Code (MNC)
   - Cell settings: Cell ID, PCI, TAC
   - Frequency: Downlink and uplink frequencies
   - Bandwidth: Channel bandwidth

## Step 3: UE Configuration

1. **Identity Settings**:
   - IMSI: International Mobile Subscriber Identity
   - IMEI: International Mobile Equipment Identity
   - GUTI: Globally Unique Temporary Identity

2. **Capabilities**:
   - Maximum bandwidth support
   - MIMO layers
   - Supported modulations
   - Carrier aggregation support

3. **Security Settings**:
   - Authentication method (5G-AKA, AKA)
   - Encryption algorithm (AES-128, AES-256)
   - Integrity protection

## Step 4: Layer-Specific Configuration

### PHY Layer
- ARFCN (Absolute Radio Frequency Channel Number)
- Subcarrier spacing
- Power control settings
- Beamforming configuration

### MAC Layer
- HARQ settings (enabled/disabled, max processes)
- Scheduling algorithm
- Logical channel configuration
- Random access parameters

### RLC Layer
- RLC mode (AM, UM, TM)
- Retransmission settings
- Window size
- Segmentation parameters

### PDCP Layer
- PDCP mode
- Security settings
- Compression configuration
- Sequence number management

### RRC Layer
- RRC state
- Security activation
- Mobility management
- Measurement configuration

### NAS Layer
- NAS state
- Security context
- Session management
- Mobility settings

## Step 5: Test-Specific Parameters

1. **Scenario Configuration**:
   - Test scenario type
   - Duration and iterations
   - Success criteria
   - Failure thresholds

2. **Performance Targets**:
   - Latency requirements
   - Throughput targets
   - Error rate limits
   - Quality metrics

## Step 6: Advanced Settings

1. **Debug Configuration**:
   - Debug mode enabled/disabled
   - Trace level (Basic, Detailed, Full)
   - Memory and CPU limits
   - Custom parameters

2. **Export Settings**:
   - Output format (JSON, Hex, Binary, Text)
   - Data capture mode
   - Export options

## Step 7: Validation and Testing

1. **Configuration Validation**:
   - Check for required fields
   - Validate parameter ranges
   - Verify compatibility
   - Test configuration

2. **Save and Share**:
   - Save configuration
   - Set sharing permissions
   - Add tags and description
   - Version control

## Step 8: Using Custom Configurations

1. **Test Execution**:
   - Select your custom configuration
   - Execute test case
   - Monitor results
   - Compare with default configurations

2. **Configuration Management**:
   - Clone configurations
   - Create templates
   - Share with team
   - Version control

## Best Practices

### Configuration Design
- Start with default configurations
- Make incremental changes
- Document your changes
- Test thoroughly

### Parameter Selection
- Use realistic values
- Consider 3GPP specifications
- Test edge cases
- Validate against standards

### Performance Optimization
- Balance accuracy vs. speed
- Use appropriate time acceleration
- Monitor resource usage
- Optimize for your use case

## Troubleshooting

### Common Issues
- **Invalid parameters**: Check parameter ranges
- **Configuration errors**: Validate all fields
- **Performance issues**: Adjust time acceleration
- **Compatibility problems**: Check protocol versions

### Validation Errors
- Review error messages
- Check 3GPP specifications
- Use default values as reference
- Contact support if needed

## Advanced Features

### Template Creation
- Create reusable templates
- Share with organization
- Version control
- Documentation

### Batch Configuration
- Configure multiple tests
- Automated execution
- Result comparison
- Reporting

## Conclusion

You now know how to:
- Create custom test configurations
- Configure all protocol layers
- Validate and test configurations
- Manage and share configurations
- Optimize for your specific needs

Custom configurations allow you to:
- Test specific scenarios
- Validate your implementations
- Optimize performance
- Meet compliance requirements

Continue exploring advanced configuration features and experiment with different parameter combinations.',
    'intermediate',
    60,
    ARRAY['Pro/Enterprise account', 'Protocol knowledge', 'First test case tutorial'],
    ARRAY['Create custom configurations', 'Configure protocol layers', 'Validate configurations', 'Manage configuration templates'],
    true,
    true,
    0,
    0,
    0.0,
    NOW()
),

-- Advanced Tutorial: Performance Analysis
(
    'Advanced Performance Analysis',
    'advanced-performance-analysis',
    'Master advanced performance analysis techniques using 5GLabX professional tools and metrics.',
    '# Advanced Performance Analysis

This advanced tutorial covers comprehensive performance analysis techniques using 5GLabX professional tools and metrics.

## Prerequisites

- 5GLabX Enterprise account
- Advanced understanding of 5G protocols
- Experience with performance testing
- Completed intermediate tutorials

## Step 1: Performance Test Setup

1. **Select Performance Test Cases**:
   - High throughput scenarios
   - Latency-critical applications
   - Stress testing cases
   - Mobility scenarios

2. **Configure Performance Parameters**:
   - Maximum throughput settings
   - Latency requirements
   - Error rate thresholds
   - Quality metrics

## Step 2: Real-time Monitoring

1. **Protocol Analyzer View**:
   - Message flow analysis
   - Timing measurements
   - Layer performance
   - Error detection

2. **Performance Metrics Dashboard**:
   - Throughput graphs
   - Latency histograms
   - Error rate trends
   - Quality indicators

## Step 3: Layer-by-Layer Analysis

### PHY Layer Performance
- **Throughput Analysis**:
  - Peak throughput measurement
  - Average throughput calculation
  - Throughput distribution
  - Bottleneck identification

- **Latency Analysis**:
  - End-to-end latency
  - Layer-specific latency
  - Jitter measurement
  - Latency percentiles

- **Error Analysis**:
  - BLER (Block Error Rate)
  - HARQ retransmissions
  - Error patterns
  - Recovery mechanisms

### MAC Layer Performance
- **Scheduling Analysis**:
  - Scheduling efficiency
  - Fairness metrics
  - Resource utilization
  - Queue management

- **HARQ Performance**:
  - Retransmission rates
  - Success rates
  - Timing analysis
  - Buffer management

### RLC Layer Performance
- **Reliability Analysis**:
  - Packet loss rates
  - Retransmission efficiency
  - Window utilization
  - Segmentation overhead

### PDCP Layer Performance
- **Security Performance**:
  - Encryption overhead
  - Integrity protection
  - Key management
  - Security processing time

### RRC Layer Performance
- **Control Plane Performance**:
  - Signaling overhead
  - State transitions
  - Measurement reporting
  - Handover performance

### NAS Layer Performance
- **Session Management**:
  - Session establishment time
  - Session success rates
  - Mobility performance
  - Security procedures

## Step 4: Advanced Metrics Analysis

1. **Statistical Analysis**:
   - Mean, median, standard deviation
   - Percentile analysis (P50, P90, P95, P99)
   - Distribution analysis
   - Correlation analysis

2. **Trend Analysis**:
   - Performance over time
   - Degradation patterns
   - Recovery analysis
   - Seasonal variations

3. **Comparative Analysis**:
   - Configuration comparison
   - Test case comparison
   - Historical comparison
   - Benchmark analysis

## Step 5: Performance Optimization

1. **Bottleneck Identification**:
   - Layer performance analysis
   - Resource utilization
   - Queue analysis
   - Processing time analysis

2. **Optimization Strategies**:
   - Parameter tuning
   - Configuration optimization
   - Resource allocation
   - Algorithm selection

3. **Validation**:
   - Performance improvement verification
   - Regression testing
   - Stability analysis
   - Long-term monitoring

## Step 6: Reporting and Documentation

1. **Performance Reports**:
   - Executive summary
   - Detailed analysis
   - Recommendations
   - Action items

2. **Visualization**:
   - Performance graphs
   - Trend charts
   - Comparison tables
   - Heat maps

3. **Export Options**:
   - PDF reports
   - Excel spreadsheets
   - Raw data export
   - API integration

## Advanced Techniques

### Stress Testing
- **Load Testing**:
  - Maximum capacity testing
  - Resource exhaustion
  - Failure point analysis
  - Recovery testing

- **Endurance Testing**:
  - Long-term stability
  - Memory leak detection
  - Performance degradation
  - Resource cleanup

### Mobility Testing
- **Handover Performance**:
  - Handover success rates
  - Handover latency
  - Data loss during handover
  - Handover failure analysis

- **Mobility Scenarios**:
  - High-speed scenarios
  - Urban environments
  - Rural environments
  - Edge cases

### Interference Analysis
- **Co-channel Interference**:
  - Interference impact
  - Mitigation strategies
  - Performance degradation
  - Recovery mechanisms

- **Adjacent Channel Interference**:
  - Filter performance
  - Isolation requirements
  - Performance impact
  - Optimization techniques

## Best Practices

### Test Design
- Define clear objectives
- Use realistic scenarios
- Include edge cases
- Plan for long-term testing

### Data Collection
- Collect comprehensive metrics
- Use appropriate sampling rates
- Ensure data quality
- Store historical data

### Analysis Methodology
- Use statistical methods
- Consider multiple metrics
- Account for variability
- Validate results

### Reporting
- Clear and concise
- Include context
- Provide recommendations
- Document limitations

## Troubleshooting Performance Issues

### Common Performance Problems
- **Low Throughput**:
  - Check channel conditions
  - Verify MIMO configuration
  - Analyze scheduling
  - Review interference

- **High Latency**:
  - Analyze processing delays
  - Check queue management
  - Review retransmissions
  - Optimize algorithms

- **High Error Rates**:
  - Check channel quality
  - Verify power control
  - Analyze interference
  - Review coding schemes

### Performance Debugging
- Use detailed logging
- Analyze layer interactions
- Check resource utilization
- Monitor system performance

## Conclusion

Advanced performance analysis enables you to:
- Identify performance bottlenecks
- Optimize system performance
- Validate performance requirements
- Ensure quality of service

Key skills developed:
- Comprehensive performance analysis
- Advanced metrics interpretation
- Performance optimization techniques
- Professional reporting

Continue exploring advanced features and develop expertise in performance analysis for 5G systems.',
    'advanced',
    120,
    ARRAY['Enterprise account', 'Advanced protocol knowledge', 'Performance testing experience'],
    ARRAY['Perform comprehensive performance analysis', 'Identify performance bottlenecks', 'Optimize system performance', 'Create professional reports'],
    true,
    true,
    0,
    0,
    0.0,
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Verification
DO $$
DECLARE
    doc_count INTEGER;
    tutorial_count INTEGER;
    published_doc_count INTEGER;
    published_tutorial_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO doc_count FROM public.documentation;
    SELECT COUNT(*) INTO tutorial_count FROM public.tutorials;
    SELECT COUNT(*) INTO published_doc_count FROM public.documentation WHERE is_published = true;
    SELECT COUNT(*) INTO published_tutorial_count FROM public.tutorials WHERE is_published = true;
    
    RAISE NOTICE '✅ Documentation created: %', doc_count;
    RAISE NOTICE '✅ Tutorials created: %', tutorial_count;
    RAISE NOTICE '✅ Published documentation: %', published_doc_count;
    RAISE NOTICE '✅ Published tutorials: %', published_tutorial_count;
    
    IF doc_count >= 5 AND tutorial_count >= 3 AND published_doc_count >= 5 AND published_tutorial_count >= 3 THEN
        RAISE NOTICE '🎉 Documentation and tutorials seed data created successfully!';
    ELSE
        RAISE NOTICE '❌ Some documentation/tutorial data may be missing';
    END IF;
END $$;