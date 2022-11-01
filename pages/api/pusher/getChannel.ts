import { NextApiRequest, NextApiResponse } from "next";
import { createHmac } from 'crypto';
import requestIp from 'request-ip';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ip = requestIp.getClientIp(req);
  const useragent = req.headers['user-agent'] || '';
  const channel = createHmac('sha256', ip+useragent).digest('hex');
  res.json(channel);
};

export default handler;
