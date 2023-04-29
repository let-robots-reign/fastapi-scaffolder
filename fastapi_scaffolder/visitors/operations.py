from pathlib import Path
from typing import Dict, List

from fastapi_scaffolder.parser import OpenAPIParser, Operation
from fastapi_scaffolder.visitor import Visitor


class OperationsVisitor:
    def get_operations(self, parser: OpenAPIParser) -> Dict[str, object]:
        sorted_operations: List[Operation] = sorted(
            parser.operations.values(), key=lambda m: m.path
        )
        return {'operations': sorted_operations}


def get_operations(parser: OpenAPIParser, *args) -> Dict[str, object]:
    operations_visitor = OperationsVisitor()
    return operations_visitor.get_operations(parser)


visit: Visitor = get_operations
