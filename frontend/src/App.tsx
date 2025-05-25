import { RouterProvider } from 'react-router'
import './App.css'
import "quill/dist/quill.snow.css";
import { router } from './routes/AppRoutes';
import { useEffect, useState } from "react";
import { TextFillLoading } from "./components/common/TextLoading";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (replace with real logic if needed)
    const timer = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    console.log(window.innerWidth);
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <TextFillLoading fontSize={window.innerWidth > 768 ? 100 : 50} text="Loading"/>
      </div>
    );
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App;
