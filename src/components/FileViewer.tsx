import { Code, FileText } from "lucide-react";
import type { DataType } from "../models";
import CopyButton from "./CopyButton";
import MonacoEditor from '@monaco-editor/react';
import DownloadButton from "./DownloadButton";
import { useTheme } from "../providers/ThemeContext";

export const FileViewer = ({
    data
  }: {
    data: DataType;
  }) => {
    const {isDark} = useTheme()
    return (
      <div className="flex flex-col gap-4  min-h-[80vh]">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 
                            text-gray-700 dark:text-gray-300">
              {data.type === 'code' ? <Code size={16} /> : <FileText size={16} />}
              <span className="font-medium">
                {data.type === 'code' ? 'Code File' : 'Text File'}
              </span>
            </div>
            
            {data.type === 'code' && data.language && (
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <span className="font-medium">{data.language.toUpperCase()}</span>
              </div>
            )}
            
            {/* <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Eye size={16} />
              <span>Read-only</span>
            </div> */}
          </div>
          <div className="flex gap-1">
          <DownloadButton data={data} />
          <CopyButton text={data.content} />
          </div>
        </div>
  
        {/* Viewer Area */}
        <div className="h-full flex-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {data.type === 'code' ? (
            <div className="h-full bg-gray-50 dark:bg-gray-900">
              {/* <pre className="w-full h-full p-4 overflow-auto font-mono text-sm
                             text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {data.content || `// Empty ${data.language || 'code'} file`}
              </pre> */}
           <MonacoEditor
            language={data.language || 'javascript'}
            height="450px"
            value={data.content}
            options={{readOnly: true, minimap: { enabled: false }}}
            theme={isDark? 'vs-dark' : 'vs-light'}
          />
            </div>
          ) : (
            <div className="w-full h-full p-4 overflow-auto text-gray-900 dark:text-gray-100 
                            whitespace-pre-wrap">
              {data.content || 'No content to show'}
            </div>
          )}
        </div>
      </div>
    );
  };