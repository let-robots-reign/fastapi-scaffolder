import pytest
from datamodel_code_generator.parser.openapi import OpenAPIParser

api_file = open("../example.yml", "r", encoding="utf8")
api_file_text = api_file.read()


@pytest.fixture
def openapi_parser():
    return OpenAPIParser(api_file_text)


def test_parse_info(openapi_parser):
    info = openapi_parser.parse_info()
    # Проверка наличия возвращаемого значения
    assert info is not None
    # Проверка типа возвращаемого значения
    assert isinstance(info, dict)
    # Проверка наличия обязательных полей
    assert 'title' in info
    assert 'version' in info
    # Проверка типов значений полей
    assert isinstance(info['title'], str)
    assert isinstance(info['version'], str)
    # Проверка, что остальные поля (необязательные) также имеют правильные типы
    if 'description' in info:
        assert isinstance(info['description'], str)
    if 'contact' in info:
        assert isinstance(info['contact'], dict)
        # Проверка типов значений полей контакта
        assert isinstance(info['contact'].get('name'), str)
        assert isinstance(info['contact'].get('email'), str)
    if 'license' in info:
        assert isinstance(info['license'], dict)
        # Проверка типов значений полей лицензии
        assert isinstance(info['license'].get('name'), str)
        assert isinstance(info['license'].get('url'), str)


def test_get_parameter_type(openapi_parser):
    # Test case 1: ReferenceObject schema
    parameter = {
        "name": "param1",
        "in_": "query",
        "required": True,
        "schema_": {
            "ref": "#/components/schemas/Param1"
        }
    }
    argument = openapi_parser.get_parameter_type(parameter, True, [])
    assert argument.name == "param1"
    assert argument.type_hint == "Param1"
    assert argument.default is None
    assert argument.required is True
    # Test case 2: Non-reference schema
    parameter = {
        "name": "param2",
        "in_": "query",
        "required": False,
        "schema_": {
            "type": "string"
        }
    }
    argument = openapi_parser.get_parameter_type(parameter, True, [])
    assert argument.name == "param2"
    assert argument.type_hint == "str"
    assert argument.default is None
    assert argument.required is False


def test_parse_request_body(openapi_parser):
    # Test case 1: JSON schema
    name = "RequestBody"
    request_body = {
        "content": {
            "application/json": {
                "schema_": {
                    "ref": "#/components/schemas/RequestBody"
                }
            }
        },
        "required": True
    }
    openapi_parser.parse_request_body(name, request_body, [])
    assert len(openapi_parser._temporary_operation["_request"]) == 1
    assert openapi_parser._temporary_operation["_request"][0].name == "body"
    assert openapi_parser._temporary_operation["_request"][0].type_hint == "RequestBody"
    assert openapi_parser._temporary_operation["_request"][0].required is True

    # Test case 2: Form data schema
    name = "FormData"
    request_body = {
        "content": {
            "application/x-www-form-urlencoded": {
                "schema_": {}
            }
        },
        "required": False
    }
    openapi_parser.parse_request_body(name, request_body, [])
    assert len(openapi_parser._temporary_operation["_request"]) == 1
    assert openapi_parser._temporary_operation["_request"][0].name == "request"
    assert openapi_parser._temporary_operation["_request"][0].type_hint == "Request"
    assert openapi_parser._temporary_operation["_request"][0].required is True


def test_parse_operation(openapi_parser):
    # Test case 1: Operation with request body and responses
    operation_1 = {
        "operationId": "createUser",
        "description": "Create a new user",
        "requestBody": {
            "description": "User object",
            "required": True,
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/User"
                    }
                }
            }
        },
        "responses": {
            "200": {
                "description": "Success",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/User"
                        }
                    }
                }
            },
            "400": {
                "description": "Bad Request"
            }
        }
    }

    operation_model_1 = openapi_parser.parse_operation(operation_1)
    assert operation_model_1.operation_id == "createUser"
    assert operation_model_1.description == "Create a new user"
    assert operation_model_1.request_body.name == "User"
    assert operation_model_1.request_body.type == "object"
    assert operation_model_1.responses[200].name == "User"
    assert operation_model_1.responses[200].type == "object"
    assert operation_model_1.responses[400] is None

    # Test case 2: Operation without request body and responses
    operation_2 = {
        "operationId": "getUser",
        "description": "Get user by ID",
        "responses": {
            "200": {
                "description": "Success",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": "#/components/schemas/User"
                        }
                    }
                }
            }
        }
    }

    operation_model_2 = openapi_parser.parse_operation(operation_2)
    assert operation_model_2.operation_id == "getUser"
    assert operation_model_2.description == "Get user by ID"
    assert operation_model_2.request_body is None
    assert operation_model_2.responses[200].name == "User"
    assert operation_model_2.responses[200].type == "object"

    # Test case 3: Operation without description, request body, and responses
    operation_3 = {
        "operationId": "deleteUser"
    }

    operation_model_3 = openapi_parser.parse_operation(operation_3)
    assert operation_model_3.operation_id == "deleteUser"
    assert operation_model_3.description is None
    assert operation_model_3.request_body is None
    assert operation_model_3.responses == {}


def test_get_argument_list(openapi_parser):
    # Test case 1: Operation with path parameters, query parameters, and request body
    operation_1 = {
        "operationId": "createUser",
        "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": True,
                "schema": {
                    "type": "integer"
                }
            },
            {
                "name": "name",
                "in": "query",
                "required": False,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/User"
                    }
                }
            }
        }
    }
    arguments_1 = openapi_parser.get_argument_list(operation_1)
    assert arguments_1 == ["id", "name", "user"]
    # Test case 2: Operation without parameters and request body
    operation_2 = {
        "operationId": "getUser"
    }
    arguments_2 = openapi_parser.get_argument_list(operation_2)
    assert arguments_2 == []
    # Test case 3: Operation with only path parameters
    operation_3 = {
        "operationId": "deleteUser",
        "parameters": [
            {
                "name": "id",
                "in": "path",
                "required": True,
                "schema": {
                    "type": "integer"
                }
            }
        ]
    }
    arguments_3 = openapi_parser.get_argument_list(operation_3)
    assert arguments_3 == ["id"]
