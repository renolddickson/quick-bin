import type { DataType } from '../models'
import { Share2 } from 'lucide-react'

const ShareButton = ({ 
  data, 
  onShareClick,
  isLoading
}: { 
  data: DataType[]; 
  onShareClick: () => void;
  isLoading: boolean
}) => {
  return (
    <button
      onClick={onShareClick}
      className="w-10 h-10 bg-green-600 hover:bg-green-700 text-white 
                 flex items-center justify-center transition-colors"
      disabled={data.length === 0}
      title={data.length === 0 ? "No files to share" : "Share files"}
    >
      {!isLoading ? (
        <Share2 size={18} />
      ) : (
        <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full"></div>
      )}
    </button>
  );
};

export default ShareButton