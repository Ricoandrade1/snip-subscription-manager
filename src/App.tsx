import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { MemberProvider } from "@/contexts/MemberContext";
import Members from "@/pages/Members";

function App() {
  return (
    <BrowserRouter>
      <MemberProvider>
        <div className="flex min-h-screen bg-barber-dark">
          <AppSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Members />} />
              <Route path="/members/all" element={<Members />} />
              <Route path="/members/basic" element={<Members planType="Basic" />} />
              <Route path="/members/classic" element={<Members planType="Classic" />} />
              <Route path="/members/business" element={<Members planType="Business" />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </MemberProvider>
    </BrowserRouter>
  );
}

export default App;