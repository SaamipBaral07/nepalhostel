"""
Custom DRF exception handler — normalises error responses to the shape
the frontend expects:  { message: string, errors?: Record<string, string[]> }
"""

from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    data = response.data

    if isinstance(data, list):
        response.data = {"message": str(data[0]) if data else "Error"}
    elif isinstance(data, dict):
        if "detail" in data:
            response.data = {"message": str(data["detail"])}
        else:
            # Pull out non-field errors to use as the top-level message
            non_field = data.pop("non_field_errors", None)
            message = str(non_field[0]) if non_field else "Validation failed."
            result = {"message": message}
            if data:
                result["errors"] = data
            response.data = result

    return response
