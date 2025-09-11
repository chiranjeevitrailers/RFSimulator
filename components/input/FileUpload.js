// FileUpload Component
function FileUpload({ onFileProcessed, isProcessing = false }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [dragActive, setDragActive] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const fileInputRef = React.useRef(null);

    const handleDrag = (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
          setDragActive(true);
        } else if (e.type === 'dragleave') {
          setDragActive(false);
        }
      } catch (error) {
        console.error('FileUpload drag error:', error);
        reportError(error);
      }
    };

    const handleDrop = (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      } catch (error) {
        console.error('FileUpload drop error:', error);
        reportError(error);
      }
    };

    const handleFileInput = (e) => {
      try {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      } catch (error) {
        console.error('FileUpload input error:', error);
        reportError(error);
      }
    };

    const handleFile = async (file) => {
      try {
        if (!onFileProcessed) return;
        
        const fileService = new FileService();
        const result = await fileService.processLogFile(file, setProgress);
        onFileProcessed(result);
        setProgress(0);
      } catch (error) {
        console.error('FileUpload process error:', error);
        reportError(error);
        setProgress(0);
      }
    };

    const openFileDialog = () => {
      try {
        fileInputRef.current?.click();
      } catch (error) {
        console.error('FileUpload open dialog error:', error);
        reportError(error);
      }
    };

    return React.createElement('div', {
      className: 'w-full',
      'data-name': 'file-upload',
      'data-file': 'components/input/FileUpload.js'
    }, [
      React.createElement('div', {
        key: 'upload-area',
        className: `relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`,
        onDragEnter: handleDrag,
        onDragLeave: handleDrag,
        onDragOver: handleDrag,
        onDrop: handleDrop
      }, [
        React.createElement('input', {
          key: 'file-input',
          ref: fileInputRef,
          type: 'file',
          className: 'hidden',
          accept: '.log,.txt,.pcap',
          onChange: handleFileInput
        }),
        React.createElement('div', {
          key: 'upload-content',
          className: 'text-center'
        }, [
          React.createElement('i', {
            key: 'upload-icon',
            'data-lucide': 'upload-cloud',
            className: 'w-12 h-12 mx-auto text-gray-400 mb-4'
          }),
          React.createElement('p', {
            key: 'upload-text',
            className: 'text-lg font-medium text-gray-900 mb-2'
          }, 'Drop CLI log files here'),
          React.createElement('p', {
            key: 'upload-subtext',
            className: 'text-sm text-gray-600 mb-4'
          }, 'or click to browse files'),
          React.createElement('button', {
            key: 'upload-button',
            className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
            onClick: openFileDialog,
            disabled: isProcessing
          }, 'Select Files'),
          React.createElement('p', {
            key: 'file-types',
            className: 'text-xs text-gray-500 mt-2'
          }, 'Supports: .log, .txt, .pcap (Max 100MB)')
        ])
      ]),
      progress > 0 && React.createElement('div', {
        key: 'progress-bar',
        className: 'mt-4'
      }, [
        React.createElement('div', {
          key: 'progress-label',
          className: 'flex justify-between text-sm text-gray-600 mb-1'
        }, [
          React.createElement('span', { key: 'label' }, 'Processing...'),
          React.createElement('span', { key: 'percent' }, `${progress}%`)
        ]),
        React.createElement('div', {
          key: 'progress-bg',
          className: 'w-full bg-gray-200 rounded-full h-2'
        }, React.createElement('div', {
          className: 'bg-blue-600 h-2 rounded-full transition-all',
          style: { width: `${progress}%` }
        }))
      ])
    ]);

  } catch (error) {
    console.error('FileUpload component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'File upload failed to load');
  }
}

// Export FileUpload component
window.FileUpload = FileUpload;
