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
import { useState } from "react";
import { toast } from "sonner";

export function Blog() {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!file) return "Vui lòng chọn hình ảnh";
    const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowTypes.includes(file.type)) return "Chỉ hỗ trợ ảnh JPG, PNG";
    const maxSize = 1024 * 1024;
    if (file.size > maxSize) return "Kích thước ảnh tối đa là 1MB";
  };

  const handleInputFile = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
    const errors = validateFile(file);
    if (errors) {
      toast.error(errors);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setInputs((prev) => ({ ...prev, image: result }));
        setImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create New Blog</CardTitle>
          <CardDescription>
            Fill in the details to create your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="flex flex-col items-center">
              {preview ? (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-60 rounded-lg object-cover mx-auto"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors w-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-muted rounded-full">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Upload Featured Image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Label htmlFor="image" className="cursor-pointer mt-3">
                <div className="flex items-center space-x-1 text-sm border rounded px-3 py-1 hover:bg-gray-50">
                  <Upload className="h-3 w-3" />
                  <span>Choose File</span>
                </div>
              </Label>
              <Input
                id="image"
                onChange={handleInputFile}
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  onChange={handleInput}
                  name="title"
                  className="mt-2"
                  placeholder="Enter your blog title..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  onChange={handleInput}
                  name="description"
                  className="mt-2 min-h-[80px] resize-none"
                  placeholder="Write a brief description..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  onChange={handleInput}
                  name="content"
                  className="mt-2 min-h-[160px] resize-y"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Publish Blog
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
