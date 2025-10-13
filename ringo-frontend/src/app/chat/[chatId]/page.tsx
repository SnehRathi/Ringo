import MainContainer from "../../../components/main-container/MainContainer";
import socket from "../../../utils/Socket";

export default function ChatPage() {
  return <MainContainer viewMode={1} socket={socket} />;
}
