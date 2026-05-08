import { Header } from "../components/Header";
import { Messages } from "../components/Messages";
import { Input } from "../components/Input";

export function ChatPage() {
  return (
    <div className="chat-page">
      <Header />
      <Messages />
      <Input />
    </div>
  );
}
