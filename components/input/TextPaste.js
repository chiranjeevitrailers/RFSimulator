// TextPaste Component
function TextPaste({ onTextProcessed, isProcessing = false }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [text, setText] = React.useState('');
    const [source, setSource] = React.useState('auto');

    const handleTextChange = (e) => {
      try {
        setText(e.target.value);
      } catch (error) {
        console.error('TextPaste text change error:', error);
        reportError(error);
      }
    };

    const handleSourceChange = (e) => {
      try {
        setSource(e.target.value);
      } catch (error) {
        console.error('TextPaste source change error:', error);
        reportError(error);
      }
    };

    const handleProcess = async () => {
      try {
        if (!text.trim() || !onTextProcessed) return;
        
        const logProcessor = new LogProcessor();
        const lines = text.split('\n');
        const logEntries = [];
        
        for (const line of lines) {
          if (line.trim()) {
            const detectedSource = source === 'auto' ? null : source;
            const logEntry = await logProcessor.processLogLine(line, detectedSource);
            if (logEntry) {
              logEntries.push(logEntry);
            }
          }
        }
        
        const result = {
          source: 'text-paste',
          totalLines: lines.length,
          logEntries: logEntries,
          processedAt: new Date().toISOString()
        };
        
        onTextProcessed(result);
        setText('');
      } catch (error) {
        console.error('TextPaste process error:', error);
        reportError(error);
      }
    };

    const handleClear = () => {
      try {
        setText('');
      } catch (error) {
        console.error('TextPaste clear error:', error);
        reportError(error);
      }
    };

    return React.createElement('div', {
      className: 'w-full space-y-4',
      'data-name': 'text-paste',
      'data-file': 'components/input/TextPaste.js'
    }, [
      React.createElement('div', {
        key: 'controls',
        className: 'flex items-center space-x-4'
      }, [
        React.createElement('label', {
          key: 'source-label',
          className: 'text-sm font-medium text-gray-700'
        }, 'CLI Source:'),
        React.createElement('select', {
          key: 'source-select',
          value: source,
          onChange: handleSourceChange,
          className: 'border border-gray-300 rounded-md px-3 py-1 text-sm'
        }, [
          React.createElement('option', { key: 'auto', value: 'auto' }, 'Auto Detect'),
          React.createElement('option', { key: 'srsran', value: 'srsran' }, 'srsRAN'),
          React.createElement('option', { key: 'open5gs', value: 'open5gs' }, 'Open5GS'),
          React.createElement('option', { key: 'kamailio', value: 'kamailio' }, 'Kamailio')
        ])
      ]),
      React.createElement('textarea', {
        key: 'text-area',
        value: text,
        onChange: handleTextChange,
        placeholder: 'Paste CLI log content here...\n\nExample:\n2024-01-15T10:30:45.123456 [INFO ] [PHY    ] Cell search found 1 cells\n01/15 10:30:45.123 INFO [amf-ngap] NGAP message received\nJan 15 10:30:45 kamailio[1234]: INFO: core INVITE received',
        className: 'w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        disabled: isProcessing
      }),
      React.createElement('div', {
        key: 'actions',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('div', {
          key: 'info',
          className: 'text-sm text-gray-600'
        }, text.trim() ? `${text.split('\n').length} lines` : 'No content'),
        React.createElement('div', {
          key: 'buttons',
          className: 'space-x-2'
        }, [
          React.createElement('button', {
            key: 'clear-button',
            onClick: handleClear,
            className: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50',
            disabled: isProcessing || !text.trim()
          }, 'Clear'),
          React.createElement('button', {
            key: 'process-button',
            onClick: handleProcess,
            className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50',
            disabled: isProcessing || !text.trim()
          }, isProcessing ? 'Processing...' : 'Process Logs')
        ])
      ])
    ]);

  } catch (error) {
    console.error('TextPaste component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Text paste failed to load');
  }
}

// Export TextPaste component
window.TextPaste = TextPaste;
