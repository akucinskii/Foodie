-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToRestaurantMenuItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToRestaurantMenuItem_AB_unique" ON "_CategoryToRestaurantMenuItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToRestaurantMenuItem_B_index" ON "_CategoryToRestaurantMenuItem"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToRestaurantMenuItem" ADD CONSTRAINT "_CategoryToRestaurantMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToRestaurantMenuItem" ADD CONSTRAINT "_CategoryToRestaurantMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "RestaurantMenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
