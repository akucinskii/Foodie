/*
  Warnings:

  - You are about to drop the column `author` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `OrderSlice` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `OrderSlice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderSlice" DROP COLUMN "author",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSlice" ADD CONSTRAINT "OrderSlice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
