import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Các link tạm thời dùng a href="#" để test
  const links = [
    { label: "Trang chủ", href: "#" },
    { label: "Khóa học", href: "#" },
    { label: "Giáo viên", href: "#" },
    { label: "Liên hệ", href: "#" },
    { label: "Về chúng tôi", href: "#" },
  ];

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EduCenter</h3>
            <p className="text-gray-400 text-sm">
              Trung tâm đào tạo tiếng Hàn hàng đầu, mang đến những khóa học chất lượng cao và môi trường học tập thân thiện.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-white text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <p className="text-gray-400 text-sm">Địa chỉ: 123 Đường ABC, Quận XYZ, TP Đà Nẵng</p>
            <p className="text-gray-400 text-sm mt-2">Email: info@educenter.com</p>
            <p className="text-gray-400 text-sm mt-2">Điện thoại: (84) 123 456 789</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">FB</a>
              <a href="#" className="text-gray-400 hover:text-white">YT</a>
              <a href="#" className="text-gray-400 hover:text-white">IG</a>
              <a href="#" className="text-gray-400 hover:text-white">LN</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {currentYear} EduCenter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
