import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Revenue from "./pages/Revenue";
import Schedule from "./pages/Schedule";
import Story from "./pages/Story";
import Feed from "./pages/Feed";
import { MemberProvider } from "./contexts/MemberContext";

function App() {
  return (
    <MemberProvider>
      <BrowserRouter>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/members/*" element={<Members />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/social/story" element={<Story />} />
              <Route path="/social/feed" element={<Feed />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </MemberProvider>
  );
}

export default App;