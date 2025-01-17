-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TEXT,
ADD COLUMN     "verifyEmail" BOOLEAN NOT NULL DEFAULT false;
