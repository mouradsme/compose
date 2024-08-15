import { ACCESS_TOKEN_NAME } from '@/common/config';
import { signinSchema } from '@/common/schemas';
import { singinStudentServer } from '@/lib/auth/login';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { student } = JSON.parse(req.body);
    try {
      await signinSchema.validate(student, { abortEarly: true });
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.errors.map((err) => {
          return { message: err };
        });
        return res.status(400).json({ errors });
      }
    }

    let response = undefined;
    try {
      response = await singinStudentServer(student);
      res.setHeader(
        'Set-Cookie',
        `${ACCESS_TOKEN_NAME}=${JSON.stringify({
          ...response.data,
          fullName: encodeURIComponent(response.data['fullName']),
        })}; SameSite=Strict; Path=/`
      );
      return res.status(200).json({
        message: 'You have signed in successfully, you will be redirected to dashboard soon',
      });
    } catch (err: any) {
      const errors = err.response.data?.errors;
      const status = err.response.status;
      return res.status(status).json({ errors });
    }
  }
}
