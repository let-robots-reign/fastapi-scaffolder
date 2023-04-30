from pathlib import Path
from typing import List, Optional

import typer
from datamodel_code_generator import LiteralType

from fastapi_scaffolder.consts import MODEL_PATH
from fastapi_scaffolder.generator import BackendGenerator

app = typer.Typer()


@app.command()
def main(
    input_file: typer.FileText = typer.Option(..., "--input", "-i"),
    output_dir: Path = typer.Option(..., "--output", "-o"),
    model_file: str = typer.Option(None, "--model-file", "-m"),
    template_dir: Optional[Path] = typer.Option(None, "--template-dir", "-t"),
    enum_field_as_literal: Optional[LiteralType] = typer.Option(
        None, "--enum-field-as-literal"
    ),
    custom_visitors: Optional[List[Path]] = typer.Option(
        None, "--custom-visitor", "-c"
    ),
) -> None:
    input_name: str = input_file.name
    input_text: str = input_file.read()
    if model_file:
        model_path = Path(model_file).with_suffix('.py')
    else:
        model_path = MODEL_PATH

    generator = BackendGenerator(
        input_name,
        input_text,
        output_dir,
        template_dir,
        model_path,
        enum_field_as_literal=enum_field_as_literal or None,
        custom_visitors=custom_visitors or None,
    )
    generator.generate_code()


if __name__ == "__main__":
    typer.run(main)
