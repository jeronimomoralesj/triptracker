"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { MessageSquare, X, Send, User, ChevronDown } from "lucide-react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";

// Type definitions for messages and users
interface ChatMessage {
  id: string;
  nombre: string;
  message: string;
  createdAt?: Timestamp;
}

interface Viajero {
  nombre: string;
  personaje: string;
  descripcion: string;
  casa: string;
  imagen: string;
  houseColor: string;
}

// Enhanced viajeros array with house colors
const viajeros: Viajero[] = [
  {
    nombre: "Jerónimo",
    personaje: "Spiderman",
    descripcion: "El crack",
    casa: "Spiderman",
    imagen:
      "https://wallpapers.com/images/hd/spiderman-background-oycfyb1ksermw921.jpg",
    houseColor: "from-red-700 to-blue-700",
  },
  {
    nombre: "Sofía",
    personaje: "Baby Groot",
    descripcion: "Fiofilda",
    casa: "Guardianes de la Galaxia",
    imagen:
      "https://media.vanityfair.com/photos/590f7d985caad73f2ce0cc98/master/pass/bb-groot.jpg",
    houseColor: "from-green-600 to-amber-800",
  },
  {
    nombre: "Juan",
    personaje: "Tom Marvolo Riddle",
    descripcion: "Juancho",
    casa: "Death eaters",
    imagen:
      "https://contentful.harrypotter.com/usf1vwtuqyxm/yMwYMbczYDjbnbk1MpoHI/de2fec43140e0bb77fa40be23b1303ef/lord-voldemort-tom-riddle_1_1800x1248.png",
    houseColor: "from-emerald-800 to-gray-900",
  },
  {
    nombre: "Mateo",
    personaje: "Darth Vader",
    descripcion: "Mapedo",
    casa: "Galactic Evil Empire",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/9/9c/Darth_Vader_-_2007_Disney_Weekends.jpg",
    houseColor: "from-red-600 to-black",
  },
  {
    nombre: "Valeria",
    personaje: "Slinky",
    descripcion: "Vale",
    casa: "Toy Story",
    imagen:
      "https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-pzhioy_5a17fe4b.jpeg",
    houseColor: "from-blue-400 to-yellow-500",
  },
];

// Helper to get house colors based on user name
const getHouseColors = (nombre: string) => {
  const viajero = viajeros.find((v) => v.nombre === nombre);
  return viajero?.houseColor || "from-amber-600 to-red-800";
};

export default function Chat(): JSX.Element {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userSelectButtonRef = useRef<HTMLButtonElement>(null);
  const userSelectDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
    }
  }, [chatMessages, showChat]);

  // Set up Firestore listener to get messages in real time
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setChatMessages(messagesData);
    });
    return unsubscribe;
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        nombre: selectedUser,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  // Handle outside clicks for user selection dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSelectOpen &&
        userSelectDropdownRef.current &&
        userSelectButtonRef.current &&
        !userSelectDropdownRef.current.contains(event.target as Node) &&
        !userSelectButtonRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    if (isSelectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelectOpen]);

  // Toggle user selection dropdown
  const toggleUserSelect = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  // Handle selecting a user
  const handleUserSelect = (userName: string) => {
    setSelectedUser(userName);
    setIsSelectOpen(false);
  };

  // Format Firestore timestamp for display
  const formatTime = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Get current user image for the bubble button
  const currentUserImage = selectedUser
    ? viajeros.find((v) => v.nombre === selectedUser)?.imagen
    : "/api/placeholder/48/48";

  // Find selected user details (if any)
  const selectedUserDetails = selectedUser
    ? viajeros.find((v) => v.nombre === selectedUser)
    : null;

  return (
    <>
      <AnimatePresence>
        {showChat ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-999 flex flex-col bg-[url('/hogwarts-bg.jpg')] bg-cover bg-center"
          >
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

            {/* Chat header */}
            <header className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-amber-800 to-red-900 shadow-lg z-99">
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif">
                  Mensagero del viaje
                </h2>
              </div>
              <motion.button
                onClick={() => setShowChat(false)}
                className="p-2 rounded-full bg-slate-800/50 text-amber-300 hover:bg-slate-700 hover:text-amber-200 transition-colors duration-300"
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </header>

            {/* Chat messages display */}
            <main
              ref={chatContainerRef}
              className="relative flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 z-0"
            >
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <img
                    src="/owl-post.png"
                    alt="Owl Post"
                    className="w-24 h-24 opacity-70 mb-4"
                  />
                  <p className="text-amber-200 font-serif text-lg">
                    No messages yet. Send the first owl post!
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const sender = viajeros.find((v) => v.nombre === msg.nombre);
                  const isCurrentUser = msg.nombre === selectedUser;
                  const messageTime = formatTime(msg.createdAt);

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(0.1 * (index % 6), 0.5),
                        duration: 0.3,
                      }}
                      className={`flex items-start gap-3 max-w-3xl ${
                        isCurrentUser ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0">
                          <img
                            src={sender?.imagen || "/api/placeholder/48/48"}
                            alt={msg.nombre}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-600 shadow-md"
                          />
                        </div>
                      )}

                      <div className="max-w-xs md:max-w-md lg:max-w-lg">
                        <div
                          className={`relative p-3 rounded-lg shadow-lg ${
                            isCurrentUser
                              ? `bg-gradient-to-br ${getHouseColors(
                                  msg.nombre
                                )} text-white rounded-tr-none`
                              : "bg-slate-800/90 text-amber-100 rounded-tl-none"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-sm">{msg.nombre}</p>
                            {messageTime && (
                              <p className="text-xs opacity-70">{messageTime}</p>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.message}
                          </p>
                          <div
                            className={`absolute ${
                              isCurrentUser ? "-right-2 top-0" : "-left-2 top-0"
                            } w-4 h-4 ${
                              isCurrentUser
                                ? `bg-gradient-to-br ${getHouseColors(
                                    msg.nombre
                                  )}`
                                : "bg-slate-800/90"
                            }`}
                            style={{
                              clipPath: isCurrentUser
                                ? "polygon(0 0, 100% 100%, 0 100%)"
                                : "polygon(100% 0, 100% 100%, 0 100%)",
                            }}
                          />
                        </div>
                      </div>

                      {isCurrentUser && (
                        <div className="flex-shrink-0">
                          <img
                            src={sender?.imagen || "/api/placeholder/48/48"}
                            alt={msg.nombre}
                            className="w-10 h-10 rounded-full object-cover border-2 border-amber-600 shadow-md"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </main>

            {/* Chat input form */}
            <form
              onSubmit={handleSendMessage}
              className="relative px-4 py-4 sm:px-6 sm:py-4 border-t border-amber-900/50 bg-gradient-to-b from-slate-900/80 to-slate-800/90 backdrop-blur-sm z-99"
            >
              {/* User Selection */}
              <div className="mb-3 relative">
                <button
                  ref={userSelectButtonRef}
                  type="button"
                  onClick={toggleUserSelect}
                  className="w-full flex items-center justify-between px-4 py-3 text-left bg-slate-800 text-amber-300 border border-amber-600 rounded-lg shadow-inner shadow-amber-900/30 transition-all duration-300 hover:bg-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {selectedUser ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUserDetails?.imagen || "/api/placeholder/48/48"}
                        alt={selectedUser}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500"
                      />
                      <div>
                        <span className="font-medium">{selectedUser}</span>
                        <span className="text-xs block text-amber-400/70">
                          {selectedUserDetails?.personaje}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-amber-400" />
                      <span className="font-medium">Selecciona tu usuario</span>
                    </div>
                  )}
                  <ChevronDown
                    size={18}
                    className={`text-amber-400 transition-transform duration-300 ${
                      isSelectOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isSelectOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-slate-900/60"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setIsSelectOpen(false);
                        }
                      }}
                    >
                      <motion.div
                        ref={userSelectDropdownRef}
                        className="bg-slate-800 border-2 border-amber-600 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4 border-b border-amber-700/30 bg-gradient-to-r from-amber-900 to-red-900">
                          <h3 className="text-lg font-bold text-amber-300 font-serif">
                            Escoge quien eres
                          </h3>
                        </div>
                        <div className="p-15 max-h-80 overflow-y-auto">
                          {viajeros.map((user) => (
                            <motion.div
                              key={user.nombre}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleUserSelect(user.nombre)}
                              className={`flex items-center gap-3 p-3 m-1 cursor-pointer rounded-lg transition-colors duration-200 ${
                                selectedUser === user.nombre
                                  ? `bg-gradient-to-br ${user.houseColor} text-white`
                                  : "hover:bg-slate-700"
                              }`}
                            >
                              <div className="relative flex-shrink-0">
                                <img
                                  src={user.imagen}
                                  alt={user.nombre}
                                  className={`w-12 h-12 rounded-full object-cover border-2 ${
                                    selectedUser === user.nombre
                                      ? "border-white"
                                      : "border-amber-500"
                                  } shadow-md`}
                                />
                                {selectedUser === user.nombre && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border border-white flex items-center justify-center">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-white"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-semibold">{user.nombre}</p>
                                <div className="flex flex-col">
                                  <p className="text-xs opacity-90">{user.personaje}</p>
                                  <p className="text-xs opacity-75">{user.casa}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-amber-700/30 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setIsSelectOpen(false)}
                            className="px-4 py-2 bg-slate-700 text-amber-300 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative mb-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Manda tu mensaje..."
                  className="w-full p-4 pr-12 border-2 border-amber-600 rounded-lg bg-slate-800 text-amber-100 placeholder-amber-400/70 resize-none shadow-inner shadow-amber-900/30 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-300"
                  rows={3}
                />
                <div className="absolute right-3 bottom-3 flex gap-2">
                  <button
                    type="submit"
                    disabled={!selectedUser || !message.trim()}
                    className={`p-2 rounded-lg ${
                      !selectedUser || !message.trim()
                        ? "bg-slate-700 text-slate-500"
                        : "bg-amber-600 text-white hover:bg-amber-500"
                    } transition-colors duration-300`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setShowChat(true)}
            className="fixed bottom-6 left-6 z-999 group"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-600 to-red-800 shadow-lg shadow-amber-900/30 border-2 border-amber-500"
              >
                {selectedUser ? (
                  <img
                    src={currentUserImage}
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300"
                  />
                ) : (
                  <MessageSquare size={28} className="text-amber-100" />
                )}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-400/20 to-red-500/20 transition-opacity duration-300"></div>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float-particle ${3 + Math.random() * 2}s infinite ${
                          Math.random() * 2
                        }s`,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              {chatMessages.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 border border-amber-300 flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-white">
                    {chatMessages.length > 99 ? "99+" : chatMessages.length}
                  </span>
                </motion.div>
              )}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-slate-800 text-amber-300 px-3 py-1 rounded-lg shadow-lg whitespace-nowrap text-sm">
                  Abre el mensaje mágico
                </div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-15px) translateX(5px);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
