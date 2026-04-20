from api.services.practice_problem_compiler import compile_source


VALID_SOURCE = """problem:
    text: Solve for x
    math: x^2 - 5x + 6 = 0

steps:
    text: Factor the trinomial
    math: x^2 - 5x + 6 = (x - 2)(x - 3)
    text: Therefore x = 2 or x = 3
"""


def test_compile_source_builds_latex_from_simple_v1_block():
    result = compile_source(VALID_SOURCE, label="Quadratic factoring")

    assert result.is_valid
    assert "\\subsection*{Quadratic factoring}" in result.compiled_latex
    assert "\\textbf{Problem.}" in result.compiled_latex
    assert "\\textbf{Steps.}" in result.compiled_latex
    assert "\\[" in result.compiled_latex
    assert "Therefore x = 2 or x = 3" in result.compiled_latex
    assert "\\begin{enumerate}" in result.compiled_latex


def test_compile_source_treats_text_lines_as_literal_text():
    result = compile_source(
        """problem:
    text: Area of a circle

steps:
    text: A factor is x - 2
"""
    )

    assert result.is_valid
    assert "Area of a circle" in result.compiled_latex
    assert "A factor is x - 2" in result.compiled_latex
    assert "\\(" not in result.compiled_latex


def test_compile_source_rejects_unknown_top_level_key():
    result = compile_source(
        """problem:
    text: Solve for x

answer:
    math: x = 2
"""
    )

    assert not result.is_valid
    assert result.errors[0].line == 4
    assert "Unknown top-level key 'answer'" in result.errors[0].message


def test_compile_source_rejects_mixed_indentation():
    result = compile_source(
        "problem:\n\ttext: Solve for x\n  math: x^2 - 5x + 6 = 0\n\nsteps:\n\tmath: x = 2"
    )

    assert not result.is_valid
    assert result.errors[0].message == "Mixed tabs and spaces are not allowed in the same block."


def test_compile_source_requires_problem_and_steps_sections():
    result = compile_source(
        """problem:
    text: Solve for x
"""
    )

    assert not result.is_valid
    assert any("'steps:' section" in error.message for error in result.errors)


def test_compile_source_rejects_unsupported_math_characters():
    result = compile_source(
        """problem:
    math: x + y

steps:
    math: x @ y
"""
    )

    assert not result.is_valid
    assert result.errors[0].line == 5
    assert "Unsupported character(s) in math expression: @" in result.errors[0].message
