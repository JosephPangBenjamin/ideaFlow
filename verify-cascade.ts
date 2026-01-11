import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing cascade deletion...');

  // 1. Find a test user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found to run test.');
    return;
  }

  // 2. Create an Idea
  const idea = await prisma.idea.create({
    data: {
      content: 'Cascade Test Idea',
      userId: user.id,
    },
  });
  console.log(`Created Idea: ${idea.id}`);

  // 3. Create a Task associated with the Idea
  const task = await prisma.task.create({
    data: {
      title: 'Cascade Test Task',
      userId: user.id,
      ideaId: idea.id,
    },
  });
  console.log(`Created Task: ${task.id}`);

  // 4. Create a Canvas associated with the Idea
  const canvas = await prisma.canvas.create({
    data: {
      name: 'Cascade Test Canvas',
      userId: user.id,
      ideaId: idea.id,
    },
  });
  console.log(`Created Canvas: ${canvas.id}`);

  // 5. Delete the Idea
  console.log(`Deleting Idea: ${idea.id}...`);
  await prisma.idea.delete({
    where: { id: idea.id },
  });

  // 6. Verify Task and Canvas are gone
  const taskCheck = await prisma.task.findUnique({ where: { id: task.id } });
  const canvasCheck = await prisma.canvas.findUnique({ where: { id: canvas.id } });

  if (!taskCheck && !canvasCheck) {
    console.log('SUCCESS: Task and Canvas were successfully deleted via cascade.');
  } else {
    console.error('FAILURE: Task or Canvas still exists!');
    if (taskCheck) console.error(`Task ${task.id} still exists.`);
    if (canvasCheck) console.error(`Canvas ${canvas.id} still exists.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
