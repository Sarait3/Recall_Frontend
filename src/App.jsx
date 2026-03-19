import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import UploadPage from "./UploadPage";
import ChatPage from "./ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;