import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routerlayout from "./layouts";
import Home from "./pages/home";
import Register from "./pages/register";
import ParticlesBg from "particles-bg";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Routerlayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "/register", element: <Register />}
      ]
    }
  ]);
  return (
    <>
      <ParticlesBg type={"cobweb"} bg={true} />
      <RouterProvider router={router} />
    </>
  )
}

export default App;