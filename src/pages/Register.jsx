import { COUNTRY_API, USER_API } from "../api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export default function Register() {
  const [preview, setPreview] = useState("");
  const fileRef = useRef(null);
  // State quản lý input
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    id_country: "",
    avatar: "",
    level: "1",
  });

  // State quản lý lỗi
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  // State quản lý file
  const [avatarFile, setAvatarFile] = useState(null);
  // State quản lý country
  const [countries, setCountries] = useState([]);
  // Gọi api country
  useEffect(() => {
    COUNTRY_API.get("/list")
      .then((res) => {
        setCountries(res.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // Hàm cập nhật input khi có thay đổi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({...prev, [name]: value}));
  };
  // Hàm validate file
  const validateFile = (file) => {
    if (!file) return "Vui lòng chọn hình ảnh";
    const allowTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowTypes.includes(file.type)) {
      return "Chỉ hỗ trợ ảnh JPG, PNG";
    }
    if (file.size > 1024 * 1024) {
      return "Kích thước ảnh tối đa là 1MB";
    }
  };
  // Hàm xử lý input file
  const handleInputFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // tạo URL tạm thời để preview
    }
    const errors = validateFile(file);
    if (errors) {
      toast.error(errors);
      e.target.value = "";
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result; // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQ
      if (typeof result === "string") {
        setInputs((prev) => ({ ...prev, avatar: result }));
        setAvatarFile(file);
      }
    };
    reader.readAsDataURL(file);
  };
  // Hàm validate form
  const validateForm = (inputs) => {
    const newErrors = {};
    if (!inputs.name.trim()) newErrors.name = "Vui lòng nhập tên";
    if (!inputs.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!inputs.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";
    if (!inputs.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!inputs.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!avatarFile) newErrors.avatar = "Vui lòng chọn ảnh đại diện";
    if (!inputs.id_country) newErrors.id_country = "Vui lòng chọn thành phố";
    return newErrors;
  };
  // Hàm sử lý logic khi submit form
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
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    formData.append("phone", inputs.phone);
    formData.append("address", inputs.address);
    formData.append("level", inputs.level);
    formData.append("id_country", inputs.id_country);
    if (avatarFile) formData.append("avatar", avatarFile);
    try {
      await USER_API.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Tạo tài khoản thành công!");
    } catch (error) {
      console.log(error);
      if (error.response) {
        const emailErrors = error.response.data;
        if (emailErrors.email) {
          toast.error(emailErrors.email);
          return;
        }
      } else {
        toast.error("Không thể kết nối tới server");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Fill in your information to register for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-22 w-22">
                <AvatarImage src={preview} alt="User avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer mt-2">
                <div className="flex items-center space-x-1 text-sm border rounded px-2 py-1 hover:bg-gray-50">
                  <Upload className="h-3 w-3" />
                  <span>Upload</span>
                </div>
              </Label>
              <Input
                onChange={handleInputFile}
                ref={fileRef}
                name="avatar"
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="mb-3">
                  Name *
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={inputs.name}
                  name="name"
                  className="mb-4"
                  id="name"
                  type="text"
                  placeholder="Full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-3">
                  Email *
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={inputs.email}
                  name="email"
                  className="mb-4"
                  id="email"
                  placeholder="Email address"
                />
              </div>

              <div>
                <Label htmlFor="password" className="mb-3">
                  Password *
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={inputs.password}
                  name="password"
                  className="mb-4"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-3">
                  Phone
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={inputs.phone}
                  name="phone"
                  className="mb-4"
                  id="phone"
                  type="tel"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <Label htmlFor="address" className="mb-3">
                  Address
                </Label>
                <Input
                  onChange={handleInputChange}
                  value={inputs.address}
                  name="address"
                  className="mb-4"
                  id="address"
                  type="text"
                  placeholder="Address"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="country" className="mb-3">
                    Country
                  </Label>
                  <Select
                    value={inputs.id_country}
                    onValueChange={(value) =>
                      setInputs({ ...inputs, id_country: value })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level" className="mb-3">
                    Level
                  </Label>
                  <Select value={inputs.level}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              style={{ cursor: "pointer" }}
              type="submit"
              className="w-full mt-3"
            >
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
