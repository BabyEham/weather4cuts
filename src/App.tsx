import GlobalToastContainer from "./components/Toast";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import CameraPage from "./pages/CameraPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
      <GlobalToastContainer />
    </>
  );
}

export default App;
