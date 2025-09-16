import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const NotificationSidebar = ({ notifications, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="ml-auto w-90 bg-white shadow-lg h-full p-4 overflow-y-auto relative">
        {/* nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Thông báo</h2>

        {notifications.length ? (
          notifications
            .slice()
            .reverse()
            .map((n) => (
              <div key={n.id} className="mb-3 border-b pb-2">
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.created_at).toLocaleString("vi-VN")}
                </div>
              </div>
            ))
        ) : (
          <div className="text-gray-500 text-sm">Không có thông báo.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationSidebar;
