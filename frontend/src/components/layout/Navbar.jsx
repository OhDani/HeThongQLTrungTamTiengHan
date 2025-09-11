// src/components/layout/Navbar.jsx
import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ROLES } from '../../utils/constants';
import avatar from '../../assets/avatar.jpg';
import logo from '../../assets/logo.png';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Khóa học', href: '/courses' },
  { name: 'Giáo viên', href: '/teachers' },
  { name: 'Liên hệ', href: '/contact' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showNotification('Bạn đã đăng xuất.', 'info');
    navigate('/');
  };

  const dashboardPath = user
    ? {
        [ROLES.HOC_VIEN]: '/dashboard/student',
        [ROLES.GIANG_VIEN]: '/dashboard/teacher',
        [ROLES.QUAN_LY_HOC_VU]: '/dashboard/academic',
        [ROLES.KE_TOAN]: '/dashboard/accounting',
        [ROLES.QUAN_TRI_HE_THONG]: '/dashboard/admin',
        [ROLES.REGISTERED_USER]: '/dashboard/registered',
      }[user.role] || '/dashboard'
    : '/dashboard';

  return (
    <Popover className="relative bg-white shadow-sm z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <Link to="/" className="flex items-center lg:w-0 lg:flex-1">
            <img className="h-16 w-auto" src={logo} alt="Logo" />
          </Link>

          <div className="-mr-2 -my-2 md:hidden">
            <Popover.Button
              onClick={() => setMobileMenuOpen(true)}
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Mở menu chính</span>
              <Bars3Icon className="h-6 w-6" />
            </Popover.Button>
          </div>

          <Popover.Group as="nav" className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-base font-medium text-gray-500 hover:text-gray-900">
                {item.name}
              </Link>
            ))}
          </Popover.Group>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {!isAuthenticated ? (
              <>
                <Link to="/auth/login" className="text-base font-medium text-gray-500 hover:text-gray-900">
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="ml-8 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-base font-medium hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <Menu as="div" className="ml-3 relative">
                <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <img className="h-8 w-8 rounded-full" src={user.avatar || avatar} alt="avatar" />
                  <span className="ml-2 text-gray-700 hidden lg:inline-block">{user.fullName || user.username}</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
                </Menu.Button>

                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {[
                      { name: 'Hồ sơ của tôi', href: '/dashboard/profile' },
                      { name: 'Bảng điều khiển', href: dashboardPath },
                    ].map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')} to={item.href}>
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={handleLogout} className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700')}>
                          Đăng xuất
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        as={Fragment}
        show={mobileMenuOpen}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5 flex items-center justify-between">
              <img className="h-8 w-auto" src={logo} alt="Logo" />
              <Popover.Button onClick={() => setMobileMenuOpen(false)} className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <span className="sr-only">Đóng menu</span>
                <XMarkIcon className="h-6 w-6" />
              </Popover.Button>
            </div>
            <nav className="mt-6 grid gap-y-8 px-5">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                  <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="py-6 px-5 space-y-6">
              {!isAuthenticated ? (
                <div>
                  <Link to="/auth/register" className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-base font-medium hover:bg-blue-700" onClick={() => setMobileMenuOpen(false)}>Đăng ký</Link>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Đã có tài khoản?{' '}
                    <Link to="/auth/login" className="text-blue-600 hover:text-blue-500" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <Link to="/dashboard/profile" className="text-base font-medium text-gray-900 hover:text-gray-700" onClick={() => setMobileMenuOpen(false)}>Hồ sơ của tôi</Link>
                  <Link to={dashboardPath} className="text-base font-medium text-gray-900 hover:text-gray-700" onClick={() => setMobileMenuOpen(false)}>Bảng điều khiển</Link>
                  <button onClick={handleLogout} className="w-full text-left text-base font-medium text-gray-900 hover:text-gray-700">Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Navbar;
