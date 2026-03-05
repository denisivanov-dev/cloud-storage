class ValidationError(Exception):
    def __init__(self, errors: dict):
        self.errors = errors


class InvalidCredentialsError(Exception):
    def __init__(self, errors: dict):
        self.errors = errors