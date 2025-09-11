import { Link } from "react-router-dom";
import { navigation } from "../../data/navigation";
import logo from "../../assets/logo.png";  

const Navbar = ({ role }) => {
  const navItems = navigation[role] || [];

  return (
    <aside className="w-50 min-h-screen p-4 rounded-r-xl shadow-md">
      <div className="mb-8 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      <nav>
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon; 
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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

export default Navbar;