import pytest

from api.models import CheatSheet, PracticeProblem


@pytest.mark.django_db
def test_build_full_latex_prefers_compiled_problem_blocks():
    sheet = CheatSheet.objects.create(
        title="With Compiled Blocks",
        latex_content="Content",
    )
    PracticeProblem.objects.create(
        cheat_sheet=sheet,
        label="Quadratic factoring",
        source_format="simple_v1",
        source_text="problem:\n    text: Solve for x\n    math: x^2 - 5x + 6 = 0\n\nsteps:\n    math: x = 2",
        compiled_latex="\\subsection*{Quadratic factoring}\nCompiled block content",
        question_latex="Legacy question",
        answer_latex="Legacy answer",
        order=1,
    )

    full = sheet.build_full_latex()

    assert "Compiled block content" in full
    assert "Legacy question" not in full
