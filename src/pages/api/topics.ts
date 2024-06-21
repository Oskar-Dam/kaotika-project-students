import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  const accessToken = session.accessToken;

  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/topics`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch topics:', response.statusText);
    return res.status(response.status).json({ error: 'Failed to fetch topics' });
  }

  const data = await response.json();
  console.log('Topics Data:', data);
  return res.status(200).json({ topics: data.topic || [] });
}