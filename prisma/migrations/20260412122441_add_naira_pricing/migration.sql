-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'crypto';

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "priceNgn" DOUBLE PRECISION NOT NULL DEFAULT 0;
