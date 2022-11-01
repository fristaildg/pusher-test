import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

type ChatObject = {
  message: string;
  sender: string;
};

export default function Home() {
  const [chat, setChat] = useState<ChatObject[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY!, {
      cluster: 'eu',
    });
    const channel = pusher.subscribe('chat');

    channel.bind('chat-event', (data: ChatObject) => {
      setChat(prevChats => [...prevChats, data]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  const handleOnClick = async () => {
    fetch('/api/pusher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: inputRef.current && inputRef.current.value,
        sender: userNameRef.current && userNameRef.current.value,
      }),
    })
  };

  return (
    <div>
      <h1>Test App</h1>
      <label htmlFor="user">Username</label> <br />
      <input type="text" id="user" ref={userNameRef} /> <br />
      <input type="text" ref={inputRef} />
      <button onClick={handleOnClick}>
        send
      </button>
      <ul>
        {chat.map(({ sender, message }, index) => (
          <li key={index+sender}>
            <span>{sender}: {message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
