-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProcessPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "price" REAL NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" INTEGER NOT NULL,
    "chefId" INTEGER NOT NULL,
    CONSTRAINT "ProcessPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessPost_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProcessPost" ("authorId", "chefId", "createdAt", "description", "id", "imageUrl", "ingredients", "isPublished", "price", "steps", "title", "updatedAt") SELECT "authorId", "chefId", "createdAt", "description", "id", "imageUrl", "ingredients", "isPublished", "price", "steps", "title", "updatedAt" FROM "ProcessPost";
DROP TABLE "ProcessPost";
ALTER TABLE "new_ProcessPost" RENAME TO "ProcessPost";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
