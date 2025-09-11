// MessageDecoder - Advanced protocol message decoding
function MessageDecoder({ message, onClose }) {
  try {
    const [decodedData, setDecodedData] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('overview');

    React.useEffect(() => {
      if (message) {
        decodeMessage(message);
      }
    }, [message]);

    const decodeMessage = (msg) => {
      // Enhanced decoding based on message type
      const decoded = {
        overview: {
          messageType: msg.messageType,
          layer: msg.layer,
          channel: msg.channel,
          timestamp: msg.timestamp,
          size: msg.rawData ? msg.rawData.split(' ').length : 0
        },
        hexDump: formatHexDump(msg.rawData),
        ies: msg.ies || {},
        structure: generateMessageStructure(msg)
      };
      setDecodedData(decoded);
    };

    const formatHexDump = (hexString) => {
      if (!hexString) return '';
      const bytes = hexString.split(' ');
      let result = '';
      for (let i = 0; i < bytes.length; i += 16) {
        const chunk = bytes.slice(i, i + 16);
        const hex = chunk.join(' ').padEnd(47, ' ');
        const ascii = chunk.map(b => {
          const code = parseInt(b, 16);
          return (code >= 32 && code <= 126) ? String.fromCharCode(code) : '.';
        }).join('');
        result += `${i.toString(16).padStart(4, '0')}: ${hex} |${ascii}|\n`;
      }
      return result;
    };

    const generateMessageStructure = (msg) => {
      const structures = {
        'MIB': {
          'SFN (8 bits)': 'System Frame Number',
          'Bandwidth (3 bits)': 'Channel bandwidth',
          'PHICH Config (3 bits)': 'PHICH configuration'
        },
        'RRCSetup': {
          'Message Type (4 bits)': 'RRC message identifier',
          'Transaction ID (4 bits)': 'RRC transaction identifier',
          'Radio Bearer Config': 'SRB/DRB configuration'
        }
      };
      return structures[msg.messageType] || {};
    };

    if (!message) return null;

    return React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'data-name': 'message-decoder',
      'data-file': 'components/logs/MessageDecoder.js'
    }, React.createElement('div', {
      className: 'bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden'
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        className: 'flex justify-between items-center p-6 border-b'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-xl font-semibold'
        }, `Message Decoder - ${message.messageType}`),
        React.createElement('button', {
          key: 'close',
          onClick: onClose,
          className: 'text-gray-500 hover:text-gray-700'
        }, React.createElement('div', { className: 'icon-x text-xl' }))
      ]),

      // Tabs
      React.createElement('div', {
        key: 'tabs',
        className: 'flex border-b'
      }, ['overview', 'hexdump', 'ies', 'structure'].map(tab =>
        React.createElement('button', {
          key: tab,
          onClick: () => setActiveTab(tab),
          className: `px-6 py-3 text-sm font-medium ${
            activeTab === tab 
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`
        }, tab.charAt(0).toUpperCase() + tab.slice(1))
      )),

      // Content
      React.createElement('div', {
        key: 'content',
        className: 'p-6 overflow-y-auto max-h-[70vh]'
      }, [
        activeTab === 'overview' && decodedData && React.createElement('div', {
          key: 'overview',
          className: 'grid grid-cols-2 gap-4'
        }, Object.entries(decodedData.overview).map(([key, value]) =>
          React.createElement('div', {
            key: key,
            className: 'bg-gray-50 p-3 rounded'
          }, [
            React.createElement('div', { className: 'text-sm font-medium text-gray-500' }, key),
            React.createElement('div', { className: 'mt-1 text-lg' }, value)
          ])
        )),

        activeTab === 'hexdump' && React.createElement('pre', {
          key: 'hexdump',
          className: 'font-mono text-sm bg-gray-100 p-4 rounded overflow-x-auto'
        }, decodedData?.hexDump),

        activeTab === 'ies' && React.createElement('div', {
          key: 'ies',
          className: 'space-y-3'
        }, Object.entries(decodedData?.ies || {}).map(([key, value]) =>
          React.createElement('div', {
            key: key,
            className: 'border rounded p-3'
          }, [
            React.createElement('div', { className: 'font-medium text-blue-600' }, key),
            React.createElement('div', { className: 'text-gray-700 mt-1' }, JSON.stringify(value))
          ])
        )),

        activeTab === 'structure' && React.createElement('div', {
          key: 'structure',
          className: 'space-y-3'
        }, Object.entries(decodedData?.structure || {}).map(([field, desc]) =>
          React.createElement('div', {
            key: field,
            className: 'border-l-4 border-green-500 pl-4 py-2'
          }, [
            React.createElement('div', { className: 'font-medium' }, field),
            React.createElement('div', { className: 'text-sm text-gray-600' }, desc)
          ])
        ))
      ])
    ]));

  } catch (error) {
    console.error('MessageDecoder error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Decoder failed');
  }
}

window.MessageDecoder = MessageDecoder;