from typing import Dict, List

from fastapi_scaffolder.parser import OpenAPIParser, Operation
from fastapi_scaffolder.visitor import Visitor


class OperationsVisitor(Visitor):
    def get_operations(self, parser: OpenAPIParser) -> Dict[str, object]:
        sorted_operations: List[Operation] = sorted(
            parser.operations.values(), key=lambda m: m.path
        )
        return {'operations': sorted_operations}

    def __call__(self, parser: OpenAPIParser, *args) -> Dict[str, object]:
        return self.get_operations(parser)


visit: Visitor = OperationsVisitor()
