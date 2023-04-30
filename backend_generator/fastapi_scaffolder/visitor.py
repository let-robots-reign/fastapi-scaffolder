from pathlib import Path
from typing import Dict

from fastapi_scaffolder.parser import OpenAPIParser


class Visitor:
    def __init__(self):
        self.global_template_vars = {}

    def __call__(self, parser: OpenAPIParser, model_path: Path) -> Dict[str, object]:
        # global template vars could be inserted here
        return self.global_template_vars
