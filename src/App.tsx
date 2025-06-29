import { HashRouter, Routes, Route } from "react-router";
import Create from "./pages/Create";
import View from "./pages/View";
import { ThemeProvider } from "./providers/ThemeContext";

function App() {
  return (
    <ThemeProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/*" element={<View />} />
      </Routes>
    </HashRouter>
    </ThemeProvider>
  );
}

export default App;
