/*
  Warnings:

  - Added the required column `author` to the `OrderSlice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderSlice" ADD COLUMN     "author" TEXT NOT NULL;
