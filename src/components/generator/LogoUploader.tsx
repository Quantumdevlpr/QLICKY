import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageSettings } from '../../types';

interface LogoUploaderProps {
  imageSettings: ImageSettings | null;
  onChange: (imageSettings: ImageSettings | null) => void;
}

const LogoUploader = ({ imageSettings, onChange }: LogoUploaderProps) => {
  const [logoSize, setLogoSize] = useState<number>(imageSettings?.width || 50);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newImageSettings: ImageSettings = {
          src: event.target.result as string,
          height: logoSize,
          width: logoSize,
          excavate: true,
        };
        onChange(newImageSettings);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(e.target.value);
    setLogoSize(newSize);
    
    if (imageSettings) {
      onChange({
        ...imageSettings,
        height: newSize,
        width: newSize,
      });
    }
  };

  const removeLogo = () => {
    onChange(null);
  };

  return (
    <div>
      {imageSettings ? (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Logo Preview</span>
            <button
              type="button"
              onClick={removeLogo}
              className="text-sm text-error-500 hover:text-error-600 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white border border-gray-200 rounded-md p-2 w-16 h-16 flex items-center justify-center">
              <img 
                src={imageSettings.src} 
                alt="Logo" 
                className="max-w-full max-h-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Size</label>
              <input
                type="range"
                min="10"
                max="40"
                value={logoSize}
                onChange={handleSizeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
            Upload Logo (Optional)
          </label>
          <div onClick={handleDivClick} className="border-2 border-dashed border-gray-300 cursor-pointer rounded-md p-6 flex flex-col items-center justify-center hover:border-primary-500 transition-colors duration-200">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2 ">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 1MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;