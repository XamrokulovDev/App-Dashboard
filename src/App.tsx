import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routerlayout from "./layouts";
import Home from "./pages/home";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Routerlayout />,
      children: [
        {
          index: true,
          element: <Home />
        }
      ]
    }
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App;