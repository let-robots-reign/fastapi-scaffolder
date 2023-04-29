from pathlib import Path
from typing import Dict

from fastapi_scaffolder.parser import OpenAPIParser


class Visitor:
    def __call__(self, parser: OpenAPIParser, model_path: Path) -> Dict[str, object]:
        # global template vars could be inserted here
        return {}
