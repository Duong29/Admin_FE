import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { BLOG_BASE_URL } from "../api/api";
import { Link } from "react-router-dom";

export default function BlogDisplay() {
  const [blogs, setBlogs] = useState([]);
  
  const accessToken = localStorage.getItem("token");
  useEffect(() => {
    if (!accessToken) return;
    BLOG_BASE_URL.get("/list", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Blog Posts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community of
            developers and creators.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  id={blog.image}
                  src={`http://localhost:3000/${blog.image}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {blog.title}
                </h2>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {blog.description}
                </p>
                {/* Content Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">
                    Content Preview:
                  </h4>
                  <p className="text-gray-600 text-xs line-clamp-2 bg-gray-50 p-2 rounded border-l-2 border-blue-200">
                    {blog.content}
                  </p>
                </div>
                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>John Doe</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>2024-01-15</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>890</span>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-sm bg-transparent"
                  >
                    Read More
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="px-3 flex items-center"
                  >
                    <Link
                      to={`/blog/edit/${blog.id}`}
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Update
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="px-8">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
