import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MemberProvider } from '@/contexts/MemberContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MemberProvider>
      <App />
    </MemberProvider>
  </BrowserRouter>
);