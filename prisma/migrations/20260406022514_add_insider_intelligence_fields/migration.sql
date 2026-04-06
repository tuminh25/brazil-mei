-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bestTime" TEXT,
ADD COLUMN     "insiderPrice" TEXT,
ADD COLUMN     "isNewsjack" BOOLEAN DEFAULT false,
ADD COLUMN     "secretTip" TEXT;

-- CreateIndex
CREATE INDEX "Post_isNewsjack_idx" ON "Post"("isNewsjack");
