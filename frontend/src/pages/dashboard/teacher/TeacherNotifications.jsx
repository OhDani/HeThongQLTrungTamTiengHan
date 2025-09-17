import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import Input from "../../../components/common/Input";
import TextArea from "../../../components/common/TextArea";
import Modal from "../../../components/common/Modal";
import { FaPlus, FaBell, FaTrash } from "react-icons/fa";
import { notificationApi, classApi } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

const TeacherNotifications = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    content: "",
    target: "all", // mặc định gửi toàn bộ học viên
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Lấy danh sách lớp giảng viên đang dạy + thông báo của giảng viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authLoading || !isAuthenticated) return;
        setLoading(true);

        // lấy thông báo của chính giảng viên này
        const allNotifications = await notificationApi.getAll();
        const teacherNotifs = allNotifications.filter(
          (n) => n.sender_id === user?.user_id
        );

        setNotifications(
          teacherNotifs.map((n) => ({
            ...n,
            senderInfo: { name: user.full_name, role: user.role },
          }))
        );

        // lấy lớp mà giảng viên dạy
        const allClasses = await classApi.getAll();
        const myClasses = allClasses.filter((cl) => cl.user_id === user?.user_id);
        setTeacherClasses(myClasses);

        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading, isAuthenticated, user]);

  const handleModalClose = () => {
    setShowModal(false);
    setNewNotification({ title: "", content: "", target: "all" });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setError("Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại.");
        return;
      }
      setLoading(true);

      const notificationData = {
        sender_id: user.user_id,
        title: newNotification.title,
        message: newNotification.content,
        created_at: new Date().toISOString(),
      };

      if (newNotification.target === "all") {
        notificationData.receiver_role = "Học viên"; // gửi toàn bộ học viên
      } else {
        notificationData.receiver_class_id = +newNotification.target; // gửi riêng lớp
      }

      const createdNotification = await notificationApi.create(notificationData);
      const newNotifWithInfo = {
        ...createdNotification,
        senderInfo: {
          name: user.full_name,
          role: user.role,
        },
      };
      setNotifications([newNotifWithInfo, ...notifications]);
      handleModalClose();
    } catch (err) {
      setError("Không thể tạo thông báo mới. Vui lòng kiểm tra lại.");
      console.error("Lỗi khi tạo thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này không?")) {
      try {
        setLoading(true);
        await notificationApi.delete(notificationId);
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
      } catch (err) {
        setError("Không thể xóa thông báo. Vui lòng thử lại.");
        console.error("Lỗi khi xóa thông báo:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Lỗi định dạng ngày:", e);
      return dateString;
    }
  };

  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading || authLoading)
    return <div className="p-6 text-center text-gray-500">Đang tải thông báo...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!isAuthenticated)
    return <div className="p-6 text-center text-red-500">Vui lòng đăng nhập để xem thông báo.</div>;

  return (
    <div className="p-6 bg-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Thông báo</h2>
            <Button onClick={() => setShowModal(true)}>
              <FaPlus className="inline-block mr-2" /> Thông báo mới
            </Button>
          </div>
          <div className="space-y-4">
            {paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notif) => (
                <Card
                  key={notif.id}
                  className="relative p-4 transition-transform transform hover:scale-[1.01] hover:shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4 mt-1">
                        <FaBell className="text-xl text-blue-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-gray-800">{notif.title}</h3>
                        <div className="text-sm text-gray-500 my-1">
                          <span className="font-medium">Gửi bởi: </span>
                          <span className="text-gray-700 font-semibold">{notif.senderInfo?.name}</span>
                          <span className="mx-1 text-gray-400">({notif.senderInfo?.role})</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="font-medium">Đến: </span>
                          <span className="text-gray-700 font-semibold">
                            {notif.receiver_role || `Lớp #${notif.receiver_class_id}`}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-gray-400 text-sm mt-2">{formatDate(notif.created_at)}</p>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteNotification(notif.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">Không có thông báo nào.</p>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Tạo thông báo mới"
        className="w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Gửi đến
            </label>
            <select
              value={newNotification.target}
              onChange={(e) =>
                setNewNotification({ ...newNotification, target: e.target.value })
              }
              className="border rounded p-2 w-full"
            >
              <option value="all">Tất cả học viên</option>
              {teacherClasses.map((cl) => (
                <option key={cl.class_id} value={cl.class_id}>
                  {cl.class_name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tiêu đề"
            id="modal-title"
            type="text"
            value={newNotification.title}
            onChange={(e) =>
              setNewNotification({ ...newNotification, title: e.target.value })
            }
            placeholder="Tiêu đề thông báo"
          />
          <TextArea
            label="Nội dung"
            value={newNotification.content}
            onChange={(e) =>
              setNewNotification({ ...newNotification, content: e.target.value })
            }
            placeholder="Nội dung chi tiết..."
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleModalClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              Tạo thông báo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherNotifications;
