-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "amount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "customerId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ProcessPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "customerId", "id", "postId", "status", "updatedAt") SELECT "createdAt", "customerId", "id", "postId", "status", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_ProcessPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "imageUrl" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "chefId" INTEGER NOT NULL,
    CONSTRAINT "ProcessPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessPost_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProcessPost" ("authorId", "chefId", "createdAt", "description", "id", "imageUrl", "ingredients", "isPublished", "steps", "title", "updatedAt") SELECT "authorId", "chefId", "createdAt", "description", "id", "imageUrl", "ingredients", "isPublished", "steps", "title", "updatedAt" FROM "ProcessPost";
DROP TABLE "ProcessPost";
ALTER TABLE "new_ProcessPost" RENAME TO "ProcessPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
