-- CreateTable
CREATE TABLE "Files" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "CheatSheets" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "filesUuid" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheatSheets_pkey" PRIMARY KEY ("uuid")
);
