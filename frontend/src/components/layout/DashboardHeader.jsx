import React, { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import avatar from "../../assets/avatar.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";
import NotificationSidebar from "./NotificationSidebar";
import SettingsSidebar from "./Settings";
import { useSearch } from "../../contexts/SearchContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DashboardHeader = ({ searchTerm, setSearchTerm }) => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);

  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 

  useEffect(() => {
    const fetchNoti = async () => {
      if (user) {
        const data = await getNotifications(user);
        setNotifications(data);
      }
    };
    fetchNoti();
  }, [user]);
  };

  const dropdownItems = [
    { label: "Hồ sơ của bạn", action: () => navigate("/dashboard/profile") },
    { label: "Đăng xuất", action: logout },
  ];

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="text-2xl font-semibold text-gray-800">Dashboard</div>

      {/* Search input */}
      <div className="flex-1 mx-6 my-1 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Tìm kiếm..."
          className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="absolute right-2 top-2.5 h-5 w-5 text-gray-500" />
      </div>

      {/* Icons & Dropdown */}
      <div className="flex items-center space-x-4">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowNoti(true)}
        >
          <BellIcon className="h-6 w-6 text-gray-600" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowSettings(true)}
        >
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
        </button>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <img
              src={user?.avatar || avatar}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border"
            />
            <span className="text-gray-700 font-medium hidden md:block">
              {user?.full_name || user?.username}
            </span>
            <span className="text-gray-700 font-medium hidden md:block">
              {user?.full_name || user?.username}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              {dropdownItems.map((item, idx) => (
                <Menu.Item key={idx}>
                  {({ active }) => (
                    <button
                      onClick={item.action}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "w-full text-left px-4 py-2 text-sm text-gray-700"
                        active ? "bg-gray-100" : "",
                        "w-full text-left px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {showNoti && (
        <NotificationSidebar
          notifications={notifications}
          onClose={() => setShowNoti(false)}
        />
      )}

      {showSettings && <SettingsSidebar onClose={() => setShowSettings(false)} />}
    </header>
  );
};

export default DashboardHeader;
