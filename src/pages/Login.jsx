import { Eye, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { USER_API } from "../api/api";

export default function Login() {
  // State quản lý input
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    level: "1",
  });
  // State quản lý lỗi
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  // Hàm cập nhận input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  // Validate form
  const validateForm = (inputs) => {
    const newErrors = {};
    if (!inputs.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!inputs.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };
  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(inputs);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors).join("\n"), {
        style: { whiteSpace: "pre-line" },
      });
      return;
    }
    USER_API.post("/login", {
      email: inputs.email,
      password: inputs.password,
      level: inputs.level,
    })
      .then((res) => {
        toast.success(res.data?.message);
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        setInputs({
          email: "",
          password: "",
          level: "1"
        });
      })
      .catch((error) => {
        const errors = error?.response?.data?.message;
        toast.error(errors);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="mb-3">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  onChange={handleInputChange}
                  name="email"
                  value={inputs.email}
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="mb-3">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  onChange={handleInputChange}
                  value={inputs.password}
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Level Field */}
            <div className="space-y-2 mb-7">
              <Label htmlFor="level" className="mb-3">
                Access Level
              </Label>
              <Select value={inputs.level}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>

            <div className="flex items-center justify-between w-full text-sm">
              <Button variant="link" className="p-0 h-auto text-sm">
                Forgot password?
              </Button>
              <Button variant="link" className="p-0 h-auto text-sm">
                Need an account?
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
