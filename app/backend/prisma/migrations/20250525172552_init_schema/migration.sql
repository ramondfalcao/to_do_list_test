BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updateAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Tasks] (
    [id] INT NOT NULL IDENTITY(1,1),
    [id_user] INT NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tasks_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updateAt] DATETIME2 NOT NULL,
    CONSTRAINT [Tasks_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tasks_description_key] UNIQUE NONCLUSTERED ([description])
);

-- AddForeignKey
ALTER TABLE [dbo].[Tasks] ADD CONSTRAINT [Tasks_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
