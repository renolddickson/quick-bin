import { Dialog } from "./Dialog";
import { ArrowRight, Cloud } from "lucide-react";

export const NewFeatureDialog = ({
  isOpen,
  onClose,
  onConnect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="py-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white">
            <Cloud size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Update 02.24
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-none mt-0.5">
              Cloud Sync enabled
            </h2>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed border-l-2 border-gray-100 dark:border-gray-700 pl-4">
          External accounts can now be linked to enable persistent snippet storage and multi-device synchronization.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onConnect();
              onClose();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 
                       text-sm flex items-center justify-between group transition-colors"
          >
            <span>CONNECT ACCOUNT</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 
                       font-bold text-[10px] tracking-tighter py-2 transition-colors uppercase"
          >
            Dimiss notification
          </button>
        </div>
      </div>
    </Dialog>
  );
};
