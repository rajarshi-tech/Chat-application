import { Header } from "../components/Header";
import { Messages } from "../components/Messages";
import { Input } from "../components/Input";

export function ChatPage() {
  return (
    <>
      <Header />
      <Messages />
      <Input />
    </>
  );
}