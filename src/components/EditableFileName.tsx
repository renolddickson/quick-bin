import { useState } from "react";
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

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className="text-sm font-medium cursor-pointer select-none"
      title="Double-click to rename"
    >
      {`${fileName ?? 'untitled'}.${fileType == 'text'?'txt':languageOptions.find(lang=>lang.label == language)?.extension || 'txt'}`}
    </span>
  );
};
