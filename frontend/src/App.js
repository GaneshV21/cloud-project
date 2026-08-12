import "./App.css";
import Signup from "./components/page/Auth/SignUp";
import Login from "./components/page/Auth/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MenuItems } from "./components/page/Menu/Menus";
import Dashboard from "./components/page/Dashboard/Dashboard";
import Instances from "./components/page/Instances/Instances";
import Keypairs from "./components/page/Instances/Keypairs";
import Volumes from "./components/page/Storage/Volumes";
import Networks from "./components/page/Network/Networks";
import SecurityGroups from "./components/page/Network/SecurityGroups";
import Projects from "./components/page/Projects/Projects";
import Users from "./components/page/Users/Users";
import Profile from "./components/page/Profile/Profile";
import Billing from "./components/page/Billing/Billing";
import PATH from "../src/utils/Path";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={PATH?.Login} element={<Login />} />
          <Route path={PATH.Signup} element={<Signup />} />
          <Route element={<MenuItems />}>
            <Route path={PATH.Dashboard} element={<Dashboard />} />
            <Route path={PATH.Instances} element={<Instances />} />
            <Route path={PATH.Keypairs} element={<Keypairs />} />
            <Route path={PATH.Volumes} element={<Volumes />} />
            <Route path={PATH.Networks} element={<Networks />} />
            <Route path={PATH.SecurityGroups} element={<SecurityGroups />} />
            <Route path={PATH.Projects} element={<Projects />} />
            <Route path={PATH.Users} element={<Users />} />
            <Route path={PATH.Profile} element={<Profile />} />
            <Route path={PATH.Billing} element={<Billing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
