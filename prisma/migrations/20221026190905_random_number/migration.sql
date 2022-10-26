-- CreateTable
CREATE TABLE "randomNumber" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL,

    CONSTRAINT "randomNumber_pkey" PRIMARY KEY ("id")
);
