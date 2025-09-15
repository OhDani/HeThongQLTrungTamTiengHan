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

const AssignmentModal = ({ assignment, user, onClose, onAction }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Lưu file name thay vì upload thật
  const [fileUrl, setFileUrl] = useState(assignment?.submission?.file_url ?? "");

  if (!assignment) return null;

  const { material_id, title, mode, submission, created_at, due_date, status } = assignment;

  // Lấy file từ input
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
    setError("");
  };

  // Nộp bài mới
  const handleSubmit = async () => {
    if (!file) { setError("Bạn chưa chọn file."); return; }
    setLoading(true);
    try {
      const fakeFile = `uploads/${file.name}`;
      const result = await submitAssignment(assignment.material_id, user.user_id, fakeFile);
      
      // Cập nhật submission trong assignment để lần sửa tiếp theo có submission_id
      assignment.submission = result;
      setFileUrl(result.file_url);
      onAction && onAction(result);
      setFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Không thể nộp bài.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async () => {
    if (!file) { setError("Bạn chưa chọn file mới."); return; }
    if (!assignment.submission?.id) return handleSubmit(); // dùng id thay cho submission_id
    setLoading(true);
    try {
      const fakeFile = `uploads/${file.name}`;
      const result = await updateAssignmentSubmission(
        assignment.submission.id,   // dùng id
        fakeFile
      );
  
      assignment.submission = result;
      setFileUrl(result.file_url);
      onAction && onAction(result);
      setFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Không thể cập nhật bài nộp.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Bạn muốn xóa bài nộp này?")) return;
    setLoading(true);
    try {
      if (assignment.submission?.id) {
        await deleteAssignmentSubmission(assignment.submission.id); // dùng id
      }
  
      assignment.submission = null;
      setFileUrl("");
      onAction && onAction({ material_id: assignment.material_id, file_url: "" });
      setFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Không thể xóa bài nộp.");
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
          <div className="space-y-3 pt-4">
            <p className="text-gray-600 text-xs">Chọn file để nộp bài tập:</p>
            <Input type="file" className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
                   onChange={handleFileChange} disabled={loading} />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} className={`px-4 py-2 bg-blue-600 text-white rounded ${loading ? "opacity-50" : ""}`} disabled={loading || !file}>
                {loading ? "Đang gửi..." : "Nộp bài tập"}
              </Button>
            </div>
            {fileUrl && <p className="text-green-600 text-xs mt-2">Đã nộp: <span>{fileUrl.split("/").pop()}</span></p>}
          </div>
        ) : (
          <div className="space-y-2 pt-3">
            {fileUrl && <p><strong>File bài nộp:</strong> <span className="text-blue-600 underline">{fileUrl.split("/").pop()}</span></p>}
            <Input type="file" className="block w-full border border-gray-300 rounded px-3 py-2 text-sm"
                   onChange={handleFileChange} disabled={loading} />
            <div className="flex gap-3 justify-end mt-4">
              <Button onClick={handleUpdate} className={`px-4 py-2 bg-yellow-500 text-white rounded ${loading ? "opacity-50" : ""}`} disabled={loading || !file}>
                {loading ? "Đang gửi..." : "Sửa bài nộp"}
              </Button>
              <Button onClick={handleDelete} className={`px-4 py-2 bg-red-500 text-white rounded ${loading ? "opacity-50" : ""}`} disabled={loading}>
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