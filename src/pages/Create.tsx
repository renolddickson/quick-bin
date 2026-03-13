import { useState, useEffect } from "react";
import type { DataType } from "../models";
import ThemeToggle from "../components/ThemeToggler";
import ShareButton from "../components/ShareButton";
import { FileEditor } from "../components/FileEditor";
import { EditableFileName } from "../components/EditableFileName";
import { X, LayoutDashboard, LogIn, User, LogOut, ChevronDown } from "lucide-react";
import { Dialog } from "../components/Dialog";
import { ShareLinkDialog } from "../components/ShareLinkDialog";
import { NewFeatureDialog } from "../components/NewFeatureDialog";
import { compressTextBrotli } from "../utils";
import { loginWithSluggy, getAuthToken, removeAuthToken } from "../utils/auth";

export default function Create() {
    const [files, setFiles] = useState<DataType[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [shareLink, setShareLink] = useState('');
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [shareLoading, setShareLoading] = useState(false)
    const [isNewFeatureDialogOpen, setIsNewFeatureDialogOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
    const [linkTitle, setLinkTitle] = useState('');
    const [askForTitle, setAskForTitle] = useState(() => {
        const saved = localStorage.getItem('askForTitle');
        return saved !== 'false';
    });

    useEffect(() => {
        const hasSeenFeature = localStorage.getItem('hasSeenAuthFeatureV2');
        if (!hasSeenFeature) {
            setIsNewFeatureDialogOpen(true);
        }
    }, []);

    const closeNewFeatureDialog = () => {
        setIsNewFeatureDialogOpen(false);
        localStorage.setItem('hasSeenAuthFeatureV2', 'true');
    };

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
    const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());

    const handleLogin = async () => {
        try {
            await loginWithSluggy();
            setIsLoggedIn(true);
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    const handleLogout = () => {
        removeAuthToken();
        setIsLoggedIn(false);
        setIsAccountMenuOpen(false);
    };

    const handleViewDashboard = () => {
        const dashboardUrl = import.meta.env.VITE_SHORT_LINK + 'dashboard';
        window.open(dashboardUrl, '_blank');
        setIsAccountMenuOpen(false);
    };

    const initiateShare = () => {

        if (!files.length || !files.some(item => item.content)) return;

        if (isLoggedIn && askForTitle) {
            setIsTitleDialogOpen(true);
        } else {
            handleShare('quickbin');
        }
    };

    const handleShare = async (title: string = 'quickbin') => {
        if (!files.length || !files.some(item => item.content)) return;
      
        setShareLoading(true);
      
        try {
          const json = JSON.stringify(files);
          const encoded = encodeURIComponent(compressTextBrotli(json));
      
          const targetUrl = `${import.meta.env.VITE_BASE_URL}#/${encoded}`;
          const apiUrl = `${import.meta.env.VITE_SHORT_LINK}api`;
          
          const token = getAuthToken();
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
      
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            targetUrl,
            expireDate: token ? null : '1week',
            title,
        }),
        });
      
          const resData = await response.json();
        
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
                <div className="flex items-center gap-3 px-4">
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                className="flex items-center gap-2 h-9 px-3 rounded-lg
                                         text-gray-700 dark:text-gray-200 
                                         hover:bg-gray-100 dark:hover:bg-gray-700 
                                         transition-all border border-transparent
                                         hover:border-gray-200 dark:hover:border-gray-600"
                            >
                                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 
                                              flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <User size={14} />
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isAccountMenuOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setIsAccountMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                                                  shadow-xl border border-gray-100 dark:border-gray-700 
                                                  py-1.5 z-20 animate-in fade-in zoom-in duration-100">
                                        <button
                                            onClick={handleViewDashboard}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm
                                                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 
                                                     dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <LayoutDashboard size={14} className="text-gray-400" />
                                            Dashboard
                                        </button>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm
                                                     text-red-600 dark:text-red-400 hover:bg-red-50 
                                                     dark:hover:bg-red-900/10 transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Exit
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="h-9 px-4 flex items-center gap-2 text-sm font-medium 
                                     text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 
                                     hover:bg-blue-100 dark:hover:bg-blue-900/40 
                                     transition-all active:scale-95"
                        >
                            <LogIn size={15} />
                            Sign in
                        </button>
                    )}
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                    <ThemeToggle />
                    <ShareButton data={files} onShareClick={initiateShare} isLoading={shareLoading} />
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
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm active:scale-95"
                                onClick={addNewFile}
                            >
                                Create New File
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Dialog isOpen={isTitleDialogOpen} onClose={() => setIsTitleDialogOpen(false)}>
                <div className="py-2 min-w-[300px]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Set Link Title</h2>
                    <input 
                        type="text" 
                        placeholder="quickbin" 
                        value={linkTitle} 
                        onChange={(e) => setLinkTitle(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all mb-4"
                    />
                    <label className="flex items-center gap-2 mb-6 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={!askForTitle} 
                            onChange={(e) => {
                                const newAsk = !e.target.checked;
                                setAskForTitle(newAsk);
                                localStorage.setItem('askForTitle', newAsk.toString());
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Don't ask title popup again</span>
                    </label>
                    <div className="flex gap-2 justify-end">
                        <button 
                            onClick={() => setIsTitleDialogOpen(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                setIsTitleDialogOpen(false);
                                handleShare(linkTitle || 'quickbin');
                                setLinkTitle('');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
                        >
                            Generate Link
                        </button>
                    </div>
                </div>
            </Dialog>
            <ShareLinkDialog
                isOpen={isShareDialogOpen}
                onClose={() => setIsShareDialogOpen(false)}
                link={shareLink}
                isAuthenticated={isLoggedIn}
            />
            <NewFeatureDialog
                isOpen={isNewFeatureDialogOpen}
                onClose={closeNewFeatureDialog}
                onConnect={handleLogin}
            />
        </div>
    );
}
