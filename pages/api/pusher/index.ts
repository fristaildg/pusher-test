import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";

export const pusher = new Pusher({
  appId: process.env.app_id!,
  key: process.env.key!,
  secret: process.env.secret!,
  cluster: process.env.cluster!,
  useTLS: true,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { message, sender, channelName } = req.body;
  const response = await pusher.trigger(channelName, 'chat-event', {
    message,
    sender,
  });

  res.json(response);
};

export default handler;
