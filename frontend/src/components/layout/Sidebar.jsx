import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../data/navigation";
import logo from "../../assets/logo.png";  

const Sidebar = ({ role }) => {
  const location = useLocation();
  const roleMap = {
    "Học viên": "student",
    "Giảng viên": "teacher",
    "Quản lý học vụ": "manager",
    "Quản lý hệ thống": "admin",
  };
  const mappedRole = roleMap[role] || role;
  const navItems = navigation[mappedRole] || [];

  return (
    <aside className="w-56 min-h-screen p-4 rounded-r-xl shadow-md bg-white">
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      <nav>
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-blue-500 text-white font-medium" 
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
