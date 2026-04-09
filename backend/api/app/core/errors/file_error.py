class FileNameEmptyError(Exception):
    pass

class FileNameTooLongError(Exception):
    pass

class FileAlreadyExistsError(Exception):
    pass

class FileNotFoundError(Exception):
    pass