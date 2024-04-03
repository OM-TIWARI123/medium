import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing.jsx";
import Header from "./components/Header.jsx";
import PrivateRoute from "./components/PrivateRoute"
import {RecoilRoot} from "recoil"
import {UpdateListing} from "./pages/UpdateListing.jsx"
import Listing from "./pages/Listing.jsx";
function App() {
  

  return <BrowserRouter>
  <RecoilRoot>
  <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/create-listing' element={<CreateListing />} />
        <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
      </Route>
      
      
    </Routes>
    </RecoilRoot>
  </BrowserRouter>
}
export default App
