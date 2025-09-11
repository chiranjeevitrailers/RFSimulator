// AdvancedSearchBar Component
function AdvancedSearchBar({ onSearch, searchResults, totalLogs }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchField, setSearchField] = React.useState('all');
    const [showAdvanced, setShowAdvanced] = React.useState(false);
    const [searchFilters, setSearchFilters] = React.useState({
      imsi: '',
      messageType: '',
      ip: '',
      protocol: ''
    });

    const searchFields = [
      { value: 'all', label: 'All Fields', icon: 'search' },
      { value: 'imsi', label: 'IMSI', icon: 'user' },
      { value: 'messageType', label: 'Message Type', icon: 'mail' },
      { value: 'ip', label: 'IP Address', icon: 'globe' },
      { value: 'protocol', label: 'Protocol', icon: 'layers' },
      { value: 'message', label: 'Message Content', icon: 'message-square' }
    ];

    const handleSearch = (query, field = searchField) => {
      try {
        setSearchQuery(query);
        
        if (query.trim() === '' && !hasActiveFilters()) {
          onSearch('', 'all', {});
          return;
        }

        onSearch(query.trim(), field, searchFilters);
      } catch (error) {
        console.error('AdvancedSearchBar search error:', error);
        reportError(error);
      }
    };

    const handleAdvancedSearch = () => {
      try {
        const hasFilters = Object.values(searchFilters).some(filter => filter.trim() !== '');
        
        if (hasFilters || searchQuery.trim() !== '') {
          onSearch(searchQuery, searchField, searchFilters);
        }
      } catch (error) {
        console.error('AdvancedSearchBar advanced search error:', error);
        reportError(error);
      }
    };

    const hasActiveFilters = () => {
      return Object.values(searchFilters).some(filter => filter.trim() !== '');
    };

    const clearAllFilters = () => {
      try {
        setSearchQuery('');
        setSearchFilters({ imsi: '', messageType: '', ip: '', protocol: '' });
        setSearchField('all');
        onSearch('', 'all', {});
      } catch (error) {
        console.error('AdvancedSearchBar clear filters error:', error);
        reportError(error);
      }
    };

    const getResultsText = () => {
      if (searchResults === null) return '';
      if (searchResults === 0) return 'No results found';
      return `${searchResults} of ${totalLogs} entries`;
    };

    const isSearchActive = searchQuery.trim() !== '' || hasActiveFilters();

    return React.createElement('div', {
      className: 'border-b border-gray-300 bg-white p-3',
      'data-name': 'advanced-search-bar',
      'data-file': 'components/logs/AdvancedSearchBar.js'
    }, [
      // Main Search Bar
      React.createElement('div', {
        key: 'main-search',
        className: 'flex items-center space-x-2 mb-2'
      }, [
        React.createElement('div', {
          key: 'search-input-container',
          className: 'flex-1 relative'
        }, [
          React.createElement('div', {
            key: 'search-icon',
            className: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'
          }, React.createElement('i', {
            'data-lucide': 'search',
            className: 'w-4 h-4 text-gray-400'
          })),
          React.createElement('input', {
            key: 'search-input',
            type: 'text',
            placeholder: `Search ${searchField === 'all' ? 'all fields' : searchFields.find(f => f.value === searchField)?.label.toLowerCase()}...`,
            value: searchQuery,
            onChange: (e) => handleSearch(e.target.value),
            className: 'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
          }),
          isSearchActive && React.createElement('button', {
            key: 'clear-button',
            onClick: clearAllFilters,
            className: 'absolute inset-y-0 right-0 pr-3 flex items-center',
            title: 'Clear search'
          }, React.createElement('i', {
            'data-lucide': 'x',
            className: 'w-4 h-4 text-gray-400 hover:text-gray-600'
          }))
        ]),
        React.createElement('select', {
          key: 'field-select',
          value: searchField,
          onChange: (e) => {
            setSearchField(e.target.value);
            handleSearch(searchQuery, e.target.value);
          },
          className: 'px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500'
        }, searchFields.map(field =>
          React.createElement('option', {
            key: field.value,
            value: field.value
          }, field.label)
        )),
        React.createElement('button', {
          key: 'advanced-toggle',
          onClick: () => setShowAdvanced(!showAdvanced),
          className: `px-3 py-2 border rounded-md text-sm transition-colors ${
            showAdvanced 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`,
          title: 'Advanced search filters'
        }, [
          React.createElement('i', {
            key: 'filter-icon',
            'data-lucide': 'filter',
            className: 'w-4 h-4 mr-1'
          }),
          React.createElement('span', { key: 'label' }, 'Advanced')
        ])
      ]),

      // Advanced Filters
      showAdvanced && React.createElement('div', {
        key: 'advanced-filters',
        className: 'bg-gray-50 border border-gray-200 rounded-md p-3 space-y-3'
      }, [
        React.createElement('div', {
          key: 'filter-grid',
          className: 'grid grid-cols-2 md:grid-cols-4 gap-3'
        }, [
          React.createElement('div', { key: 'imsi-filter' }, [
            React.createElement('label', {
              key: 'label',
              className: 'block text-xs font-medium text-gray-700 mb-1'
            }, 'IMSI'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              placeholder: 'e.g., 001001...',
              value: searchFilters.imsi,
              onChange: (e) => setSearchFilters({...searchFilters, imsi: e.target.value}),
              className: 'w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500'
            })
          ]),
          React.createElement('div', { key: 'message-type-filter' }, [
            React.createElement('label', {
              key: 'label',
              className: 'block text-xs font-medium text-gray-700 mb-1'
            }, 'Message Type'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              placeholder: 'e.g., INVITE, REGISTER',
              value: searchFilters.messageType,
              onChange: (e) => setSearchFilters({...searchFilters, messageType: e.target.value}),
              className: 'w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500'
            })
          ]),
          React.createElement('div', { key: 'ip-filter' }, [
            React.createElement('label', {
              key: 'label',
              className: 'block text-xs font-medium text-gray-700 mb-1'
            }, 'IP Address'),
            React.createElement('input', {
              key: 'input',
              type: 'text',
              placeholder: 'e.g., 192.168.1.1',
              value: searchFilters.ip,
              onChange: (e) => setSearchFilters({...searchFilters, ip: e.target.value}),
              className: 'w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500'
            })
          ]),
          React.createElement('div', { key: 'protocol-filter' }, [
            React.createElement('label', {
              key: 'label',
              className: 'block text-xs font-medium text-gray-700 mb-1'
            }, 'Protocol'),
            React.createElement('select', {
              key: 'select',
              value: searchFilters.protocol,
              onChange: (e) => setSearchFilters({...searchFilters, protocol: e.target.value}),
              className: 'w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500'
            }, [
              React.createElement('option', { key: 'all', value: '' }, 'All Protocols'),
              React.createElement('option', { key: 'rrc', value: 'RRC' }, 'RRC'),
              React.createElement('option', { key: 'nas', value: 'NAS' }, 'NAS'),
              React.createElement('option', { key: 'sip', value: 'SIP' }, 'SIP'),
              React.createElement('option', { key: 'gtp', value: 'GTP' }, 'GTP'),
              React.createElement('option', { key: 'mac', value: 'MAC' }, 'MAC'),
              React.createElement('option', { key: 'phy', value: 'PHY' }, 'PHY')
            ])
          ])
        ]),
        React.createElement('div', {
          key: 'filter-actions',
          className: 'flex justify-between items-center pt-2 border-t border-gray-200'
        }, [
          React.createElement('button', {
            key: 'apply',
            onClick: handleAdvancedSearch,
            className: 'px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'search',
              className: 'w-3 h-3 mr-1'
            }),
            React.createElement('span', { key: 'text' }, 'Apply Filters')
          ]),
          React.createElement('button', {
            key: 'clear',
            onClick: clearAllFilters,
            className: 'px-4 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'x',
              className: 'w-3 h-3 mr-1'
            }),
            React.createElement('span', { key: 'text' }, 'Clear All')
          ])
        ])
      ]),

      // Search Results Info
      isSearchActive && React.createElement('div', {
        key: 'results-info',
        className: 'flex items-center justify-between mt-2 text-xs text-gray-600'
      }, [
        React.createElement('span', {
          key: 'results',
          className: 'flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'info',
            className: 'w-3 h-3 mr-1 text-blue-500'
          }),
          React.createElement('span', { key: 'text' }, getResultsText())
        ]),
        hasActiveFilters() && React.createElement('span', {
          key: 'filters-active',
          className: 'flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'filter',
            className: 'w-3 h-3 mr-1 text-orange-500'
          }),
          React.createElement('span', { key: 'text' }, 'Advanced filters active')
        ])
      ])
    ]);

  } catch (error) {
    console.error('AdvancedSearchBar component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'AdvancedSearchBar Error');
  }
}

// Export AdvancedSearchBar component
window.AdvancedSearchBar = AdvancedSearchBar;
