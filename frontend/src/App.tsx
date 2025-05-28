import { RouterProvider } from 'react-router'
import './App.css'
import "quill/dist/quill.snow.css";
import { router } from './routes/AppRoutes';
import { useEffect, useState } from "react";
import { TextFillLoading } from "./components/common/TextLoading";
import { useIsMobile } from './components/hooks/useMobile';

function App() {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <TextFillLoading 
          fontSize={isMobile ? 50 : 100} 
          text="Loading"
        />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;