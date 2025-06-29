import { Link, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Dialog } from "./Dialog";

export const ShareLinkDialog = ({ 
  isOpen, 
  onClose, 
  link 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  link: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
          <Link className="text-blue-600 dark:text-blue-400" size={32} />
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Share Your Files
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Copy this link to share your files with others. The link contains all your current files and their content.
        </p>
        
        {/* Share URL Input */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 
                       bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       text-sm font-mono"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                       flex items-center gap-2 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </Dialog>
  );
};