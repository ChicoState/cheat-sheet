from dataclasses import dataclass, field
import re


ALLOWED_TOP_LEVEL_KEYS = {"problem", "steps"}
ALLOWED_CHILD_KEYS = {"text", "math"}
ALLOWED_MATH_CHARACTERS = set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 +-*/^=().,!<>_[]"
)


@dataclass
class CompilerError:
    line: int
    column: int
    message: str


@dataclass
class ProblemItem:
    kind: str
    value: str
    line: int


@dataclass
class ParsedProblemBlock:
    problem_items: list[ProblemItem] = field(default_factory=list)
    step_items: list[ProblemItem] = field(default_factory=list)


@dataclass
class CompilationResult:
    compiled_latex: str = ""
    errors: list[CompilerError] = field(default_factory=list)

    @property
    def is_valid(self):
        return not self.errors


def compile_source(source_text: str, label: str = "") -> CompilationResult:
    parsed_block, errors = parse_source(source_text)
    if errors:
        return CompilationResult(errors=errors)

    compiled_lines = []
    escaped_label = _escape_latex_text(label)
    compilation_errors = []

    if escaped_label:
        compiled_lines.append(f"\\subsection*{{{escaped_label}}}")

    compiled_lines.append("\\textbf{Problem.}")
    compiled_lines.append("")

    for item in parsed_block.problem_items:
        try:
            compiled_lines.extend(_compile_problem_item(item))
        except ValueError as error:
            compilation_errors.append(
                CompilerError(line=item.line, column=1, message=str(error))
            )

    compiled_lines.append("")
    compiled_lines.append("\\textbf{Steps.}")
    compiled_lines.append("\\begin{enumerate}")
    for item in parsed_block.step_items:
        try:
            compiled_lines.append(f"  \\item {_compile_step_item(item)}")
        except ValueError as error:
            compilation_errors.append(
                CompilerError(line=item.line, column=1, message=str(error))
            )
    compiled_lines.append("\\end{enumerate}")

    if compilation_errors:
        return CompilationResult(errors=compilation_errors)

    return CompilationResult(compiled_latex="\n".join(compiled_lines).strip())


def parse_source(source_text: str) -> tuple[ParsedProblemBlock, list[CompilerError]]:
    parsed = ParsedProblemBlock()
    errors = []

    normalized_source = (source_text or "").replace("\r\n", "\n").replace("\r", "\n")
    if not normalized_source.strip():
        return parsed, [CompilerError(line=1, column=1, message="Source text cannot be empty.")]

    lines = normalized_source.split("\n")
    indent_style = _detect_indent_style(lines)
    if indent_style == "mixed":
        return parsed, [
            CompilerError(
                line=_find_first_mixed_indent_line(lines),
                column=1,
                message="Mixed tabs and spaces are not allowed in the same block.",
            )
        ]

    current_section = None
    child_indent = {}

    for line_number, raw_line in enumerate(lines, start=1):
        if not raw_line.strip():
            continue

        indent = _leading_whitespace(raw_line)
        stripped_line = raw_line.lstrip(" \t")

        if not indent:
            if not stripped_line.endswith(":"):
                errors.append(
                    CompilerError(
                        line=line_number,
                        column=len(raw_line) - len(stripped_line) + 1,
                        message="Top-level lines must end with ':' and declare 'problem:' or 'steps:'.",
                    )
                )
                continue

            section_name = stripped_line[:-1].strip()
            if section_name not in ALLOWED_TOP_LEVEL_KEYS:
                errors.append(
                    CompilerError(
                        line=line_number,
                        column=1,
                        message=f"Unknown top-level key '{section_name}'. Expected 'problem:' or 'steps:'.",
                    )
                )
                current_section = None
                continue

            if child_indent.get(section_name) is not None:
                errors.append(
                    CompilerError(
                        line=line_number,
                        column=1,
                        message=f"Duplicate top-level section '{section_name}:'.",
                    )
                )
                current_section = None
                continue

            current_section = section_name
            child_indent[section_name] = ""
            continue

        if current_section is None:
            errors.append(
                CompilerError(
                    line=line_number,
                    column=1,
                    message="Indented lines must appear under 'problem:' or 'steps:'.",
                )
            )
            continue

        if not child_indent[current_section]:
            child_indent[current_section] = indent
        elif indent != child_indent[current_section]:
            errors.append(
                CompilerError(
                    line=line_number,
                    column=1,
                    message=f"All lines inside '{current_section}:' must use the same indentation level.",
                )
            )
            continue

        if ":" not in stripped_line:
            errors.append(
                CompilerError(
                    line=line_number,
                    column=len(indent) + 1,
                    message="Child lines must start with 'text:' or 'math:'.",
                )
            )
            continue

        item_kind, item_value = stripped_line.split(":", 1)
        item_kind = item_kind.strip()
        item_value = item_value.strip()

        if item_kind not in ALLOWED_CHILD_KEYS:
            errors.append(
                CompilerError(
                    line=line_number,
                    column=len(indent) + 1,
                    message=(
                        f"Unknown key '{item_kind}'. Expected 'text:' or 'math:' inside {current_section}."
                    ),
                )
            )
            continue

        if not item_value:
            errors.append(
                CompilerError(
                    line=line_number,
                    column=len(indent) + len(item_kind) + 2,
                    message=f"{item_kind.title()} lines cannot be empty.",
                )
            )
            continue

        target_items = parsed.problem_items if current_section == "problem" else parsed.step_items
        target_items.append(ProblemItem(kind=item_kind, value=item_value, line=line_number))

    if errors:
        return parsed, errors

    if not parsed.problem_items:
        errors.append(
            CompilerError(
                line=1,
                column=1,
                message="A 'problem:' section with at least one child line is required.",
            )
        )

    if not parsed.step_items:
        errors.append(
            CompilerError(
                line=1,
                column=1,
                message="A 'steps:' section with at least one child line is required.",
            )
        )

    return parsed, errors


def _compile_problem_item(item: ProblemItem) -> list[str]:
    if item.kind == "math":
        return ["\\[", compile_math_expression(item.value), "\\]", ""]

    return [_escape_latex_text(item.value), ""]


def _compile_step_item(item: ProblemItem) -> str:
    if item.kind == "math":
        return f"\\({compile_math_expression(item.value)}\\)"

    return _escape_latex_text(item.value)


def compile_math_expression(expression: str) -> str:
    value = (expression or "").strip()
    if not value:
        raise ValueError("Math expressions cannot be empty.")

    invalid_characters = sorted({character for character in value if character not in ALLOWED_MATH_CHARACTERS})
    if invalid_characters:
        invalid_display = "".join(invalid_characters)
        raise ValueError(f"Unsupported character(s) in math expression: {invalid_display}")

    compiled = _replace_sqrt_calls(value)
    compiled = compiled.replace("<=", r" \le ")
    compiled = compiled.replace(">=", r" \ge ")
    compiled = compiled.replace("!=", r" \ne ")
    compiled = re.sub(r"(?<![<>!=])=(?!=)", " = ", compiled)
    compiled = re.sub(r"\s*\*\s*", r" \\cdot ", compiled)
    compiled = re.sub(r"\s+", " ", compiled).strip()
    return compiled


def _replace_sqrt_calls(value: str) -> str:
    result = []
    index = 0

    while index < len(value):
        if value.startswith("sqrt(", index):
            expression, next_index = _extract_parenthesized_expression(value, index + 4)
            result.append(rf"\sqrt{{{compile_math_expression(expression)}}}")
            index = next_index
            continue

        result.append(value[index])
        index += 1

    return "".join(result)


def _extract_parenthesized_expression(value: str, start_index: int) -> tuple[str, int]:
    if start_index >= len(value) or value[start_index] != "(":
        raise ValueError("sqrt must be followed by parentheses, like sqrt(x + 1).")

    depth = 1
    index = start_index + 1
    collected = []

    while index < len(value):
        character = value[index]
        if character == "(":
            depth += 1
        elif character == ")":
            depth -= 1
            if depth == 0:
                return "".join(collected).strip(), index + 1

        if depth > 0:
            collected.append(character)
        index += 1

    raise ValueError("Unclosed parentheses in sqrt expression.")


def _escape_latex_text(value: str) -> str:
    escaped = value.replace("\\", r"\textbackslash{}")
    replacements = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    for original, replacement in replacements.items():
        escaped = escaped.replace(original, replacement)
    return escaped


def _detect_indent_style(lines: list[str]) -> str:
    saw_tabs = False
    saw_spaces = False

    for line in lines:
        indent = _leading_whitespace(line)
        if not indent:
            continue

        if "\t" in indent:
            saw_tabs = True
        if " " in indent:
            saw_spaces = True

    if saw_tabs and saw_spaces:
        return "mixed"
    if saw_tabs:
        return "tabs"
    return "spaces"


def _find_first_mixed_indent_line(lines: list[str]) -> int:
    saw_tabs = False
    saw_spaces = False

    for line_number, line in enumerate(lines, start=1):
        indent = _leading_whitespace(line)
        if not indent:
            continue

        if "\t" in indent:
            saw_tabs = True
        if " " in indent:
            saw_spaces = True

        if saw_tabs and saw_spaces:
            return line_number

    return 1


def _leading_whitespace(value: str) -> str:
    return value[: len(value) - len(value.lstrip(" \t"))]
