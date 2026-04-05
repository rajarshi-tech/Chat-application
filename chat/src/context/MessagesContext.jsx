import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
// eslint-disable-next-line react-refresh/only-export-components
export const MessagesContext = createContext({
  messages: [],
  loadMessages: () => {},
  updateMessages: () => {},
  deleteMessages: () => {}
});

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  const loadMessages = useCallback(async () => {
    const storedMessages = await axios.get("/api/messages");
    setMessages(storedMessages.data);
    // console.log("Messages loaded:", storedMessages.data);
  }, []);

  useEffect(() => {
    const isChatRoute = location.pathname !== "/" && location.pathname !== "/login";

    if (!isChatRoute) {
      return undefined;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMessages();

    const intervalId = setInterval(() => {
      void loadMessages();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [loadMessages, location.pathname]);


  const updateMessages = async (newMessage) => {
    await axios.post("/api/messages", newMessage);
    await loadMessages();
  };

  const deleteMessages = async () => {
    await axios.delete("/api/messages");
    await loadMessages();
  }

  return (
    <MessagesContext.Provider value={{ messages, loadMessages, updateMessages, deleteMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
