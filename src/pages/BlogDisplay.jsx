import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye } from "lucide-react"

// Sample blog data for UI demonstration
const sampleBlogs = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    description:
      "Learn how to build modern web applications using React with TypeScript for better type safety and developer experience.",
    content: "React and TypeScript make a powerful combination for building scalable web applications...",
    image: "https://images.pexels.com/photos/29534970/pexels-photo-29534970.jpeg",
    author: "John Doe",
    date: "2024-01-15",
    views: 1250,
    tags: ["React", "TypeScript", "Web Development"],
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS for Modern UI Design",
    description:
      "Discover advanced Tailwind CSS techniques to create beautiful, responsive user interfaces with utility-first approach.",
    content: "Tailwind CSS revolutionizes how we approach styling in modern web development...",
    image: "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg",
    author: "Jane Smith",
    date: "2024-01-12",
    views: 890,
    tags: ["CSS", "Tailwind", "Design"],
  },
  {
    id: 3,
    title: "Building Scalable APIs with Node.js",
    description:
      "Best practices for creating robust and scalable REST APIs using Node.js, Express, and modern development patterns.",
    content:
      "Building scalable APIs requires careful consideration of architecture, performance, and maintainability...",
    image: "https://images.pexels.com/photos/29483603/pexels-photo-29483603.jpeg",
    author: "Mike Johnson",
    date: "2024-01-10",
    views: 2100,
    tags: ["Node.js", "API", "Backend"],
  },
]

export default function BlogDisplay() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Blog Posts</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community of developers and creators.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBlogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader className="pb-3">                

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                  {blog.title}
                </h2>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.description}</p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{blog.views.toLocaleString()}</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Button variant="outline" className="w-full text-sm bg-transparent">
                  Read More
                </Button>
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
  )
}
