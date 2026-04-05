import { useState, useRef, useEffect } from "react";
import { languageOptions } from "../constants";
import type { DataType } from "../models";
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from "../providers/ThemeContext";
import { Search, ChevronDown, Check, Type } from "lucide-react";
import { Dialog } from "./Dialog";

export const FileEditor = ({
  data,
  onChange
}: {
  data: DataType;
  onChange: (updated: DataType) => void;
}) => {
const { isDark } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customExt, setCustomExt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languageOptions.filter(lang => 
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCustomExt = data.language?.startsWith('custom:');
  const customLabel = isCustomExt ? data.language?.split(':')[1] : '';

  const currentLabel = data.type === 'text' ? 'Plain Text' : (isCustomExt ? `Custom (.${customLabel})` : (data.language || 'Select Language'));

  return (
    <div className="flex flex-col gap-4 min-h-[80vh]">
      <Dialog isOpen={isCustomDialogOpen} onClose={() => setIsCustomDialogOpen(false)}>
        <div className="py-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Custom Extension</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter file extension without dot (e.g. py, js, md)</p>
            <input 
                type="text" 
                placeholder="extension" 
                value={customExt} 
                onChange={(e) => setCustomExt(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 transition-all mb-6"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && customExt) {
                        onChange({ ...data, type: 'code', language: `custom:${customExt}` });
                        setIsCustomDialogOpen(false);
                        setCustomExt('');
                    }
                }}
            />
            <div className="flex gap-2 justify-end">
                <button 
                    onClick={() => setIsCustomDialogOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button 
                    disabled={!customExt}
                    onClick={() => {
                        onChange({ ...data, type: 'code', language: `custom:${customExt}` });
                        setIsCustomDialogOpen(false);
                        setCustomExt('');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Set Extension
                </button>
            </div>
        </div>
      </Dialog>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         hover:border-blue-500 transition-colors text-sm min-w-[140px]"
            >
              <span className="flex-1 text-left capitalize">
                {currentLabel}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-800 
                            border border-gray-200 dark:border-gray-700 shadow-xl 
                            z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search languages..."
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 
                                 text-sm outline-none focus:border-blue-500 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto pt-1 pb-1">
                  {/* Plain Text Option */}
                  {(!searchQuery || 'plain text'.includes(searchQuery.toLowerCase())) && (
                    <button
                      onClick={() => {
                        onChange({ ...data, type: 'text', language: undefined });
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
                                ${data.type === 'text' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Plain Text
                      {data.type === 'text' && <Check size={14} />}
                    </button>
                  )}

                  {/* Languages */}
                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.label}
                      onClick={() => {
                        onChange({ ...data, type: 'code', language: lang.label });
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors capitalize
                                ${data.language === lang.label ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {lang.label}
                      {data.language === lang.label && <Check size={14} />}
                    </button>
                  ))}

                  {filteredLanguages.length === 0 && !('plain text'.includes(searchQuery.toLowerCase())) && (
                    <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No languages found
                    </div>
                  )}
                </div>

                <div className="p-1 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <button
                        onClick={() => {
                            setIsDropdownOpen(false);
                            setIsCustomDialogOpen(true);
                            setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                    >
                        <Type size={14} />
                        Custom Extension...
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
        {data.type === 'code' ? (
          <div className="h-full bg-gray-50 dark:bg-gray-900">
            {/* <textarea
              className="w-full h-full p-4 resize-none font-mono text-sm
                         bg-transparent text-gray-900 dark:text-gray-100
                         focus:outline-none border-none"
              value={data.content}
              onChange={(e) => onChange({ ...data, content: e.target.value })}
              placeholder={`Enter ${data.language || 'code'} here...`}
              spellCheck={false}
            /> */}
            <MonacoEditor
            language={isCustomExt ? 'plaintext' : (data.language || 'javascript')}
            height="450px"
            value={data.content}
            onChange={(value) => onChange({ ...data, content: value || '' })}
            theme={isDark ? 'vs-dark' : 'vs-light'}
          />
          </div>
        ) : (
          <textarea
            className="w-full h-full min-h-[450px] p-4 resize-none text-gray-900 dark:text-gray-100 
                       bg-transparent focus:outline-none border-none"
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            placeholder="Enter your text here..."
          />
        )}
      </div>
    </div>
  );
};