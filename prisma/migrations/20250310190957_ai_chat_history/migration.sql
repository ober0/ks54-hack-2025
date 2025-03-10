-- CreateTable
CREATE TABLE "AiChatHistory" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "AiChatHistory_pkey" PRIMARY KEY ("uuid")
);
