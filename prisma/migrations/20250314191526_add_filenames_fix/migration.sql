-- AlterTable
ALTER TABLE "AiChatHistory" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "filenames" SET DEFAULT ARRAY[]::TEXT[];
