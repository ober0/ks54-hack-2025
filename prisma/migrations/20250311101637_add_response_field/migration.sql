/*
  Warnings:

  - Added the required column `response` to the `CheatSheets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheatSheets" ADD COLUMN     "response" TEXT NOT NULL;
