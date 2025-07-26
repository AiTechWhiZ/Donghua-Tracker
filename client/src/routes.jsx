import Dashboard from "./pages/Dashboard";
import DonghuaList from "./pages/Donghua/List";
import DonghuaView from "./pages/Donghua/View";
import DonghuaAdd from "./pages/Donghua/Add";
import DonghuaEdit from "./pages/Donghua/Edit";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfileView from "./pages/Profile/View";
import ProfileEdit from "./pages/Profile/Edit";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
// import SlidingDemo from "./pages/SlidingDemo";
import NotFound from "./pages/404";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donghua",
    element: (
      <ProtectedRoute>
        <DonghuaList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donghua/add",
    element: (
      <ProtectedRoute>
        <DonghuaAdd />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donghua/:id",
    element: (
      <ProtectedRoute>
        <DonghuaView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donghua/:id/edit",
    element: (
      <ProtectedRoute>
        <DonghuaEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <ProfileEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/stats",
    element: (
      <ProtectedRoute>
        <Stats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sliding-demo",
    element: <ProtectedRoute>{/* <SlidingDemo /> */}</ProtectedRoute>,
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
