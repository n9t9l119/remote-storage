from rest_framework.exceptions import ParseError, ValidationError


class JsonParseError(ParseError):
    def __init__(self, detail: str):
        super(JsonParseError, self).__init__({"error": {"text": detail}})


class JsonValidationError(ValidationError):
    def __init__(self, detail: str):
        super(ValidationError, self).__init__({"error": {"text": detail}})
