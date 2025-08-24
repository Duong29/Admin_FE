import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload } from "lucide-react";
import { BLOG_BASE_URL } from "../api/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export function BlogUpdate() {
  const { id } = useParams();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFiles] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (inputs) => {
    const formErrors = {};
    if (!imageFile) formErrors.image = "Vui lòng thêm ảnh";
    if (!inputs.title.trim()) formErrors.title = "Vui lòng thêm tiêu đề";
    if (!inputs.description.trim())
      formErrors.description = "Vui lòng thêm mô tả";
    if (!inputs.content.trim()) formErrors.content = "Vui lòng thêm nội dung";
  };

  const validateFile = (file) => {
    const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 1024 * 1024;
    if (!allowTypes.includes(file.type)) return '"Chỉ hỗ trợ ảnh JPG, PNG';
    if (file.size > maxSize) return "Kích thước ảnh tối đa là 1MB";
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const errorMessage = validateFile(file);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }
    setImageFiles(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setInputs((prev) => ({ ...prev, image: result }));
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitErrors = validateForm(inputs);
    console.log(submitErrors);

    if (Object.keys(submitErrors).length > 0) {
      const priority = ["image", "title", "description", "content"];
      const firstError = priority.find((key) => submitErrors[key]);
      if (firstError) toast.error(submitErrors[firstError]);
      return;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create New Blog</CardTitle>
          <CardDescription>
            Fill in the details to update your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors w-full">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-muted rounded-full">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Upload Featured Image</p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop or click to browse
                    </p>
                  </div>
                </div>
              </div>
              <Label htmlFor="image" className="cursor-pointer mt-3">
                <div className="flex items-center space-x-1 text-sm border rounded px-3 py-1 hover:bg-gray-50">
                  <Upload className="h-3 w-3" />
                  <span>Choose File</span>
                </div>
              </Label>
              <Input
                onChange={handleFile}
                id="image"
                name="image"
                type="file"
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  value={inputs.title}
                  onChange={handleInput}
                  id="title"
                  name="title"
                  className="mt-2"
                  placeholder="Enter your blog title..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  value={inputs.description}
                  onChange={handleInput}
                  id="description"
                  name="description"
                  className="mt-2 min-h-[80px] resize-none"
                  placeholder="Write a brief description..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  value={inputs.content}
                  onChange={handleInput}
                  id="content"
                  name="content"
                  className="mt-2 min-h-[160px] resize-y"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Update Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
