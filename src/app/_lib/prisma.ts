import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof PrismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV != "production") globalThis.prismaGlobal = prisma;

// // @ts-nocheck
// import { PrismaClient } from "@prisma/client";

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma as any;
// }

// export default prisma;
