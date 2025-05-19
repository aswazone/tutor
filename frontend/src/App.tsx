
import { RouterProvider } from 'react-router'
import './App.css'
import "quill/dist/quill.snow.css";
import { router } from './routes/AppRoutes';
function App() {
  return (
    
    <RouterProvider router={router} />
  )
}

export default App;
