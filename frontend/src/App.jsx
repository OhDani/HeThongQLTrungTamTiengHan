// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Button from "./components/common/Button";
import Alert from "./components/common/Alert";
import Card from "./components/common/Card";
import Input from "./components/common/Input";
import Textarea from "./components/common/TextArea";
import { Select } from "./components/common/FormField";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Modal from "./components/common/Modal";
import Toast from "./components/common/Toast";
import Pagination from "./components/common/Pagination";
import Table from "./components/common/Table";
import DashboardHeader from "./components/layout/DashboardHeader";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "beginner",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu bảng
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên học viên" },
    { key: "level", label: "Trình độ" },
    { key: "description", label: "Mô tả" },
  ];

  const data = [
    { id: 1, name: "Kim", level: "Beginner", description: "Học viên mới" },
    {
      id: 2,
      name: "Lee",
      level: "Intermediate",
      description: "Đang học nâng cao",
    },
    { id: 3, name: "Park", level: "Advanced", description: "Sắp thi TOPIK" },
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastVisible(true);
    }, 1000);
  };
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <DashboardHeader />

          {/* Nội dung chính */}
          <main className="flex-1 p-8 space-y-6">
            {alertVisible && (
              <Alert
                type="info"
                message="Đây là thông báo hệ thống!"
                onClose={() => setAlertVisible(false)}
              />
            )}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Thêm học viên mới</h2>
              <Input
                label="Tên học viên"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên học viên..."
              />
              <Textarea
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả học viên..."
              />
              <Select
                label="Trình độ"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
              <div className="mt-4 flex items-center space-x-4">
                <Button onClick={handleSubmit} variant="primary">
                  Thêm học viên
                </Button>
                {loading && <LoadingSpinner />}
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Danh sách học viên</h2>
              <Table columns={columns} data={data} />
              <Pagination
                currentPage={currentPage}
                totalPages={3}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </Card>

            {/* Modal */}
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Mở Modal
            </Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal demo"
            >
              <p className="pb-6">
                Đây là nội dung modal. Bạn có thể đặt form hoặc thông tin tại
                đây.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setModalOpen(false)}>Đóng</Button>
              </div>
            </Modal>

            {/* Toast */}
            {toastVisible && (
              <Toast
                message="Thêm học viên thành công!"
                type="success"
                onClose={() => setToastVisible(false)}
              />
            )}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
