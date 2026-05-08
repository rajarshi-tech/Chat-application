import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import API from "../api";
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
    const storedMessages = await API.get("/messages");
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
    const response = await API.post("/messages", newMessage);
    await loadMessages();
    return response.data;
  };

  const deleteMessages = async () => {
    await API.delete("/messages");
    await loadMessages();
  }

  return (
    <MessagesContext.Provider value={{ messages, loadMessages, updateMessages, deleteMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
