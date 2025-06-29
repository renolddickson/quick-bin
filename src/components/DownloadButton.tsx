import { Download } from 'lucide-react';
import type { DataType } from '../models';
import { languageOptions } from '../constants';

const DownloadButton = ({ data }: { data: DataType }) => {
    const handleDownload = () => {
        if (!data?.content) return;
      
        const extensionMap: Record<string, string> = {
          code: languageOptions.find(lang=>lang.label == data.language)?.extension || 'txt', // fallback to txt if no language
          text: 'txt',
        };
      
        const ext = extensionMap[data.type] || 'txt';
        const filename = `${data.name || 'untitled'}.${ext}`;
        const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      
        URL.revokeObjectURL(url); // cleanup
    };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                 transition-colors font-medium text-sm"
    >
      <Download size={16} />
      <span className='max-sm:hidden'>Download</span>
    </button>
  );
};

export default DownloadButton;
