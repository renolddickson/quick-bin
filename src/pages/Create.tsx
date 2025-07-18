import { useState } from "react";
import type { DataType } from "../models";
import ThemeToggle from "../components/ThemeToggler";
import ShareButton from "../components/ShareButton";
import { FileEditor } from "../components/FileEditor";
import { EditableFileName } from "../components/EditableFileName";
import { X } from "lucide-react";
import { ShareLinkDialog } from "../components/ShareLinkDialog";
import { compressTextBrotli } from "../utils";

export default function Create() {
    const [files, setFiles] = useState<DataType[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [shareLink, setShareLink] = useState('');
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareLoading, setShareLoading] = useState(false)

    const addNewFile = () => {
        if (files.length >= 5) return;
        const newFile: DataType = {
            type: 'text',
            name: `Untitled ${files.length + 1}`,
            content: ''
        };
        setFiles([...files, newFile]);
        setActiveIndex(files.length);
    };

    const updateFile = (index: number, updated: DataType) => {
        const updatedFiles = [...files];
        updatedFiles[index] = updated;
        setFiles(updatedFiles);
    };

    const updateFileName = (index: number, newName: string) => {
        const updatedFiles = [...files];
        updatedFiles[index] = { ...updatedFiles[index], name: newName };
        setFiles(updatedFiles);
    };

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        setActiveIndex((prev) => (prev >= updated.length ? updated.length - 1 : prev));
    };
    const handleShare = async () => {
        if (!files.length || !files.some(item => item.content)) return;
      
        setShareLoading(true);
      
        try {
          const json = JSON.stringify(files);
          const encoded = encodeURIComponent(compressTextBrotli(json));
      
          const targetUrl = `${import.meta.env.VITE_BASE_URL}#/${encoded}`;
          const apiUrl = `${import.meta.env.VITE_SHORT_LINK}api`;
      
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            targetUrl,
            expireDate: '1week',
            title: 'quickbin',
        }),
        });
      
          const resData = await response.json();
        console.log(resData);
        
          if (resData?.shortUrl) {
            setShareLink(resData.shortUrl);
            setIsShareDialogOpen(true);
          } else {
            console.error("Invalid response structure:", resData);
          }
      
        } catch (err) {
          console.error("Failed to generate share link:", err);
        } finally {
          setShareLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 
                      border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center overflow-x-auto">
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto whitespace-nowrap">
                        {files.map((file, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 
                           cursor-pointer transition-colors min-w-32 ${i === activeIndex
                                        ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                onClick={() => setActiveIndex(i)}
                            >
                                <div className="flex-1 min-w-0">
                                    <EditableFileName
                                        language={file.language}
                                        fileName={file.name}
                                        onNameChange={(newName) => updateFileName(i, newName)}
                                        fileType={file.type}
                                    />
                                </div>
                                <button
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(i);
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Add New File Button */}
                        {files.length < 5 && (
                            <button
                                className="px-4 py-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                           border-r border-gray-200 dark:border-gray-700 transition-colors font-medium"
                                onClick={addNewFile}
                            >
                                + New File
                            </button>
                        )}
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 px-4">
                    <ThemeToggle />
                    <ShareButton data={files} onShareClick={() => handleShare()} isLoading={shareLoading} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6">
                {files.length > 0 ? (
                    <FileEditor
                        data={files[activeIndex]}
                        onChange={(d) => updateFile(activeIndex, d)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[70vh]
                          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <div className="text-center flex items-center flex-col">
                            <div className="w-24 h-24 flex items-center justify-center mb-6">
                                <div className="text-6xl text-gray-400">📁</div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                No files open
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Create a new file to get started
                            </p>
                            <button
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                onClick={addNewFile}
                            >
                                Create New File
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ShareLinkDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                link={shareLink}
            />
        </div>
    );
}
