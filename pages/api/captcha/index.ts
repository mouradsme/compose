import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = JSON.parse(req.body);
  try {
    const response = await axios.post(
      `${process.env.RECAPTCHA_SITE_API}?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    );
    if (response.data.success) {
      return res.status(200).json({ message: 'success' });
    } else {
      return res.status(403).json({ message: 'failure' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying reCAPTCHA' });
  }
}
