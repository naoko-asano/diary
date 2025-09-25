import prisma from "@/lib/database";

async function main() {
  const args = [
    {
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title: "title1",
        body: "body1",
      },
    },
    {
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        title: "title2",
        body: "body2",
      },
    },
  ];
  await prisma.$transaction(args.map((arg) => prisma.article.upsert(arg)));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
