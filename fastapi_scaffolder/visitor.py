from pathlib import Path
from typing import Callable, Dict

from fastapi_scaffolder.parser import OpenAPIParser

Visitor = Callable[[OpenAPIParser, Path], Dict[str, object]]
