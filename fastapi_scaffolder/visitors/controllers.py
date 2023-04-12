from typing import Dict, List, Optional

from fastapi_scaffolder.parser import OpenAPIParser, Operation
from fastapi_scaffolder.visitor import Visitor

import inflect


class ControllersVisitor:
    def __init__(self, inflect_engine: inflect.engine):
        self.inflect_engine = inflect_engine
        self.models_names = []

    def get_singular_of_word(self, word) -> str:
        return self.inflect_engine.singular_noun(word)

    def get_controller_name(self, operation: Operation) -> Optional[str]:
        def find_model_name(s: str) -> str:
            for model in self.models_names:
                if model.lower() in s:
                    return f"{model}Controller"
        in_op_id = find_model_name(operation.operationId)
        if in_op_id:
            return in_op_id
        for tag in operation.tags:
            # if any of the model names are in tag
            in_tag = find_model_name(tag)
            if in_tag:
                return in_tag
        return None

    def get_method_name(self, operation: Operation) -> str:
        name = operation.function_name
        if "list" in name:
            return "get_list"
        elif "get" in name:
            return "get_one"
        elif "create" in name or "new" in name:
            return "create"
        elif "edit" in name or "update" in name:
            return "edit"
        elif "delete" in name:
            return "delete_one"
        return "dummy"

    def get_controller_arguments(self, operation: Operation) -> str:
        return ", ".join(
            [*(arg[:-1] for arg in operation.snake_case_arguments.split() if arg[-1] == ":"),
             "request.state.session"]
        )

    def remove_unnecessary_models(self, models_names: List[str]) -> List[str]:
        """
        Filter models list
        Removing all models ending with 'error'
        Removing extra models
        i.e. User and Users, leaving only User
        """
        result = []
        for name in models_names:
            name = name.lower()
            if name.endswith("error"):
                continue
            singular_name = self.get_singular_of_word(name)  # i.e. "users" -> "user"
            if singular_name and singular_name.capitalize() in models_names:
                # removing from list if singular version of name is found
                continue
            result.append(name.capitalize())
        return result

    def get_template_vars(self, parser: OpenAPIParser) -> Dict[str, object]:
        entities_names = list(parser.extra_template_data.keys())
        self.models_names = self.remove_unnecessary_models(entities_names)
        return {
            "models": self.models_names,
            "get_controller_name": self.get_controller_name,
            "get_controller_arguments": self.get_controller_arguments,
            "get_method_name": self.get_method_name
        }


def get_controllers_vars(parser: OpenAPIParser, *args) -> Dict[str, object]:
    p = inflect.engine()
    controller_visitor = ControllersVisitor(p)
    return controller_visitor.get_template_vars(parser)


visit: Visitor = get_controllers_vars
