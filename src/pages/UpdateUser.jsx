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
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { COUNTRY_API, USER_API } from "../api/api";
import { toast } from "sonner";

export default function UpdateUser() {
  const { id } = useParams();
  const fileRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: "",
    id_country: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    COUNTRY_API.get("/list")
      .then((res) => {
        setCountries(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    USER_API.get(`/show/${id}`)
      .then((res) => {
        console.log(res);
        const user = res.data || {};
        setInputs((prev) => ({
          ...prev,
          ...user,
          id_country: String(user.id_country),
          password: "",
        }));
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
      });
  }, [id]);
  // Quản lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };
  // Validate file
  const validateFile = (file) => {
    if (!file) return "Vui lòng chọn hình ảnh";
    const allowType = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowType.includes(file.type)) return "Chỉ hỗ trợ ảnh JPG, PNG";
    const maxSize = 1024 * 1024;
    if (file.size > maxSize) return "Kích thước ảnh tối đa là 1MB";
  };
  // Xử lý file người dùng upload
  const handleInputFile = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
    const errors = validateFile(file);
    if (errors) {
      toast.error(errors);
      e.target.value = "";
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    // Tạo đối tượng đọc file
    const reader = new FileReader();
    // Xử lý khi đọc file xong
    reader.onload = (e) => {
      const result = e.target?.result; // Chuỗi Base64: data:image/png;base64,...
      // Đảm bảo result là chuỗi
      if (typeof result === "string") {
        setInputs((prev) => ({ ...prev, avatar: result }));
        setAvatarFile(file);
      }
    };
    // Chuyển thành data URL
    reader.readAsDataURL(file);
  };
  // Hàm validate form
  const validateForm = (inputs) => {
    const newErrors = {};
    if (!inputs.name.trim()) newErrors.name = "Vui lòng nhập tên";
    if (!inputs.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!inputs.password.trim()) newErrors.password = "Vui lòng mật khẩu";
    if (!inputs.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!inputs.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!inputs.id_country) newErrors.id_country = "Vui lòng chọn thành phố";
    if (!avatarFile) newErrors.avatar = "Vui lòng chọn ảnh đại diện";
    return newErrors;
  };
  // Hàm submit
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
    formData.append("id_country", inputs.id_country);
    formData.append("address", inputs.address);
    if (avatarFile) formData.append("avatar", avatarFile);
    const token = localStorage.getItem("token");
    try {
      await USER_API.put(`/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Cập nhật tài khoản thành công!");
    } catch (error) {
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
          <CardTitle className="text-2xl font-bold">Update Account</CardTitle>
          <CardDescription>
            Fill in your information to update for an account
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
                  value={inputs.name}
                  onChange={handleInputChange}
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
                  value={inputs.email}
                  onChange={handleInputChange}
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
                  value={inputs.phone}
                  onChange={handleInputChange}
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
                  value={inputs.address}
                  onChange={handleInputChange}
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
                    value={String(inputs.id_country)}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        id_country: value,
                      }))
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
              </div>
            </div>

            <Button
              style={{ cursor: "pointer" }}
              type="submit"
              className="w-full mt-3"
            >
              Update Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
