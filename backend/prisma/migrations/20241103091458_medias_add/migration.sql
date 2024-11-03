-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
