import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

type ChatObject = {
  message: string;
  sender: string;
};

export default function Home() {
  const [chat, setChat] = useState<ChatObject[]>([]);
  const [uuid, setUuid] = useState('123');
  const inputRef = useRef<HTMLInputElement>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<HTMLInputElement>(null);
  const channelName = channelRef.current?.value || uuid;

  useEffect(() => {
    const getUuid = async () => {
      const response = await fetch('/api/pusher/getChannel');
      const id = await response.json();
      setUuid(id);
    };
    getUuid();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY!, {
      cluster: 'eu',
    });


    const channel = pusher.subscribe(channelName);

    channel.bind_global((eventName: unknown, data: unknown) => {
      console.log(eventName, data);
    });

    channel.bind('chat-event', (data: ChatObject) => {
      setChat(prevChats => [...prevChats, data]);
    });


    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelRef.current?.value]);

  const handleOnClick = async () => {
    fetch('/api/pusher', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelName: channelName,
        message: inputRef.current && inputRef.current.value,
        sender: userNameRef.current && userNameRef.current.value,
      }),
    })
  };

  return (
    <div>
      <h1>Test App</h1>
      <h2>{uuid}</h2>
      <input type="text" ref={channelRef} />
      <label htmlFor="user">Username</label> <br />
      <input type="text" id="user" ref={userNameRef} /> <br /> <br />
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
