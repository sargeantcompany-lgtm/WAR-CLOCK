import { prisma } from "../config/db";

export const settingRepository = {
  upsert(key: string, value: string) {
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },
};
