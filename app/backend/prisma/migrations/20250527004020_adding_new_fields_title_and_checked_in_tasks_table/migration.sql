/*
  Warnings:

  - Added the required column `title` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Tasks] ADD [checked] BIT NOT NULL CONSTRAINT [Tasks_checked_df] DEFAULT 0,
[title] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
