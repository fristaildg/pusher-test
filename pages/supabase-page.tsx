import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const SupabasePage = () => {
  const supabase = useSupabaseClient();
  const [currentMessages, setMessages] = useState<{ id: number, message: string, user_id: number, room_id: number, created_at: string }[] | null>([]);
  const [refresher, setRefresher] = useState(0);

  useEffect(() => {
    const getMessages = async () => {
      const messages = await supabase.from('messages').select();

      setMessages(messages.data);
    };

    getMessages();
  }, [refresher]);

  useEffect(() => {
    const channel = supabase.channel('db-messages');

    const roomId = 'room1';
    const userId = 'user1';

    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      },
      () => setRefresher(prevRef => prevRef + 1),
    );

    channel.subscribe(async (status) => {
      console.log('status', status);
    });

    return () => {
      channel.unsubscribe();
    }
  }, []);

  return (
    <>
      <h1>Supabase page</h1>
      <ul>
        {currentMessages?.map(({ id, message }) => (
          <li key={id}>
            <span>{message}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SupabasePage;
