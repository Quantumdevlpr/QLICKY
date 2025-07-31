import { useState } from 'react';
import { useQRCode } from '../contexts/QRCodeContext';
import { QRCodeHistory } from '../types';
import { QrCode, Download, Trash2, Eye, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../libs/storageHelper';
import { useEffect } from 'react';

export default function MyQrcode() {
  const { qrHistory, getQRCodeAnalytics, deleteQRCode } = useQRCode();
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeHistory | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const downloadQRCode = (qrCode: QRCodeHistory, format: 'svg' | 'png') => {
    // Create a canvas element to generate the QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = qrCode.size;
    canvas.height = qrCode.size;

    // Fill background
    ctx.fillStyle = qrCode.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // For demo purposes, we'll create a simple QR-like pattern
    // In a real app, you'd use a QR code library here
    const blockSize = canvas.width / 25;
    ctx.fillStyle = qrCode.fgColor;
    
    // Create a simple pattern (not a real QR code, just for demo)
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
        }
      }
    }

    if (format === 'png') {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${qrCode.id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      // For SVG, we'll create a simple SVG representation
      const svgData = `<svg width="${qrCode.size}" height="${qrCode.size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${qrCode.bgColor}"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${qrCode.fgColor}" font-size="12">QR Code</text>
      </svg>`;
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${qrCode.id}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const handleDeleteQRCode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      deleteQRCode(id);
    }
  };

  if (qrHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 card animate-fade-in dark:bg-gray-900">
        <QrCode className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2 dark:text-gray-400">No QR Codes Found</h2>
        <p className="text-gray-500 text-center max-w-md mb-6 dark:text-gray-400">
          Create and save QR codes in the generator to see them here.
        </p>
        <button 
          onClick={() => navigate('/generator')} 
          className="btn btn-primary"
        >
          Create Your First QR Code
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My QR Codes</h1>
        <button 
          onClick={() => navigate('/generator')} 
          className="btn btn-primary"
        >
          Create New QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrHistory.map((qrCode) => (
          <div key={qrCode.id} className="card dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div 
                  className="h-12 w-12 flex-shrink-0 mr-3 border border-gray-200 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: qrCode.bgColor }}
                >
                  <QrCode 
                    size={24}
                    className="text-gray-800"
                    style={{ color: qrCode.fgColor }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm truncate max-w-[150px]">
                    {qrCode.value.length > 20 ? `${qrCode.value.substring(0, 20)}...` : qrCode.value}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(qrCode.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-400 break-all">
                {qrCode.value}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Size: {qrCode.size}px</span>
                <span>Pattern: {qrCode.pattern || 'squares'}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedQRCode(qrCode);
                    setShowAnalytics(true);
                  }}
                  className="flex-1 btn btn-outline btn-sm flex items-center justify-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Analytics
                </button>
                <button
                  onClick={() => copyToClipboard(qrCode.value)}
                  className="btn btn-outline btn-sm"
                  title="Copy URL"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  onClick={() => downloadQRCode(qrCode, 'png')}
                  className="btn btn-outline btn-sm"
                  title="Download PNG"
                >
                  <Download className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDeleteQRCode(qrCode.id)}
                  className="btn btn-outline btn-sm text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Modal */}
      {showAnalytics && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">QR Code Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div 
                  className="h-8 w-8 flex-shrink-0 mr-2 border border-gray-200 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: selectedQRCode.bgColor }}
                >
                  <QrCode 
                    size={16}
                    className="text-gray-800"
                    style={{ color: selectedQRCode.fgColor }}
                  />
                </div>
                <span className="text-sm font-medium">{selectedQRCode.value}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {getQRCodeAnalytics(selectedQRCode.id)?.totalScans || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Scans</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-secondary-600">
                  {getQRCodeAnalytics(selectedQRCode.id)?.deviceBreakdown?.[0]?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Top Device</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-accent-600">
                  {getQRCodeAnalytics(selectedQRCode.id)?.topLocations?.[0]?.country || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Top Location</div>
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              📊 This is demo analytics data. Real analytics would track actual QR code scans.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
