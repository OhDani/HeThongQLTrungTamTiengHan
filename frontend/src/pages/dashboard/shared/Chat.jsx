import React, { useEffect, useState } from "react";
import { FaSmile, FaPaperPlane } from "react-icons/fa";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import { useAuth } from "../../../contexts/AuthContext";
import {
  conversationApi,
  conversationmemberApi,
  messageApi,
  userApi,
} from "../../../services/api";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-500 bg-white">
          <h2 className="text-lg font-semibold">Đã xảy ra lỗi!</h2>
          <p>{this.state.error.message}</p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Chat = () => {
  const { user, isAuthenticated, initializing } = useAuth();
  const currentUserId = user ? user.user_id : null;

  const [conversations, setConversations] = useState([]);
  const [conversationMembers, setConversationMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [filteredConversations, setFilteredConversations] = useState([]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chưa đăng nhập. Vui lòng đăng nhập để sử dụng chat.
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convData, memberData, userData, msgData] = await Promise.all([
          conversationApi.getAll(),
          conversationmemberApi.getAll(),
          userApi.getAll(),
          messageApi.getAll(),
        ]);
        setConversations(convData || []);
        setConversationMembers(memberData || []);
        setUsers(userData || []);
        setAllMessages(msgData || []);
      } catch (_) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter((conv) => {
      const members = conversationMembers.filter(
        (m) => Number(m.conversation_id) === Number(conv.conversation_id)
      );
      const isMember = members.some(
        (m) => Number(m.user_id) === Number(currentUserId)
      );
      if (!isMember) return false;

      switch (filter) {
        case "unread":
          return allMessages.some(
            (msg) =>
              Number(msg.conversation_id) === Number(conv.conversation_id)
          );
        case "group":
          return conv.type === "Group";
        default:
          return true;
      }
    });
    setFilteredConversations(filtered);
  }, [conversations, conversationMembers, allMessages, currentUserId, filter]);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMsg = {
      conversation_id: selectedChat,
      user_id: currentUserId,
      content: message,
      file_url: null,
      created_at: new Date().toISOString(),
    };

    try {
      const saved = await messageApi.create(newMsg);
      setAllMessages((prev) => [...prev, saved]);
      setMessage("");
    } catch (_) {}
  };

  const getUserName = (userId) => {
    const user = users.find((u) => Number(u.user_id) === Number(userId));
    return user ? user.full_name : "Unknown";
  };

  const currentMessages = selectedChat
    ? allMessages.filter(
        (msg) => Number(msg.conversation_id) === Number(selectedChat)
      )
    : [];

  const handleChatClick = (conversationId) => {
    setSelectedChat(conversationId);
  };

  return (
    <ErrorBoundary>
      <div className="flex h-[680px]">
        {/* Sidebar */}
        <div className="w-1/4 border-r bg-blue-50 shadow-lg overflow-y-auto h-[680px]">
          <div className="p-4 border-b bg-gradient-to-r from-blue-100 to-white">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            >
              <option value="all">Tất cả</option>
              <option value="group">Nhóm</option>
            </select>
          </div>
          <div className="p-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <Card
                  key={conv.conversation_id}
                  className={`cursor-pointer mb-2 p-3 rounded-xl hover:bg-gray-100 transition ${
                    Number(selectedChat) === Number(conv.conversation_id)
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : ""
                  }`}
                >
                  <div
                    className="flex items-center"
                    onClick={() => handleChatClick(conv.conversation_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {conv.name ||
                          getUserName(
                            conversationMembers.find(
                              (m) =>
                                Number(m.conversation_id) ===
                                  Number(conv.conversation_id) &&
                                Number(m.user_id) !== Number(currentUserId)
                            )?.user_id
                          )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(conv.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-center">Không có hội thoại</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white shadow-md">
            {selectedChat ? (
              <h2 className="text-lg font-semibold text-gray-800">
                {conversations.find(
                  (c) => Number(c.conversation_id) === Number(selectedChat)
                )?.name ||
                  getUserName(
                    conversationMembers.find(
                      (m) =>
                        Number(m.conversation_id) === Number(selectedChat) &&
                        Number(m.user_id) !== Number(currentUserId)
                    )?.user_id
                  )}
              </h2>
            ) : (
              <h2 className="text-gray-500">Chọn một hội thoại</h2>
            )}
          </div>

          <div className="p-4 overflow-y-auto bg-gray-50 space-y-4 h-[550px] rounded-md">
            {selectedChat ? (
              currentMessages.length > 0 ? (
                currentMessages.map((msg) => {
                  const sender = users.find(
                    (u) => Number(u.user_id) === Number(msg.user_id)
                  );
                  return (
                    <div
                      key={msg.message_id}
                      className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                        Number(msg.user_id) === Number(currentUserId)
                          ? "bg-blue-200 text-gray-900 ml-auto"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <div className="flex items-end">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-[10px] opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()} •{" "}
                            {sender?.full_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center">Chưa có tin nhắn</p>
              )
            ) : (
              <p className="text-gray-500 text-center">
                Hãy chọn một hội thoại để xem tin
              </p>
            )}
          </div>

          {selectedChat && (
            <div className="p-4 border-t bg-white flex gap-2 items-center">
              <Button variant="secondary" size="sm" className="rounded-full p-2">
                <FaSmile />
              </Button>
              <Input
                noWrapper
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Button
                variant="primary"
                size="md"
                className="rounded-full p-2"
                onClick={handleSend}
              >
                <FaPaperPlane />
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chat;
