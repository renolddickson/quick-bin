import { useState, useRef } from "react";
import { languageOptions } from "../constants";

export const EditableFileName = ({
  language,
  fileName, 
  onNameChange, 
  fileType 
}: {
  language?:string;
  fileName: string; 
  onNameChange: (name: string) => void;
  fileType: 'text' | 'code';
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(fileName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const longPressTimer = useRef<any | null>(null);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => {
      setIsEditing(true);
      setTempName(fileName);
    }, 600); // 600ms for long press
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempName(fileName);
  };

  const handleSubmit = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempName(fileName);
    }
  };
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/[^a-zA-Z0-9-_ ]/g, ''); // allow letters, numbers, dash, underscore, space
    setTempName(sanitized);
  };
  if (isEditing) {
    return (
      <input
        type="text"
        value={tempName}
        onChange={handleFileNameChange}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className="bg-transparent border-b border-gray-400 outline-none text-sm font-medium 
                   text-gray-700 dark:text-gray-200 min-w-20 max-w-32"
        autoFocus
      />
    );
  }

  const getExtension = () => {
    if (fileType === 'text') return 'txt';
    if (language?.startsWith('custom:')) return language.split(':')[1] || 'txt';
    const found = languageOptions.find(lang => lang.label === language);
    return found?.extension || 'txt';
  };

  return (
    <span
      onDoubleClick={handleDoubleClick}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      className={`text-sm font-medium cursor-pointer select-none transition-all active:scale-95 active:opacity-70`}
      title="Double-click or long-press to rename"
    >
      {`${fileName || 'untitled'}.${getExtension()}`}
    </span>
  );
};
