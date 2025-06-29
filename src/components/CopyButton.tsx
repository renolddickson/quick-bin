import { Copy } from 'lucide-react';
import { useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                 transition-colors font-medium text-sm"
    >
      <Copy size={16} />
      <span className='max-sm:hidden'>
      {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
};

export default CopyButton;
