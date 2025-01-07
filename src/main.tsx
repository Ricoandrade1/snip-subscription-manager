import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MemberProvider } from '@/contexts/MemberContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MemberProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </MemberProvider>
    </QueryClientProvider>
  </BrowserRouter>
);