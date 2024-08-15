import { singupSchema } from '@/common/schemas';
import { registerStudentServer } from '@/lib/auth/register';
import { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { student } = JSON.parse(req.body);
    try {
      await singupSchema.validate(student, { abortEarly: true });
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.errors.map((err) => {
          return { message: err };
        });
        return res.status(400).json({ errors });
      }
    }

    try {
      await registerStudentServer(student);
    } catch (err: any) {
      const errors = err.response.data?.errors;
      const status = err.response.status;
      return res.status(status).json({ errors });
    }
    return res
      .status(200)
      .json({ message: 'User created successfully, we will redirect you to login page soon' });
  }
}
