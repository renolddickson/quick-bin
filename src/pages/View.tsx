import { useState, useEffect } from 'react';
import {Eye, FileText, Code, Plus } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggler';
import { Link, useLocation } from 'react-router-dom';
import { decompressTextBrotli } from '../utils';
import { FileViewer } from '../components/FileViewer';
import { languageOptions } from '../constants';

// Types
interface DataType {
  type: 'text' | 'code';
  name: string;
  content: string;
  language?: string;
}

// Main View Component
export default function View() {
  const [data, setData] = useState<DataType[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { pathname } = useLocation();
  const slug = decodeURIComponent(pathname.slice(1));
  useEffect(() => {    
    try {
      const decoded = decompressTextBrotli(decodeURIComponent(slug));      
      const json:DataType[] = JSON.parse(decoded);
      
      setData(json);
    } catch (err) {
      console.error("Failed to parse data:", err);
      setError("Invalid or corrupted data.");
    }
  }, [slug]);

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="p-4 text-gray-500">Loading…</p>;
  }


  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Files
          </h2>
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent 
                          rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading shared files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 
                      border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center overflow-x-auto">
          {/* Shared Files Header */}
          <div className="max-sm:hidden px-4 py-3 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Eye size={18} />
              <span className="font-medium">Shared Files</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({data.length} file{data.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto whitespace-nowrap">
            {data.map((file, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 
                           cursor-pointer transition-colors min-w-32 ${
                  i === activeIndex 
                    ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveIndex(i)}
              >
                <div className="flex items-center gap-2">
                  {file.type === 'code' ? <Code size={14} /> : <FileText size={14} />}
                  <span className="text-sm font-medium truncate">
                    {/* {file.name || `${file.type === 'code' ? 'Code' : 'Text'} File ${i + 1}`} */}
                    {`${file.name || 'untitled'}.${file.type == 'text'?'txt':languageOptions.find(lang=>lang.label == file.language)?.extension || 'txt'}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-2 px-4">
          <Link to="/">
          <button title='Create New'
              className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
              flex items-center justify-center text-gray-600 dark:text-gray-300 
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
          <Plus />
        </button>
        </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <FileViewer 
          data={data[activeIndex]}
        />
      </div>
    </div>
  );
}