// Sidebar Component - Enhanced with collapsible technology sections
function Sidebar({ appState, onNavigate }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const { currentView, sidebarCollapsed } = appState;
    
    // State for collapsible sections
    const [collapsedSections, setCollapsedSections] = React.useState({
      'oran': false,
      'nbiot': false,
      'v2x': false,
      'ntn': false
    });

    const handleMenuClick = (viewId) => {
      try {
        if (onNavigate) {
          onNavigate(viewId);
        }
      } catch (error) {
        console.error('Sidebar menu click error:', error);
        reportError(error);
      }
    };

    const toggleSection = (sectionId) => {
      try {
        setCollapsedSections(prev => ({
          ...prev,
          [sectionId]: !prev[sectionId]
        }));
      } catch (error) {
        console.error('Toggle section error:', error);
        reportError(error);
      }
    };

    const renderMenuItem = (item) => {
      try {
        const isActive = currentView === item.id;
        
        return React.createElement('button', {
          key: item.id,
          className: `w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
            isActive 
              ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500' 
              : 'text-gray-700 hover:bg-gray-100'
          }`,
          onClick: () => handleMenuClick(item.id)
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': item.icon,
            className: 'w-5 h-5'
          }),
          !sidebarCollapsed && React.createElement('span', {
            key: 'label',
            className: 'text-sm font-medium'
          }, item.label),
          !sidebarCollapsed && item.badge && React.createElement('span', {
            key: 'badge',
            className: item.badge === 'LIVE' ? 'badge-live' : 'badge-new'
          }, item.badge)
        ]);
      } catch (error) {
        console.error('Sidebar render menu item error:', error);
        return null;
      }
    };

    const renderCollapsibleSection = (title, sectionId, items, icon) => {
      try {
        const isCollapsed = collapsedSections[sectionId];
        
        return React.createElement('div', {
          key: sectionId,
          className: 'mb-6'
        }, [
          !sidebarCollapsed && React.createElement('button', {
            key: 'section-header',
            onClick: () => toggleSection(sectionId),
            className: 'w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 hover:text-gray-700 transition-colors'
          }, [
            React.createElement('div', {
              key: 'title-with-icon',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('i', {
                key: 'section-icon',
                'data-lucide': icon,
                className: 'w-4 h-4'
              }),
              React.createElement('span', {
                key: 'title'
              }, title)
            ]),
            React.createElement('i', {
              key: 'chevron',
              'data-lucide': isCollapsed ? 'chevron-right' : 'chevron-down',
              className: 'w-4 h-4 transition-transform'
            })
          ]),
          
          sidebarCollapsed && React.createElement('div', {
            key: 'collapsed-indicator',
            className: 'px-3 mb-2'
          }, [
            React.createElement('i', {
              key: 'section-icon-collapsed',
              'data-lucide': icon,
              className: 'w-5 h-5 text-gray-500'
            })
          ]),
          
          (!sidebarCollapsed && !isCollapsed) && React.createElement('div', {
            key: 'section-items',
            className: 'space-y-1'
          }, items.map(renderMenuItem)),
          
          sidebarCollapsed && React.createElement('div', {
            key: 'section-items-collapsed',
            className: 'space-y-1'
          }, items.map(renderMenuItem))
        ]);
      } catch (error) {
        console.error('Sidebar render collapsible section error:', error);
        return null;
      }
    };

    const renderMenuSection = (title, items) => {
      try {
        return React.createElement('div', {
          key: title,
          className: 'mb-6'
        }, [
          !sidebarCollapsed && React.createElement('h3', {
            key: 'section-title',
            className: 'text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3'
          }, title),
          React.createElement('div', {
            key: 'section-items',
            className: 'space-y-1'
          }, items.map(renderMenuItem))
        ]);
      } catch (error) {
        console.error('Sidebar render menu section error:', error);
        return null;
      }
    };

    // Menu configuration - Updated with generic names and no NEW badges
    const mainViews = [
      { id: 'user-dashboard', label: 'User Dashboard', icon: 'layout-dashboard', badge: null },
      { id: 'dashboard', label: 'Dashboard', icon: 'gauge', badge: null },
      { id: 'logs', label: 'Logs Viewer', icon: 'file-text', badge: null },
      { id: 'enhanced-logs', label: 'Enhanced Logs', icon: 'search', badge: null },
      { id: 'layer-trace', label: 'Layer Trace', icon: 'git-branch', badge: null },
      { id: 'callflow', label: 'Call Flow', icon: 'phone-call', badge: null },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3', badge: 'LIVE' }
    ];

    const oranViews = [
      { id: 'oran-overview', label: 'O-RAN Overview', icon: 'network', badge: null },
      { id: 'oran-interfaces', label: 'Interfaces', icon: 'link', badge: null },
      { id: 'oran-cu-analysis', label: 'CU Analysis', icon: 'cpu', badge: null },
      { id: 'oran-du-analysis', label: 'DU Analysis', icon: 'hard-drive', badge: null },
      { id: 'oran-e1-interface', label: 'E1 Interface', icon: 'arrow-right-left', badge: null },
      { id: 'oran-f1-interface', label: 'F1 Interface', icon: 'arrow-up-down', badge: null },
      { id: 'oran-performance', label: 'Performance', icon: 'gauge', badge: 'LIVE' },
      { id: 'oran-xapps', label: 'xApps', icon: 'app-window', badge: null },
      { id: 'oran-smo', label: 'SMO Analysis', icon: 'settings-2', badge: null }
    ];

    const nbiotViews = [
      { id: 'nbiot-overview', label: 'NB-IoT Overview', icon: 'satellite', badge: null },
      { id: 'nbiot-callflow', label: 'NB-IoT Call Flow', icon: 'workflow', badge: null },
      { id: 'nbiot-analytics', label: 'NB-IoT Analytics', icon: 'pie-chart', badge: 'LIVE' },
      { id: 'nbiot-phy-layer', label: 'NB-IoT PHY', icon: 'radio', badge: null },
      { id: 'nbiot-mac-layer', label: 'NB-IoT MAC', icon: 'layers-3', badge: null },
      { id: 'nbiot-rrc-layer', label: 'NB-IoT RRC', icon: 'settings', badge: null },
      { id: 'nbiot-testing', label: 'NB-IoT Testing', icon: 'test-tube', badge: null }
    ];

    const v2xViews = [
      { id: 'v2x-overview', label: 'V2X Overview', icon: 'car', badge: null },
      { id: 'v2x-sidelink', label: 'PC5 Sidelink', icon: 'radio', badge: null },
      { id: 'v2x-analytics', label: 'V2X Analytics', icon: 'activity', badge: 'LIVE' },
      { id: 'v2x-phy-layer', label: 'V2X PHY', icon: 'zap', badge: null },
      { id: 'v2x-mac-layer', label: 'V2X MAC', icon: 'layers', badge: null },
      { id: 'v2x-testing', label: 'V2X Testing', icon: 'test-tube', badge: null },
      { id: 'v2x-scenarios', label: 'Test Scenarios', icon: 'map', badge: null }
    ];

    const ntnViews = [
      { id: 'ntn-overview', label: 'NTN Overview', icon: 'globe', badge: null },
      { id: 'ntn-satellites', label: 'Satellite Links', icon: 'satellite', badge: null },
      { id: 'ntn-analytics', label: 'NTN Analytics', icon: 'trending-up', badge: 'LIVE' },
      { id: 'ntn-sib19', label: 'SIB19 Analysis', icon: 'broadcast', badge: null },
      { id: 'ntn-timing', label: 'Timing & Delay', icon: 'clock', badge: null },
      { id: 'ntn-doppler', label: 'Doppler Analysis', icon: 'wave', badge: null },
      { id: 'ntn-scenarios', label: 'NTN Scenarios', icon: 'orbit', badge: null }
    ];

    const protocolLayers = [
      { id: 'phy-layer', label: 'PHY Layer', icon: 'radio', badge: null },
      { id: 'mac-layer', label: 'MAC Layer', icon: 'layers', badge: null },
      { id: 'rlc-layer', label: 'RLC Layer', icon: 'shuffle', badge: null },
      { id: 'pdcp-layer', label: 'PDCP Layer', icon: 'shield', badge: null },
      { id: 'rrc-layer', label: 'RRC Layer', icon: 'settings', badge: null },
      { id: 'nas-layer', label: 'NAS Layer', icon: 'network', badge: null },
      { id: 'ims-layer', label: 'IMS Analysis', icon: 'phone', badge: null }
    ];

    // Get layer stats without hooks to avoid errors
    const layerStats = window.StateService ? StateService.getLayerStats() : {};

    const coreNetwork = [
      { id: 'amf-analyzer', label: 'AMF Analyzer', icon: 'database', badge: null },
      { id: 'smf-analyzer', label: 'SMF Analyzer', icon: 'server', badge: null },
      { id: 'upf-analyzer', label: 'UPF Analyzer', icon: 'globe', badge: null },
      { id: 'ausf-analyzer', label: 'AUSF Analyzer', icon: 'shield-check', badge: null },
      { id: 'udm-analyzer', label: 'UDM Analyzer', icon: 'user-circle', badge: null },
      { id: 'config-manager', label: 'Config Manager', icon: 'settings', badge: null }
    ];

    const legacyNetwork = [
      { id: 'mme-analyzer', label: 'MME Analyzer', icon: 'database', badge: null },
      { id: 'sgw-analyzer', label: 'SGW Analyzer', icon: 'server', badge: null },
      { id: 'pgw-analyzer', label: 'PGW Analyzer', icon: 'globe', badge: null }
    ];

    const utilities = [
      { id: 'report-generator', label: 'Report Generator', icon: 'file-bar-chart', badge: null },
      { id: 'export-manager', label: 'Export Manager', icon: 'download', badge: null },
      { id: 'help-support', label: 'Help & Support', icon: 'help-circle', badge: null }
    ];

    return React.createElement('aside', {
      className: `${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 h-full overflow-y-auto sidebar-transition`,
      'data-name': 'sidebar',
      'data-file': 'components/layout/Sidebar.js'
    }, [
      React.createElement('div', {
        key: 'sidebar-content',
        className: 'p-4'
      }, [
        renderMenuSection('Main Views', mainViews),
        renderCollapsibleSection('O-RAN Analysis', 'oran', oranViews, 'network'),
        renderCollapsibleSection('NB-IoT Analysis', 'nbiot', nbiotViews, 'satellite'),
        renderCollapsibleSection('C-V2X Analysis', 'v2x', v2xViews, 'car'),
        renderCollapsibleSection('NTN Analysis', 'ntn', ntnViews, 'globe'),
        renderMenuSection('Protocol Layers', protocolLayers),
        renderMenuSection('Core Network', coreNetwork),
        renderMenuSection('4G Legacy', legacyNetwork),
        renderMenuSection('Utilities', utilities)
      ])
    ]);

  } catch (error) {
    console.error('Sidebar component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'w-64 bg-red-50 p-4 text-red-800'
    }, 'Sidebar failed to load');
  }
}

window.Sidebar = Sidebar;
