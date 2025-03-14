/*
  Warnings:

  - Added the required column `chatUuid` to the `AiChatHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AiChatHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageTypeEnum" AS ENUM ('TEXT', 'FILE');

-- AlterTable
ALTER TABLE "AiChatHistory" ADD COLUMN     "chatUuid" TEXT NOT NULL,
ADD COLUMN     "type" "MessageTypeEnum" NOT NULL;

-- CreateTable
CREATE TABLE "Chat" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Новый чат',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("uuid")
);
