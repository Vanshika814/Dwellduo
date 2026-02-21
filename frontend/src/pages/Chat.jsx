import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { fetchUserProfile } from "../store/slices/authSlice";
import { MessageCircle, ArrowLeft } from "lucide-react";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const withId = searchParams.get("with");
  const withName = searchParams.get("name") || "User";

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const listRef = useRef(null);
  const stompRef = useRef(null);
  const withIdRef = useRef(withId);
  const loadConversationsRef = useRef(() => {});

  withIdRef.current = withId;

  useEffect(() => {
    if (!currentUser) dispatch(fetchUserProfile());
  }, [currentUser, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !currentUser?.id) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        setWsConnected(true);
        client.subscribe("/user/queue/messages", (frame) => {
          try {
            const msg = JSON.parse(frame.body);
            const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            if (String(otherId) === String(withIdRef.current)) {
              setMessages((prev) => {
                const withoutTemp = prev.filter((m) => !String(m.id).startsWith("temp-"));
                if (withoutTemp.some((m) => m.id === msg.id)) return withoutTemp;
                return [...withoutTemp, msg];
              });
            }
            loadConversationsRef.current();
          } catch (e) {
            console.error(e);
          }
        });
      },
      onDisconnect: () => setWsConnected(false),
      onStompError: (frame) => console.error("STOMP error", frame),
    });
    stompRef.current = client;
    client.activate();
    return () => {
      client.deactivate();
      stompRef.current = null;
    };
  }, [currentUser?.id]);

  const loadConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      const ids = res.data?.data || [];
      const list = [];
      for (const id of ids) {
        try {
          const u = await api.get(`/users/${id}`);
          list.push({ id, name: u.data?.data?.name || `User ${id}` });
        } catch {
          list.push({ id, name: `User ${id}` });
        }
      }
      setConversations(list);
    } catch (e) {
      console.error(e);
      setConversations([]);
    } finally {
      setLoadingList(false);
    }
  };

  loadConversationsRef.current = loadConversations;

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!withId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    api
      .get(`/messages/conversation/${withId}`)
      .then((res) => {
        setMessages(res.data?.data || []);
      })
      .catch((e) => {
        console.error(e);
        setMessages([]);
      })
      .finally(() => setLoadingMessages(false));
  }, [withId]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !withId || sending) return;
    setSending(true);
    setInput("");
    const receiverId = Number(withId);
    setMessages((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, content: text, senderId: currentUser?.id, receiverId, _optimistic: true },
    ]);
    const client = stompRef.current;
    if (client?.connected) {
      try {
        client.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({ receiverId, content: text }),
        });
        loadConversations();
      } catch (err) {
        console.error(err);
        setInput(text);
        setMessages((prev) => prev.filter((m) => !m._optimistic));
      } finally {
        setSending(false);
      }
    } else {
      try {
        await api.post("/messages", { receiverId, content: text });
        const res = await api.get(`/messages/conversation/${withId}`);
        setMessages(res.data?.data || []);
        loadConversations();
      } catch (err) {
        console.error(err);
        setInput(text);
        setMessages((prev) => prev.filter((m) => !m._optimistic));
      } finally {
        setSending(false);
      }
    }
  };

  const openConversation = (id, name) => {
    setSearchParams({ with: String(id), name: name || `User ${id}` });
  };

  const goBackToList = () => {
    setSearchParams({});
  };

  return (
    <div
      className="min-h-screen w-full max-w-[100vw] overflow-x-hidden"
      style={{
        backgroundImage: 'url("/Group 21.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />
      <div className="flex flex-col h-[100dvh] sm:h-screen w-full max-w-[100vw] pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 lg:px-10 pb-3 sm:pb-4 box-border min-w-0">
        <h1 className="shrink-0 text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
          Chat
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] grid-rows-[1fr_1fr] md:grid-rows-1 gap-3 sm:gap-4 min-h-0 flex-1">
          {/* Conversation list - full page on mobile when no chat selected */}
          <div
            className={`w-full min-w-0 bg-white rounded-xl border border-slate-200 shadow-sm p-2 min-h-0 overflow-y-auto ${withId ? "hidden md:block" : "row-span-2 md:row-auto min-h-0"}`}
          >
            <p className="text-md font-medium text-slate-500 px-2 py-1">Conversations</p>
            {loadingList && conversations.length === 0 ? (
              <p className="text-sm text-slate-400 p-2">Loading...</p>
            ) : (() => {
              const list = [...conversations];
              if (withId && !list.some((c) => String(c.id) === String(withId))) {
                list.unshift({ id: Number(withId), name: withName });
              }
              return list.length === 0 ? (
                <p className="text-sm text-slate-400 p-2">No conversations yet. Start from a match.</p>
              ) : (
                list.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openConversation(c.id, c.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-md transition-colors ${
                      withId === String(c.id) ? "bg-[#EEEEDF] text-sky-800" : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {c.name}
                  </button>
                ))
              );
            })()}
          </div>

          {/* Message area - full page on mobile when chat selected */}
          <div
            className={`flex flex-col rounded-xl shadow-sm min-h-0 min-w-0 overflow-hidden bg-white border border-slate-200 ${!withId ? "hidden md:flex" : "row-span-2 md:row-auto flex min-h-0"}`}
          >
            {!withId ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs sm:text-sm p-3 sm:p-4 text-center">
                Select a conversation or open chat from a match card.
              </div>
            ) : (
              <>
                <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-slate-200 bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goBackToList}
                    className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <p className="font-medium text-slate-800 truncate text-sm sm:text-base flex-1 min-w-0">{withName}</p>
                </div>
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0 min-w-0"
                >
                  {loadingMessages ? (
                    <p className="text-sm text-slate-400">Loading messages...</p>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId === currentUser?.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                              isMe ? "bg-[#EEEEDF] text-slate-800" : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <p className="break-words">{m.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <form onSubmit={sendMessage} className="shrink-0 p-2 sm:p-3 border-t border-slate-200 flex gap-2 min-w-0">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 min-w-0 rounded-3xl border border-slate-300 px-3 py-2 sm:py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="rounded-lg bg-sky-500 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50 shrink-0"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
