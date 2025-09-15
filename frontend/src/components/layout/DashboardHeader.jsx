import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon, Cog6ToothIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import avatar from '../../assets/avatar.jpg';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dropdownItems = [
    { label: 'Hồ sơ của bạn', action: () => navigate('/dashboard/profile') },
    { label: 'Cài đặt', action: () => navigate('/dashboard/settings') },
    { label: 'Đăng xuất', action: logout },
  ];

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="text-2xl font-semibold text-gray-800">Dashboard</div>

      <div className="flex-1 px-25 my-1">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        {[BellIcon, Cog6ToothIcon].map((Icon, idx) => (
          <button
            key={idx}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Icon className="h-6 w-6 text-gray-600" />
          </button>
        ))}

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 rounded-full hover:bg-gray-100 p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <img
              src={user?.avatar || avatar}
              alt="avatar"
              className="h-8 w-8 rounded-full object-cover border-1 border-black"
            />
            <span className="text-gray-700 font-medium hidden md:block">{user?.full_name || user?.username}</span>
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
                        active ? 'bg-gray-100' : '',
                        'w-full text-left px-4 py-2 text-sm text-gray-700'
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
    </header>
  );
};

export default DashboardHeader;