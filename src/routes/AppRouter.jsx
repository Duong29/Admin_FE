import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UpdateUser from "../pages/UpdateUser";
import { Blog } from "../pages/Blog";
import BlogDisplay from "../pages/BlogDisplay";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update/:id" element={<UpdateUser />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-display" element={<BlogDisplay />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
