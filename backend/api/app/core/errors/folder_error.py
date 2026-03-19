class FolderNameEmptyError(Exception):
    pass

class FolderNameTooLongError(Exception):
    pass

class FolderAlreadyExistsError(Exception):
    pass

class FolderNotFoundError(Exception):
    pass

class CannotMoveFolderIntoItselfError(Exception):
    pass

class CannotMoveFolderIntoChildError(Exception):
    pass