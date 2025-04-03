import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-2xl text-center my-10">
      Welcome to Home page
      <NavLink to="/register" className="bg-blue-500 text-white px-5 py-2 rounded-lg fixed top-10 right-10">Register</NavLink>
    </div>
  )
}

export default Home;