import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css'
import router from './routes';
import  AppProvider from './contexts/AppContext';


createRoot(document.getElementById('root')).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>

)
