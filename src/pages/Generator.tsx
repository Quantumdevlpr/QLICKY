import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../libs/storageHelper';
import QRCodeDisplay from '../components/generator/QRCodeDisplay';
import { Download, RefreshCcw, Save } from 'lucide-react';
import { useQRCode } from '../contexts/QRCodeContext';
import ColorPicker from '../components/generator/ColorPicker';
import SizeSlider from '../components/generator/SizeSlider';
import LogoUploader from '../components/generator/LogoUploader';
import PatternSelector from '../components/generator/PatternSelector';
import ErrorCorrectionSelector from '../components/generator/ErrorCorrectionSelector';

const Generator = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const { currentQR, updateQRCode, resetQRCode, saveQRCode } = useQRCode();
  const [url, setUrl] = useState(currentQR.value);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleURLSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQRCode({ value: url });
  };

  const downloadQRCode = (format: 'svg' | 'png') => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'qrcode.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = currentQR.size;
        canvas.height = currentQR.size;
        ctx?.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in dark:bg-gray-900">
      {/* QR Code Preview */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:sticky lg:top-24 self-start">
        <div className="card w-full max-w-md flex flex-col items-center p-8 dark:bg-gray-900 dark:border">
          <h2 className="text-black dark:text-white text-2xl font-bold mb-6">QR Code Preview</h2>
          <div
            ref={qrRef}
            className="p-4 rounded-lg border border-gray-200 bg-white shadow-inner"
            style={{ backgroundColor: currentQR.bgColor }}
          >
            <QRCodeDisplay
              data={currentQR.value}
              size={currentQR.size}
              fgColor={currentQR.fgColor}
              bgColor={currentQR.bgColor}
              pattern={currentQR.pattern || 'squares'}
            />
          </div>
          <div className="mt-6 w-full">
            <form onSubmit={handleURLSubmit} className="flex items-center mb-4">
              <input
                type="text"
                value={url}
                onChange={handleURLChange}
                placeholder="Enter URL to encode"
                className="input-field flex-1 dark:text-black"
              />
              <button
                type="submit"
                className="ml-2 btn btn-primary"
              >
                Update
              </button>
            </form>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <button
                onClick={() => downloadQRCode('svg')}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download SVG
              </button>
              <button
                onClick={() => downloadQRCode('png')}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button
                onClick={saveQRCode}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save QR Code
              </button>
              <button
                onClick={resetQRCode}
                className="btn btn-outline flex items-center gap-2 text-error-500 border-error-500 hover:bg-error-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="w-full lg:w-1/2">
        <div className="card w-full dark:bg-gray-900">
          <h2 className="text-2xl font-bold mb-6">Customize Your QR Code</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Foreground Color"
                  color={currentQR.fgColor}
                  onChange={(color) => updateQRCode({ fgColor: color })}
                />
                <ColorPicker
                  label="Background Color"
                  color={currentQR.bgColor}
                  onChange={(color) => updateQRCode({ bgColor: color })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Pattern & Style</h3>
              <PatternSelector
                selectedPattern={currentQR.pattern || 'squares'}
                onChange={(pattern) => updateQRCode({ pattern })}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Size</h3>
              <SizeSlider
                size={currentQR.size}
                onChange={(size) => updateQRCode({ size })}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Logo</h3>
              <LogoUploader
                imageSettings={currentQR.imageSettings}
                onChange={(imageSettings) => updateQRCode({
                  imageSettings,
                  renderAs: 'canvas' // Force canvas when logo is added
                })}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Error Correction</h3>
              <ErrorCorrectionSelector
                level={currentQR.level}
                onChange={(level) => updateQRCode({ level })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
