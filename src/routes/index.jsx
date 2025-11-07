import {
    createBrowserRouter,
  } from "react-router-dom";
import App from '../pages/layout/App.jsx';
import Login from '../pages/auth/Login.jsx';
import Home from '../pages/movement_transition/Home.jsx'
import StockOut_List from "../pages/stock-out/StockOut_List.jsx"
import Transfer_List from "../pages/transfer/Transfer_List.jsx";
import StockIn_List from "../pages/stock-in/StockIn_List.jsx";
import Create_StockOut from "../pages/stock-out/CreateStockOut.jsx";
import Create_Transfer from "../pages/transfer/CreateTransfer.jsx"
import Location_List from "../pages/locations/Location_List.jsx";
import ProfilePage from "../pages/auth/ProfilePage.jsx";
import Create_Location from "../pages/locations/Create_Location.jsx";
import Stock_Balance from "../pages/stock_balance/Stock_Balance.jsx";
import ScanPage from "../pages/scan/ScanPage.jsx";
import Detail from "../pages/detail/Detail.jsx";
import Stock_Detail from "../pages/stock_balance/Stock_Detail.jsx";
import Stock_Balance_Scan from "../pages/scan/Stock_Balance_Scan.jsx";
import Create_StockIn from "../pages/stock-in/Create_StockIn.jsx";

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
          },
          {
            path: "/stock_balance_scan/:target",
            element: <Stock_Balance_Scan/>
          }
          ,
          {
            path: "/detail/:id",
            element : <Detail/>
          },
          {
            path: "/stock_detail/:id",
            element : <Stock_Detail/>
          }
      ]

    },
    {
        path: "/login",
        element: <Login/>
    }
  ]);

  export default router;