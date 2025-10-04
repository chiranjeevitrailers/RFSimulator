// test-dashboard-integration.js
const fs = require('fs');
const path = require('path');

function testDashboardIntegration() {
    console.log("🚀 Testing Dashboard Integration...");
    console.log("=".repeat(60));

    try {
        // 1. Check Dashboard File
        console.log("\n1. Checking Dashboard File...");
        const dashboardPath = path.join(process.cwd(), 'app/user-dashboard/page.tsx');
        
        if (!fs.existsSync(dashboardPath)) {
            throw new Error("Dashboard file not found");
        }
        
        const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
        console.log("   ✅ Dashboard file exists");

        // 2. Check Component Imports
        console.log("\n2. Checking Component Imports...");
        const requiredImports = [
            'NewTestManager',
            'New5GLabXPlatform', 
            'NewUEAnalysisPlatform',
            'ProfessionalAnalysisPlatform'
        ];

        let allImportsFound = true;
        for (const importName of requiredImports) {
            if (dashboardContent.includes(importName)) {
                console.log(`   ✅ ${importName} imported`);
            } else {
                console.log(`   ❌ ${importName} not imported`);
                allImportsFound = false;
            }
        }

        if (!allImportsFound) {
            throw new Error("Some required components are not imported");
        }

        // 3. Check Navigation Tabs
        console.log("\n3. Checking Navigation Tabs...");
        const requiredTabs = [
            'overview',
            'test-manager',
            'new-test-manager',
            '5glabx-platform',
            'new-5glabx',
            'ue-analysis',
            'professional-analysis',
            'settings'
        ];

        let allTabsFound = true;
        for (const tab of requiredTabs) {
            if (dashboardContent.includes(`activeTab === "${tab}"`)) {
                console.log(`   ✅ ${tab} tab found`);
            } else {
                console.log(`   ❌ ${tab} tab not found`);
                allTabsFound = false;
            }
        }

        if (!allTabsFound) {
            throw new Error("Some required tabs are missing");
        }

        // 4. Check Content Sections
        console.log("\n4. Checking Content Sections...");
        const contentSections = [
            'New Test Manager',
            'New 5GLabX Platform',
            'UE Analysis Platform',
            'Professional Analysis Platform'
        ];

        let allSectionsFound = true;
        for (const section of contentSections) {
            if (dashboardContent.includes(section)) {
                console.log(`   ✅ ${section} content section found`);
            } else {
                console.log(`   ❌ ${section} content section not found`);
                allSectionsFound = false;
            }
        }

        if (!allSectionsFound) {
            throw new Error("Some required content sections are missing");
        }

        // 5. Check Memoization
        console.log("\n5. Checking Memoization...");
        const memoizedComponents = [
            'MemoizedNew5GLabXPlatform',
            'MemoizedUEAnalysisPlatform',
            'MemoizedProfessionalAnalysisPlatform'
        ];

        let allMemoized = true;
        for (const component of memoizedComponents) {
            if (dashboardContent.includes(component)) {
                console.log(`   ✅ ${component} memoized`);
            } else {
                console.log(`   ❌ ${component} not memoized`);
                allMemoized = false;
            }
        }

        if (!allMemoized) {
            throw new Error("Some components are not properly memoized");
        }

        // 6. Check Service Loading
        console.log("\n6. Checking Service Loading...");
        const services = [
            'DataFormatAdapter',
            'DataFlowManager'
        ];

        let allServicesFound = true;
        for (const service of services) {
            if (dashboardContent.includes(service)) {
                console.log(`   ✅ ${service} loading implemented`);
            } else {
                console.log(`   ❌ ${service} loading not implemented`);
                allServicesFound = false;
            }
        }

        if (!allServicesFound) {
            throw new Error("Some required services are not loaded");
        }

        // 7. Check Overview Section
        console.log("\n7. Checking Overview Section...");
        const overviewFeatures = [
            'Platform Overview',
            'Test Manager',
            '5GLabX Platform',
            'UE Analysis',
            'Professional Analysis',
            'Platform Features'
        ];

        let allOverviewFeatures = true;
        for (const feature of overviewFeatures) {
            if (dashboardContent.includes(feature)) {
                console.log(`   ✅ ${feature} in overview`);
            } else {
                console.log(`   ❌ ${feature} not in overview`);
                allOverviewFeatures = false;
            }
        }

        if (!allOverviewFeatures) {
            throw new Error("Some overview features are missing");
        }

        // 8. Summary
        console.log("\n" + "=".repeat(60));
        console.log("🎉 DASHBOARD INTEGRATION TEST COMPLETED");
        console.log("=".repeat(60));
        
        console.log("\n✅ SUCCESS SUMMARY:");
        console.log("   - Dashboard File: ✅ Found");
        console.log("   - Component Imports: ✅ All imported");
        console.log("   - Navigation Tabs: ✅ All present");
        console.log("   - Content Sections: ✅ All implemented");
        console.log("   - Memoization: ✅ All components memoized");
        console.log("   - Service Loading: ✅ All services loaded");
        console.log("   - Overview Section: ✅ All features present");
        
        console.log("\n🚀 READY FOR TESTING:");
        console.log("   - Overview: Platform overview and features");
        console.log("   - Test Manager: Professional test management");
        console.log("   - New Test Manager: Enhanced test management");
        console.log("   - 5GLabX Platform: Original platform");
        console.log("   - New 5GLabX: Enhanced platform with professional analysis");
        console.log("   - UE Analysis: UE log analysis platform");
        console.log("   - Professional Analysis: QXDM/Keysight-compatible tools");
        console.log("   - Settings: Configuration panel");

        return true;

    } catch (error) {
        console.error("\n❌ TEST FAILED:");
        console.error(`   Error: ${error.message}`);
        return false;
    }
}

// Run the test
const success = testDashboardIntegration();
if (success) {
    console.log("\n🎯 Dashboard integration is complete and ready for testing!");
    process.exit(0);
} else {
    console.log("\n💥 Dashboard integration test failed!");
    process.exit(1);
}