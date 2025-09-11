// GlobalSearch Component
function GlobalSearch({ onSearchResults, placeholder = "Search across all logs and data..." }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [query, setQuery] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);

    const handleSearch = React.useCallback(window.HELPERS.debounce(async (searchQuery) => {
      try {
        if (!searchQuery.trim()) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setIsSearching(true);
        
        // Simulate search suggestions
        const mockSuggestions = [
          { category: 'logs', text: `"${searchQuery}" in log messages`, count: Math.floor(Math.random() * 100) },
          { category: 'protocols', text: `"${searchQuery}" in protocol messages`, count: Math.floor(Math.random() * 50) },
          { category: 'errors', text: `"${searchQuery}" in error logs`, count: Math.floor(Math.random() * 20) },
          { category: 'users', text: `UE/IMSI containing "${searchQuery}"`, count: Math.floor(Math.random() * 10) }
        ].filter(s => s.count > 0);

        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
        setIsSearching(false);
      } catch (error) {
        console.error('GlobalSearch search error:', error);
        reportError(error);
        setIsSearching(false);
      }
    }, 300), []);

    React.useEffect(() => {
      handleSearch(query);
    }, [query, handleSearch]);

    const handleInputChange = (e) => {
      try {
        setQuery(e.target.value);
      } catch (error) {
        console.error('GlobalSearch input change error:', error);
        reportError(error);
      }
    };

    const handleSubmit = (e) => {
      try {
        e.preventDefault();
        if (!query.trim()) return;

        // Perform search
        if (onSearchResults) {
          onSearchResults({
            query: query,
            category: 'all',
            timestamp: new Date().toISOString()
          });
        }

        setShowSuggestions(false);
      } catch (error) {
        console.error('GlobalSearch submit error:', error);
        reportError(error);
      }
    };

    return React.createElement('div', {
      className: 'relative',
      'data-name': 'global-search',
      'data-file': 'components/search/GlobalSearch.js'
    }, [
      React.createElement('form', {
        key: 'search-form',
        onSubmit: handleSubmit,
        className: 'relative'
      }, [
        React.createElement('input', {
          key: 'search-input',
          type: 'text',
          value: query,
          onChange: handleInputChange,
          placeholder: placeholder,
          className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
        }),
        React.createElement('i', {
          key: 'search-icon',
          'data-lucide': isSearching ? 'loader-2' : 'search',
          className: `absolute left-3 top-2.5 w-4 h-4 text-gray-400 ${isSearching ? 'animate-spin' : ''}`
        })
      ]),
      showSuggestions && suggestions.length > 0 && React.createElement('div', {
        key: 'suggestions',
        className: 'absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50'
      }, suggestions.map((suggestion, index) => 
        React.createElement('div', {
          key: index,
          className: 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0',
          onClick: () => {
            setQuery(suggestion.text);
            handleSubmit({ preventDefault: () => {} });
          }
        }, [
          React.createElement('div', {
            key: 'text',
            className: 'text-sm text-gray-900'
          }, suggestion.text),
          React.createElement('div', {
            key: 'count',
            className: 'text-xs text-gray-500'
          }, `${suggestion.count} results`)
        ])
      ))
    ]);

  } catch (error) {
    console.error('GlobalSearch component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Search failed to load');
  }
}

// Export GlobalSearch component
window.GlobalSearch = GlobalSearch;
