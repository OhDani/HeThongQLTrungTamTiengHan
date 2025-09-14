import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import {
  submitAssignment,
  updateAssignmentSubmission,
  deleteAssignmentSubmission
} from "../../../services/studentService";

// Helper định dạng ngày giờ (hh:mm dd/MM/yyyy)
const fmtVNDate = (d) => {
  if (!d) return "Không có";
  const date = new Date(d);
  return (
    ('0' + date.getHours()).slice(-2) + ":" +
    ('0' + date.getMinutes()).slice(-2) + " " +
    ('0' + (date.getMonth() + 1)).slice(-2) + "/" +
    date.getFullYear()
  );
};

const AssignmentModal = ({ assignment, onClose, onAction }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Hiển thị file đã nộp (cập nhật sau sửa/nộp nếu BE trả về file_url mới)
  const [fileUrl, setFileUrl] = useState(assignment?.submission?.file_url ?? "");

  if (!assignment) return null;

  const { material_id, title, mode, submission, created_at, due_date, status } = assignment;

  // Lấy file từ event
  const handleFileChange = (e) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
    setError(""); // reset lỗi khi upload lại
  };

  // Nộp bài mới
  const handleSubmit = async () => {
    if (!file) {
      setError("Bạn chưa chọn file.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Nếu BE trả về file_url mới thì cập nhật, không thì dùng như cũ
      const res = await submitAssignment(material_id, file);
      if (res?.file_url) setFileUrl(res.file_url);
      onAction && onAction();
      setFile(null); // reset sau upload
      onClose();
    } catch (err) {
      setError("Không thể nộp bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Sửa bài nộp (upload lại file khác)
  const handleUpdate = async () => {
    if (!file) {
      setError("Bạn chưa chọn file mới.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await updateAssignmentSubmission(material_id, file);
      if (res?.file_url) setFileUrl(res.file_url);
      onAction && onAction();
      setFile(null);
      onClose();
    } catch (err) {
      setError("Không thể sửa bài.");
    } finally {
      setLoading(false);
    }
  };

  // Xóa bài nộp
  const handleDelete = async () => {
    if (!window.confirm("Bạn muốn xóa bài nộp này?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteAssignmentSubmission(material_id);
      setFileUrl("");
      onAction && onAction();
      setFile(null);
      onClose();
    } catch (err) {
      setError("Không thể xóa bài.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={!!assignment} onClose={onClose} title={title} backdropClassName="bg-gray-600/10 backdrop-blur-sm">
      <div className="space-y-3 text-sm">
        <div>
          <div className="font-semibold">{title}</div>
          <div><strong>Ngày gửi:</strong> {fmtVNDate(created_at)}</div>
          <div><strong>Hạn nộp:</strong> {fmtVNDate(due_date)}</div>
          <div>
            <strong>Trạng thái:</strong>{" "}
            <span className={
              status === "Đã nộp" ? "text-green-600" :
              status === "Chưa nộp" ? "text-red-600" :
              status === "Nộp trễ" ? "text-orange-600" :
              "text-gray-700"
            }>
              {status}
            </span>
          </div>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        
        {(mode === "submit" || status === "Chưa nộp") ? (
          // THÊM mới
          <div className="space-y-3 pt-4">
            <p className="text-gray-600 text-xs">Chọn file để nộp bài tập:</p>
            <Input
              type="file"
              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              onChange={handleFileChange}
              disabled={loading}
              // KHÔNG truyền value nếu là type="file"! (mặc định Input không nhận value ở type=file)
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded ${loading ? "opacity-50" : ""}`}
                disabled={loading || !file}
              >
                {loading ? "Đang gửi..." : "Nộp bài tập"}
              </Button>
            </div>
            {fileUrl && (
              <p className="text-green-600 text-xs mt-2">
                Đã nộp: <a href={fileUrl} target="_blank" rel="noreferrer">{fileUrl.split("/").pop()}</a>
              </p>
            )}
          </div>
        ) : (
          // SỬA bài nộp
          <div className="space-y-2 pt-3">
            {(fileUrl || submission?.file_url) && (
              <p>
                <strong>File bài nộp:</strong>{" "}
                <a
                  href={fileUrl || submission.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {(fileUrl || submission.file_url).split("/").pop()}
                </a>
              </p>
            )}
            <Input
              type="file"
              className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              onChange={handleFileChange}
              disabled={loading}
              // KHÔNG truyền value!
            />
            <div className="flex gap-3 justify-end mt-4">
              <Button
                onClick={handleUpdate}
                className={`px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded ${loading ? "opacity-50" : ""}`}
                disabled={loading || !file}
              >
                {loading ? "Đang gửi..." : "Sửa bài nộp"}
              </Button>
              <Button
                onClick={handleDelete}
                className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded ${loading ? "opacity-50" : ""}`}
                disabled={loading}
              >
                {loading ? "Đang xóa..." : "Xóa bài nộp"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignmentModal;