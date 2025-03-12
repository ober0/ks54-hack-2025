/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Chat";

-- CreateTable
CREATE TABLE "Notification" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "notification" TEXT NOT NULL,
    "when" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("uuid")
);
