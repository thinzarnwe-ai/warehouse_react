import {
    createBrowserRouter,
  } from "react-router-dom";
import App from '../pages/layout/App.jsx';
import Login from '../pages/Login.jsx';
import Home from '../pages/Home.jsx'
import Create_StockIn from "../pages/Create_StockIn.jsx";
import StockOut_List from "../pages/StockOut_List.jsx"
import Transfer_List from "../pages/Transfer_List.jsx";
import StockIn_List from "../pages/StockIn_List.jsx";
import Create_StockOut from "../pages/Create_StockOut.jsx";
import Create_Transfer from "../pages/Create_Transfer.jsx";
import Location_List from "../pages/Location_List.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import Create_Location from "../pages/Create_Location.jsx";
import Stock_Balance from "../pages/Stock_Balance.jsx";
import ScanPage from "../pages/ScanPage.jsx";
import Detail from "../pages/Detail.jsx";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
         {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path:"/",
          element: <Home/>
        },
        {
          path: "/create_stockin",
          element: <Create_StockIn/>
        },
        {
          path: "/create_stockout",
          element: <Create_StockOut/>
        },
        {
          path: "/create_transfer",
          element: <Create_Transfer/>
        },
        {
          path: "/create_location",
          element: <Create_Location/>
        },
        {
          path: "/stock_out_lists",
          element: <StockOut_List/>
        },
        {
          path: "/stock_in_lists",
          element: <StockIn_List/>
        },
        {
          path: "/transfer_lists",
          element: <Transfer_List/>
        },
        {
          path: "/locations",
          element: <Location_List/>
        },
          {
          path: "/stock_balance_lists",
          element: <Stock_Balance/>
          },
          {
            path: "/scan/:target",
            element: <ScanPage/>
          }
          ,
          {
            path: "/detail/:id",
            element : <Detail/>
          }
      ]

    },
    {
        path: "/login",
        element: <Login/>
    }
  ]);

  export default router;