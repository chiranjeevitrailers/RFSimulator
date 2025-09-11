// HelpSupportView Component - Help and support documentation
function HelpSupportView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const helpSections = [
      {
        title: 'Getting Started',
        icon: 'play-circle',
        items: [
          'Quick Start Guide',
          'System Requirements',
          'Installation Guide',
          'First Time Setup'
        ]
      },
      {
        title: 'Log Analysis',
        icon: 'file-text',
        items: [
          'Uploading Log Files',
          'Real-time Monitoring',
          'Filter Configuration',
          'Protocol Analysis'
        ]
      },
      {
        title: 'Network Analysis',
        icon: 'network',
        items: [
          'O-RAN Integration',
          'NB-IoT Analysis',
          'V2X Communication',
          'NTN Satellite Links'
        ]
      },
      {
        title: 'Troubleshooting',
        icon: 'wrench',
        items: [
          'Common Issues',
          'Error Messages',
          'Performance Optimization',
          'Debug Mode'
        ]
      }
    ];

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'help-support-view',
      'data-file': 'components/views/HelpSupportView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'text-center'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-3xl font-bold text-gray-900 mb-2'
        }, 'Help & Support'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'text-gray-600'
        }, 'Find documentation, guides, and support resources')
      ]),

      React.createElement('div', {
        key: 'help-sections',
        className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
      }, helpSections.map((section, index) =>
        React.createElement('div', {
          key: index,
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('div', {
            key: 'section-header',
            className: 'flex items-center space-x-3 mb-4'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': section.icon,
              className: 'w-6 h-6 text-blue-600'
            }),
            React.createElement('h2', {
              key: 'title',
              className: 'text-lg font-semibold text-gray-900'
            }, section.title)
          ]),
          React.createElement('ul', {
            key: 'items',
            className: 'space-y-2'
          }, section.items.map((item, itemIndex) =>
            React.createElement('li', {
              key: itemIndex,
              className: 'text-blue-600 hover:text-blue-800 cursor-pointer text-sm'
            }, item)
          ))
        ])
      )),

      React.createElement('div', {
        key: 'contact-info',
        className: 'bg-blue-50 p-6 rounded-lg border border-blue-200'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Contact Information'),
        React.createElement('div', {
          key: 'info',
          className: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'
        }, [
          React.createElement('div', {
            key: 'support'
          }, [
            React.createElement('strong', { key: 'label' }, 'Technical Support: '),
            React.createElement('span', { key: 'value' }, 'support@5glabx.com')
          ]),
          React.createElement('div', {
            key: 'docs'
          }, [
            React.createElement('strong', { key: 'label' }, 'Documentation: '),
            React.createElement('span', { key: 'value' }, 'docs.5glabx.com')
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('HelpSupportView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Help & Support Error');
  }
}

window.HelpSupportView = HelpSupportView;
