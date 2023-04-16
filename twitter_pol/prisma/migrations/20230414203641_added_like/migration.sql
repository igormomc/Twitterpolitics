-- AlterTable
ALTER TABLE "User" ADD COLUMN "authorId" TEXT;

-- CreateTable
CREATE TABLE "Like" (
    "accountId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    PRIMARY KEY ("accountId", "postId")
);
