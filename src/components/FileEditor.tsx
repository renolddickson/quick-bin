import { languageOptions } from "../constants";
import type { DataType } from "../models";
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from "../providers/ThemeContext";

export const FileEditor = ({
  data,
  onChange
}: {
  data: DataType;
  onChange: (updated: DataType) => void;
}) => {
const { isDark } = useTheme();
  return (
    <div className="flex flex-col gap-4 min-h-[80vh]">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       focus:border-blue-500 outline-none text-sm"
            value={data.type}
            onChange={(e) =>
              onChange({ ...data, type: e.target.value as 'text' | 'code', language: undefined })
            }
          >
            <option value="text">Text File</option>
            <option value="code">Code File</option>
          </select>
          
          {data.type === 'code' && (
            <select
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                         focus:border-blue-500 outline-none text-sm"
              value={data.language || ''}
              onChange={(e) => onChange({ ...data, language: e.target.value })}
            >
              <option value="" disabled>Select Language</option>
              {languageOptions.map((lang) => (
                <option key={lang.label} value={lang.label}>
                  {lang.label.toUpperCase()}
                </option>
              ))}
            </select>
          )}
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
            language={data.language || 'javascript'}
            height="450px"
            value={data.content}
            onChange={(value) => onChange({ ...data, content: value || '' })}
            theme={isDark ? 'vs-dark' : 'vs-light'}
          />
          </div>
        ) : (
          <textarea
            className="w-full h-full m-h-[450px] p-4 resize-none text-gray-900 dark:text-gray-100 
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