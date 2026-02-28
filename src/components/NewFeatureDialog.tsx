import { Dialog } from "./Dialog";
import { Sparkles } from "lucide-react";

export const NewFeatureDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="text-blue-600 dark:text-blue-400" size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          New Feature! 🚀
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          You can now <span className="font-semibold text-blue-600 dark:text-blue-400">login</span> to save your snippets 
          and <span className="font-semibold text-blue-600 dark:text-blue-400">view your dashboard</span> in Sluggy!
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 
                     rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Got it, thanks!
        </button>
      </div>
    </Dialog>
  );
};
