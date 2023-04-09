from typing import Dict, List

from fastapi_scaffolder.parser import OpenAPIParser
from fastapi_scaffolder.visitor import Visitor

import inflect


class ControllersVisitor:
    def __init__(self, inflect_engine: inflect.engine):
        self.inflect_engine = inflect_engine

    def get_singular_of_word(self, word):
        print(word, end=" ")
        print(self.inflect_engine.singular_noun(word))
        return self.inflect_engine.singular_noun(word)

    def remove_unnecessary_models(self, models_names: List[str]):
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
        return {"models": self.remove_unnecessary_models(entities_names)}


def get_controllers_vars(parser: OpenAPIParser, *args) -> Dict[str, object]:
    p = inflect.engine()
    controller_visitor = ControllersVisitor(p)
    return controller_visitor.get_template_vars(parser)


visit: Visitor = get_controllers_vars
