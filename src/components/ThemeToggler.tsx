import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                 flex items-center justify-center text-gray-600 dark:text-gray-300 
                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
