const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const dests = await prisma.destination.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      latitude: true,
      longitude: true,
      metadata: true
    }
  });
  console.log("DB_RESULTS_START");
  console.log(JSON.stringify(dests, null, 2));
  console.log("DB_RESULTS_END");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
