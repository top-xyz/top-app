import { database } from '@repo/database';

export const GET = async () => {
  const newUser = await database.user.create({
    data: {
      name: 'cron-temp',
      email: 'cron-temp@test.com',
    },
  });

  await database.user.delete({
    where: {
      id: newUser.id,
    },
  });

  return new Response('OK', { status: 200 });
};
