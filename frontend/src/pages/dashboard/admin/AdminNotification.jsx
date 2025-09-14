import React, { useState, useEffect } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Pagination from "../../../components/common/Pagination";
import Input from "../../../components/common/Input";
import Textarea from "../../../components/common/Textarea";
import Modal from "../../../components/common/Modal";
import { FaPlus, FaBell, FaTrash } from "react-icons/fa";
import { notificationApi, userApi } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

const AdminNotifications = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newNotification, setNewNotification] = useState({
        title: "",
        recipients: ["Học viên"],
        content: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const recipientOptions = [
        { value: "Học viên", label: "Học viên" },
        { value: "Giảng viên", label: "Giảng viên" },
        { value: "Quản lý học vụ", label: "Quản lý học vụ" },
        { value: "Quản lý hệ thống", label: "Quản lý hệ thống" },
    ];

    useEffect(() => {
        const fetchNotificationsAndUsers = async () => {
            try {
                if (authLoading || !isAuthenticated) return;
                setLoading(true);

                const notificationsData = await notificationApi.getAll();
                const senderIds = [...new Set(notificationsData.map(notif => notif.sender_id))];
                const senderResults = await Promise.all(senderIds.map(id => userApi.getById(id)));

                const senderMap = Object.fromEntries(
                    senderResults.flatMap(result => result.length > 0 ? [[result[0].user_id, result[0]]] : [])
                );

                const notificationsWithSenderInfo = notificationsData.map(notif => {
                    const sender = senderMap[notif.sender_id];
                    const senderInfo = sender
                        ? { name: sender.full_name || "Không xác định", role: sender.role || "Không xác định" }
                        : { name: "Không xác định", role: "Không xác định" };
                    return { ...notif, senderInfo };
                });

                setNotifications(notificationsWithSenderInfo);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                console.error("Lỗi khi tải dữ liệu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationsAndUsers();
    }, [authLoading, isAuthenticated]);

    const handleModalClose = () => {
        setShowModal(false);
        setNewNotification({ title: "", recipients: ["Học viên"], content: "" });
    };

    const handleRecipientChange = (e) => {
        const { value, checked } = e.target;
        setNewNotification(prev => ({
            ...prev,
            recipients: checked
                ? [...prev.recipients, value]
                : prev.recipients.filter(recipient => recipient !== value),
        }));
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
                sender_id: user.user_id, // Lấy user_id từ AuthContext
                title: newNotification.title,
                message: newNotification.content,
                receiver_role: newNotification.recipients.join(", "),
                receiver_id: null,
                created_at: new Date().toISOString(),
            };
            const createdNotification = await notificationApi.create(notificationData);
            const newNotifWithInfo = {
                ...createdNotification,
                senderInfo: {
                    name: user.full_name,
                    role: user.role
                }
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
                setNotifications(notifications.filter((notif) => notif.id !== notificationId));
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
    const paginatedNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (loading || authLoading) return <div className="p-6 text-center text-gray-500">Đang tải thông báo...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
    if (!isAuthenticated) return <div className="p-6 text-center text-red-500">Vui lòng đăng nhập để xem thông báo.</div>;

    return (
        <div className="p-6 bg-blue-100">
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
                                                    <span className="text-gray-700 font-semibold">{notif.receiver_role}</span>
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Đối tượng nhận</label>
                        <div className="flex flex-wrap gap-4">
                            {recipientOptions.map((option) => (
                                <div key={option.value} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`recipient-${option.value}`}
                                        name="recipients"
                                        value={option.value}
                                        checked={newNotification.recipients.includes(option.value)}
                                        onChange={handleRecipientChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`recipient-${option.value}`} className="ml-2 text-gray-700">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Input
                        label="Tiêu đề"
                        id="modal-title"
                        type="text"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        placeholder="Tiêu đề thông báo"
                    />
                    <Textarea
                        label="Nội dung"
                        value={newNotification.content}
                        onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                        placeholder="Nội dung chi tiết..."
                    />
                    <div className="mt-4 flex justify-end gap-2">
                        <Button type="button" variant="secondary" onClick={handleModalClose}>Hủy</Button>
                        <Button type="submit" variant="primary">Tạo thông báo</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminNotifications;
