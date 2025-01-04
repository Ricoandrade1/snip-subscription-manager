import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MemberProvider } from "@/contexts/MemberContext";
import Index from "@/pages/Index";
import Members from "@/pages/Members";
import Revenue from "@/pages/Revenue";
import PaymentReports from "@/pages/PaymentReports";
import Story from "@/pages/Story";
import Feed from "@/pages/Feed";

function App() {
  return (
    <MemberProvider>
      <Router>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/members/all" element={<Members />} />
                <Route path="/members/basic" element={<Members planType="Basic" />} />
                <Route path="/members/classic" element={<Members planType="Classic" />} />
                <Route path="/members/business" element={<Members planType="Business" />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/payment-reports" element={<PaymentReports />} />
                <Route path="/social/story" element={<Story />} />
                <Route path="/social/feed" element={<Feed />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </Router>
    </MemberProvider>
  );
}

export default App;