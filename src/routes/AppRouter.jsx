import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UpdateUser from "../pages/UpdateUser";
import { Blog } from "../pages/Blog";
import BlogDisplay from "../pages/BlogDisplay";
import { BlogUpdate } from "../pages/BlogUpdate";
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update/:id" element={<UpdateUser />} />
        <Route path="/create/blog" element={<Blog />} />
        <Route path="/blog/list" element={<BlogDisplay />} />
        <Route path="blog/edit/:id" element={<BlogUpdate />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
