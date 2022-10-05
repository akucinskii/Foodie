/*
  Warnings:

  - You are about to drop the column `details` on the `Order` table. All the data in the column will be lost.
  - Added the required column `author` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "details",
ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderSlice" (
    "id" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "OrderSlice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderSlice" ADD CONSTRAINT "OrderSlice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
