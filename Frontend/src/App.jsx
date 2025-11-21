import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ Components/ProtectedRoute";
import AuthenticationPage from "./Pages/AuthPage/AuthenticationPage";
import Dash from "./Pages/Dash/Dash";
import LandingPage from "./Pages/LandingPage";
import UnAuthorized from "./ Components/UnAuthorized";
import Schedule from "./Pages/SchedulePages/Schedule";
import AuthSchedule from "./Pages/SchedulePages/AuthSchedule";
import AboutPage from "./Pages/AboutPage/About";
import RequestPickupPage from "./Pages/PickupPage/RequestPickupPage";
import Payment from "./Pages/Payment/Payment";
import ProfilePage from "./Pages/Profile/ProfilePage";
import ComplaintPage from "./Pages/Complaint/ComplaintPage";
import ViewComplainRequests from "./AdminPages/Pages/ViewComplaintRequests";
import ViewPickupRequests from "./AdminPages/Pages/ViewPickupRequests";
import AllData from "./AdminPages/Pages/AllData";
import Homepage from "./MarketPlace/Homepage";
import ShoppingCart from "./MarketPlace/ShoppingCart";
import HistoryPage from "./MarketPlace/History";
import ProductDetailsPage from "./MarketPlace/ProductsDetailPage";
import OrderPage from "./MarketPlace/OrderPage";
import { SellPage } from "./MarketPlace/SellPage";
import OrderDetailPage from "./MarketPlace/OrderDetailPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthenticationPage />} />
      <Route path="/unauthorized" element={<UnAuthorized />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/authSchedule" element={<AuthSchedule />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/requestPickup" element={<RequestPickupPage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/complaints" element={<ComplaintPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dash />
          </ProtectedRoute>
        }
      />  
      <Route path="/admin">
         <Route path="Crequest" element={<ViewComplainRequests/>} />
         <Route path ="request" element ={<ViewPickupRequests/>} />
         <Route path ="dashboard" element={<AllData/>} />
      </Route>
      {/* Admin Only Routes */}
      {/* <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        /> */}

      {/* Catch all - redirect to landing */}
      <Route path ="/marketPlace" >
        <Route path ="" element={<Homepage/>} />
        <Route path ="shoppingCart" element={<ShoppingCart/>} />
        <Route path ="history" element={<HistoryPage/>} />
        <Route path = "productDetails/:id" element={<ProductDetailsPage/>}/>
        <Route path = "orderDetails" element={<OrderPage/>}/>
        <Route path = "orderDetails/:id" element={<OrderDetailPage/>}/>
        <Route path = "sellProduct" element={<SellPage/>} />
       </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

      
    </Routes>
  );
}

export default App;
