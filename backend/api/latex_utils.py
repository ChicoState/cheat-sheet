import os
import re
import subprocess
import tempfile
import hashlib

LATEX_HEADER = r"""\documentclass[fleqn]{article}
\usepackage[margin=0.15in]{geometry}
\usepackage{amsmath, amssymb}
\usepackage{enumitem} 
\usepackage{multicol}
\usepackage{adjustbox}

\setlength{\mathindent}{0pt}
\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=*}
\pagestyle{empty}

\begin{document}
\scriptsize
"""

LATEX_FOOTER = r"""
\end{document}
"""

# Spacing presets: (formula_gap, baselineskip)
SPACING_MAP = {
    "tiny": ("0pt", "0pt"),
    "small": ("0.2pt", "0.2pt"),
    "medium": ("0.8pt", "0.8pt"),
    "large": ("1.2pt", "1.2pt"),
}

FONT_SIZE_PATTERN = re.compile(r"^(\d+(?:\.\d+)?)pt$")
SPACING_PATTERN = re.compile(r"^(\d+(?:\.\d+)?)pt$")
BODY_FONT_COMMAND_PATTERN = re.compile(
    r"\\fontsize\{[^}]+\}\{[^}]+\}\\selectfont\s*",
    re.MULTILINE,
)
NAMED_BODY_FONT_COMMAND_PATTERN = re.compile(
    r"\\(?:tiny|scriptsize|footnotesize|small|normalsize|large|Large|LARGE|huge|Huge)\b\s*",
    re.MULTILINE,
)
LEGACY_HEADING_PATTERN = re.compile(r"(?m)^\\noindent\\textbf\{([^{}]+)\}\\par\s*$")
LEGACY_FORMULA_LABEL_PATTERN = re.compile(r"(?m)^\\textbf\{([^{}]+)\}\s*$")
LEGACY_PROBLEM_LABEL_PATTERN = re.compile(r"\\textbf\{Problem ([^}]*)\}\s*")
LEGACY_ANSWER_LABEL_PATTERN = re.compile(r"\\textbf\{Answer:\}\s*")
APP_LAYOUT_COMMENT_LINE_PATTERN = re.compile(r"(?m)^% @cheatsheet-layout .*\n?")
APP_LAYOUT_COMMENT_BLOCK_PATTERN = re.compile(
    r"(?m)(?:^% @cheatsheet-layout .*\n)+^%\n?"
)
FORMULA_MARKER_PREFIX = "@cheatsheet-formula"
MANAGED_FORMULA_REGION_START = "% @cheatsheet-managed-formulas-start"
MANAGED_FORMULA_REGION_END = "% @cheatsheet-managed-formulas-end"
FORMULA_BLOCK_PATTERN = re.compile(
    r"(?ms)^% @cheatsheet-formula-start:([^\n]+)\n.*?^% @cheatsheet-formula-end:\1\n?"
)
MANAGED_FORMULA_REGION_PATTERN = re.compile(
    r"(?ms)^% @cheatsheet-managed-formulas-start\n.*?^% @cheatsheet-managed-formulas-end\n?"
)
LEGACY_GENERATED_CLASS_REGION_PATTERN = re.compile(
    r"(?ms)^%\n% ===== BEGIN CLASS: .*?^%\n% ===== END CLASS: .*?=====\n%\n?"
)
LEGACY_READABLE_FORMULA_BLOCK_PATTERN = re.compile(
    r"(?ms)^% (?:Formula Block|legacy-start):.*?^%\n?"
)


def parse_pt_value(value, default):
    match = FONT_SIZE_PATTERN.match(str(value or "").strip())
    if not match:
        match = SPACING_PATTERN.match(str(value or "").strip())
    if not match:
        return default
    return float(match.group(1))


def format_pt_value(value):
    if float(value).is_integer():
        return f"{int(value)}pt"
    return f"{value:.2f}".rstrip("0").rstrip(".") + "pt"


def get_body_font_command(font_size, line_height=None):
    size_pt = parse_pt_value(font_size, 10.0)
    line_height_pt = parse_pt_value(line_height, size_pt + 0.8) if line_height else size_pt + 0.8
    line_height_pt = max(line_height_pt, size_pt)
    return f"\\fontsize{{{format_pt_value(size_pt)}}}{{{format_pt_value(line_height_pt)}}}\\selectfont"


def get_document_class(font_size):
    size_pt = parse_pt_value(font_size, 10.0)
    if size_pt <= 8.5:
        return "extarticle", "8pt"
    if size_pt <= 9.5:
        return "extarticle", "9pt"
    if size_pt <= 10.5:
        return "article", "10pt"
    if size_pt <= 11.5:
        return "article", "11pt"
    return "article", "12pt"


def get_formula_marker_id(formula):
    key = "\x1f".join([
        str(formula.get("class_name") or formula.get("class", "")).strip(),
        str(formula.get("category", "")).strip(),
        str(formula.get("name", "")).strip(),
    ])
    return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]


def build_formula_block_lines(formula, formula_gap):
    class_name = formula.get("class_name") or formula.get("class", "")
    category = formula.get("category", "")
    name = formula.get("name", "")
    latex = formula.get("latex", "")
    marker_id = get_formula_marker_id(formula)
    lines = [f"% @cheatsheet-formula-start:{marker_id}"]

    if category == class_name:
        lines.append(f"% Formula Block: {name}")
        lines.append(latex)
        lines.append("%")
    else:
        escaped_name = escape_latex_text(name)
        lines.append(f"% Formula Block: {name}")
        lines.append(r"\noindent " + escaped_name + r"\par")
        lines.append(r"\[" + r" \adjustbox{max width=\linewidth}{$" + latex + r"$} " + r"\]")
        if formula_gap != "0pt":
            lines.append(r"\vspace{" + formula_gap + "}")
        lines.append("%")

    lines.append(f"% @cheatsheet-formula-end:{marker_id}")
    return lines


def get_spacing_values(spacing, font_size):
    if spacing in SPACING_MAP:
        formula_gap, baseline_adjustment = SPACING_MAP[spacing]
    else:
        custom_spacing = format_pt_value(max(parse_pt_value(spacing, 0.8), 0.0))
        formula_gap = custom_spacing
        baseline_adjustment = custom_spacing

    body_size = parse_pt_value(font_size, 10.0)
    baseline_pt = max(body_size + parse_pt_value(baseline_adjustment, 0.8), body_size)
    return {
        "formula_gap": formula_gap,
        "baseline_skip": format_pt_value(baseline_pt),
        "paragraph_skip": formula_gap,
        "display_skip": formula_gap,
    }


def escape_latex_text(text):
    """Escape plain text before inserting it into LaTeX commands."""
    text = text or ""
    replacements = {
        "\\": "\\textbackslash ",
        "&": "\\&",
        "%": "\\%",
        "#": "\\#",
        "_": "\\_",
        "^": "\\textasciicircum ",
        "{": "\\{",
        "}": "\\}",
    }
    return "".join(replacements.get(char, char) for char in text)


def append_source_comment(lines, comment):
    """Add a full-line LaTeX comment with spacer lines for readability."""
    if lines:
        lines.append("%")
    lines.append(f"% ===== {comment} =====")
    lines.append("%")


def append_text_heading(lines, text):
    lines.append(r"\noindent " + text + r"\par")


def build_layout_comment_block(columns=4, font_size="9pt", margins="0.15in", spacing="small", orientation="portrait"):
    return [
        f"% @cheatsheet-layout columns: {columns} | change layout options up top to update columns",
        f"% @cheatsheet-layout font_size: {font_size} | change layout options up top to update text size",
        f"% @cheatsheet-layout spacing: {spacing} | change layout options up top to update spacing",
        f"% @cheatsheet-layout margins: {margins} | change layout options up top to update margins",
        f"% @cheatsheet-layout orientation: {orientation} | change layout options up top to update orientation",
        "%"
    ]


def build_dynamic_header(columns=4, font_size="9pt", margins="0.15in", spacing="small", orientation="portrait"):
    """
    Build a dynamic LaTeX header based on user-selected options.
    """
    spacing_values = get_spacing_values(spacing, font_size)
    size_command = get_body_font_command(font_size, spacing_values["baseline_skip"])
    doc_class, doc_class_size = get_document_class(font_size)
    
    # Force the PDF driver to use letterpaper, add landscape if requested
    doc_options = f"{doc_class_size},fleqn,letterpaper"
    if orientation == "landscape":
        doc_options += ",landscape"

    # Also pass them to the geometry package
    geometry_options = f"letterpaper,margin={margins}"
    if orientation == "landscape":
        geometry_options += ",landscape"

    header_lines = [
        f"\\documentclass[{doc_options}]{{{doc_class}}}",
        f"\\usepackage[{geometry_options}]{{geometry}}",
        "\\usepackage{amsmath, amssymb}",
        "\\usepackage{enumitem}",
        "\\usepackage{multicol}",
        "\\usepackage{adjustbox}",  
        "",
        "\\setlength{\\mathindent}{0pt}",
        "\\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=*}",
        "\\pagestyle{empty}",
        "",
        f"\\setlength{{\\baselineskip}}{{{spacing_values['baseline_skip']}}}",
        f"\\setlength{{\\parskip}}{{{spacing_values['paragraph_skip']}}}",
        f"\\setlength{{\\abovedisplayskip}}{{{spacing_values['display_skip']}}}",
        f"\\setlength{{\\belowdisplayskip}}{{{spacing_values['display_skip']}}}",
        f"\\setlength{{\\abovedisplayshortskip}}{{{spacing_values['display_skip']}}}",
        f"\\setlength{{\\belowdisplayshortskip}}{{{spacing_values['display_skip']}}}",
        "",
        "\\begin{document}",
        size_command,
    ]
    
    if columns > 1:
        header_lines.append(f"\\begin{{multicols}}{{{columns}}}")
        header_lines.append("\\raggedcolumns")
    
    header_lines.append("")
    return "\n".join(header_lines)


def build_dynamic_footer(columns=2):
    """
    Build a dynamic LaTeX footer based on user-selected options.
    """
    footer_lines = []
    
    if columns > 1:
        footer_lines.append("\\end{multicols}")
    
    footer_lines.append("\\end{document}")
    return "\n".join(footer_lines)


def normalize_latex_layout(content, columns=4, font_size="9pt", margins="0.15in", spacing="small", orientation="portrait"):
    """Rebuild document wrappers so current layout controls apply to existing LaTeX content."""
    if not content:
        return content

    header = build_dynamic_header(columns, font_size, margins, spacing, orientation)
    footer = build_dynamic_footer(columns)

    if r"\begin{document}" not in content or r"\end{document}" not in content:
        body = content.strip("\n")
        return header + body + ("\n" if body else "") + footer

    body = content.split(r"\begin{document}", 1)[1].split(r"\end{document}", 1)[0].strip()
    body = re.sub(NAMED_BODY_FONT_COMMAND_PATTERN, "", body)
    body = re.sub(BODY_FONT_COMMAND_PATTERN, "", body)
    body = re.sub(r"^\\begin\{multicols\}\{\d+\}\s*", "", body, count=1)
    body = re.sub(r"^\\raggedcolumns\s*", "", body, count=1)
    body = re.sub(r"\s*\\end\{multicols\}\s*$", "", body, count=1)
    body = re.sub(LEGACY_HEADING_PATTERN, r"\\noindent \1\\par", body)
    body = re.sub(LEGACY_FORMULA_LABEL_PATTERN, r"\\noindent \1\\par", body)
    body = re.sub(LEGACY_PROBLEM_LABEL_PATTERN, r"Problem \1 ", body)
    body = re.sub(LEGACY_ANSWER_LABEL_PATTERN, "Answer: ", body)
    body = re.sub(APP_LAYOUT_COMMENT_BLOCK_PATTERN, "", body)
    body = re.sub(APP_LAYOUT_COMMENT_LINE_PATTERN, "", body)
    formula_gap = get_spacing_values(spacing, font_size)["formula_gap"]
    if formula_gap == "0pt":
        body = re.sub(r"(?m)^\\vspace\{[^}]+\}\s*$\n?", "", body)
    else:
        body = re.sub(r"(?m)^\\vspace\{[^}]+\}\s*$", rf"\\vspace{{{formula_gap}}}", body)
    body = body.strip("\n")

    layout_comment_block = "\n".join(build_layout_comment_block(columns, font_size, margins, spacing, orientation))
    body = layout_comment_block + ("\n" + body if body else "")

    return header + body + ("\n" if body else "") + footer


def build_latex_for_formulas(selected_formulas, columns=4, font_size="9pt", margins="0.15in", spacing="small", orientation="portrait"):
    """
    Given a list of selected formulas (each with class_name, category, name, latex),
    build a complete LaTeX document.
    """
    header = build_dynamic_header(columns, font_size, margins, spacing, orientation)
    footer = build_dynamic_footer(columns)
    formula_gap = get_spacing_values(spacing, font_size)["formula_gap"]
    
    if not selected_formulas:
        return header + footer
    
    body_lines = []
    body_lines.extend(build_layout_comment_block(columns, font_size, margins, spacing, orientation))
    body_lines.append(MANAGED_FORMULA_REGION_START)
    body_lines.append("% This section syncs with sidebar formula selections. Deselecting a formula removes its managed block.")
    current_class = None
    current_category = None
    in_flushleft = False
    
    for formula in selected_formulas:
        class_name = formula.get("class_name") or formula.get("class", "")
        category = formula.get("category", "")
        
        if class_name != current_class:
            if in_flushleft:
                body_lines.append(r"\end{flushleft}")
                in_flushleft = False
            if current_category is not None and current_category != current_class:
                append_source_comment(body_lines, f"END CATEGORY: {current_category}")
            if current_class is not None:
                append_source_comment(body_lines, f"END CLASS: {current_class}")
            escaped_class = escape_latex_text(class_name)
            append_source_comment(body_lines, f"BEGIN CLASS: {class_name}")
            append_text_heading(body_lines, escaped_class)
            current_class = class_name
            current_category = None

        if category != current_category:
            is_special = (category == class_name)
            if in_flushleft:
                body_lines.append(r"\end{flushleft}")
                in_flushleft = False
            if current_category is not None and current_category != current_class:
                append_source_comment(body_lines, f"END CATEGORY: {current_category}")
            if not is_special:
                escaped_category = escape_latex_text(category)
                append_source_comment(body_lines, f"BEGIN CATEGORY: {category}")
                append_text_heading(body_lines, escaped_category)
                body_lines.append(r"\begin{flushleft}")
                in_flushleft = True
            current_category = category

        body_lines.extend(build_formula_block_lines(formula, formula_gap))

    if in_flushleft:
        body_lines.append(r"\end{flushleft}")
    if current_category is not None and current_category != current_class:
        append_source_comment(body_lines, f"END CATEGORY: {current_category}")
    if current_class is not None:
        append_source_comment(body_lines, f"END CLASS: {current_class}")
    body_lines.append(MANAGED_FORMULA_REGION_END)

    body = "\n".join(body_lines)
    return header + body + "\n" + footer


def _extract_existing_formula_marker_ids(content):
    return set(FORMULA_BLOCK_PATTERN.findall(content or ""))


def _extract_existing_formula_blocks(content):
    blocks = {
        match.group(1): match.group(0).rstrip()
        for match in FORMULA_BLOCK_PATTERN.finditer(content or "")
    }
    for marker_id, block in _extract_legacy_formula_blocks(content).items():
        blocks.setdefault(marker_id, block)
    return blocks


def _extract_legacy_formula_blocks(content):
    blocks = {}
    for region_match in LEGACY_GENERATED_CLASS_REGION_PATTERN.finditer(content or ""):
        lines = region_match.group(0).splitlines()
        current_class = None
        current_category = None
        index = 0

        while index < len(lines):
            stripped = lines[index].strip()
            class_match = re.match(r"^% ===== BEGIN CLASS: (.*?) =====$", stripped)
            if class_match:
                current_class = class_match.group(1)
                current_category = None
                index += 1
                continue

            category_match = re.match(r"^% ===== BEGIN CATEGORY: (.*?) =====$", stripped)
            if category_match:
                current_category = category_match.group(1)
                index += 1
                continue

            formula_match = re.match(r"^% Formula Block: (.*?)$", stripped)
            if formula_match and current_class:
                formula_name = formula_match.group(1)
                block_lines = [lines[index]]
                index += 1
                while index < len(lines):
                    next_stripped = lines[index].strip()
                    if re.match(r"^% Formula Block: ", next_stripped):
                        break
                    if re.match(r"^% ===== (BEGIN|END) (CLASS|CATEGORY): .* =====$", next_stripped):
                        break
                    block_lines.append(lines[index])
                    index += 1

                formula = {
                    "class_name": current_class,
                    "category": current_category or current_class,
                    "name": formula_name,
                }
                marker_id = get_formula_marker_id(formula)
                blocks[marker_id] = "\n".join([
                    f"% {FORMULA_MARKER_PREFIX}-start:{marker_id}",
                    *block_lines,
                    f"% {FORMULA_MARKER_PREFIX}-end:{marker_id}",
                ])
                continue

            index += 1

    return blocks


def _extract_existing_formula_marker_order(content):
    return [match.group(1) for match in FORMULA_BLOCK_PATTERN.finditer(content or "")]


def _remove_unselected_formula_blocks(content, selected_ids):
    def replace(match):
        marker_id = match.group(1)
        return match.group(0) if marker_id in selected_ids else ""

    return FORMULA_BLOCK_PATTERN.sub(replace, content or "")


def _remove_existing_formula_regions(content):
    content = MANAGED_FORMULA_REGION_PATTERN.sub("", content or "")
    return LEGACY_GENERATED_CLASS_REGION_PATTERN.sub("", content)


def _extract_preserved_region_notes(content):
    notes = []
    regions = [match.group(0) for match in MANAGED_FORMULA_REGION_PATTERN.finditer(content or "")]
    regions.extend(match.group(0) for match in LEGACY_GENERATED_CLASS_REGION_PATTERN.finditer(content or ""))

    for region in regions:
        residual = FORMULA_BLOCK_PATTERN.sub("", region)
        residual = LEGACY_READABLE_FORMULA_BLOCK_PATTERN.sub("", residual)
        skip_generated_heading = False
        for raw_line in residual.splitlines():
            line = raw_line.rstrip()
            stripped = line.strip()
            if not stripped:
                continue
            if stripped in {MANAGED_FORMULA_REGION_START, MANAGED_FORMULA_REGION_END, "%"}:
                continue
            if stripped.startswith("% This section syncs with sidebar formula selections"):
                continue
            if stripped.startswith("% Preserved manual notes from the previous formula section"):
                continue
            source_comment = re.match(r"^% ===== (BEGIN|END) (CLASS|CATEGORY): .* =====$", stripped)
            if source_comment:
                skip_generated_heading = source_comment.group(1) == "BEGIN"
                continue
            if stripped in {r"\begin{flushleft}", r"\end{flushleft}"}:
                continue
            if skip_generated_heading and re.match(r"^\\noindent .+\\par$", stripped):
                skip_generated_heading = False
                continue
            skip_generated_heading = False
            notes.append(line)

    return "\n".join(notes)


def _build_appendix_for_missing_formulas(missing_formulas, font_size="9pt", spacing="small", existing_blocks=None):
    if not missing_formulas:
        return ""

    existing_blocks = existing_blocks or {}
    formula_gap = get_spacing_values(spacing, font_size)["formula_gap"]
    lines = []
    current_class = None
    current_category = None
    in_flushleft = False

    for formula in missing_formulas:
        class_name = formula.get("class_name") or formula.get("class", "")
        category = formula.get("category", "")

        if class_name != current_class:
            if in_flushleft:
                lines.append(r"\end{flushleft}")
                in_flushleft = False
            if current_category is not None and current_category != current_class:
                append_source_comment(lines, f"END CATEGORY: {current_category}")
            if current_class is not None:
                append_source_comment(lines, f"END CLASS: {current_class}")
            append_source_comment(lines, f"BEGIN CLASS: {class_name}")
            append_text_heading(lines, escape_latex_text(class_name))
            current_class = class_name
            current_category = None

        if category != current_category:
            is_special = category == class_name
            if in_flushleft:
                lines.append(r"\end{flushleft}")
                in_flushleft = False
            if current_category is not None and current_category != current_class:
                append_source_comment(lines, f"END CATEGORY: {current_category}")
            if not is_special:
                append_source_comment(lines, f"BEGIN CATEGORY: {category}")
                append_text_heading(lines, escape_latex_text(category))
                lines.append(r"\begin{flushleft}")
                in_flushleft = True
            current_category = category

        marker_id = get_formula_marker_id(formula)
        if marker_id in existing_blocks:
            lines.extend(existing_blocks[marker_id].splitlines())
        else:
            lines.extend(build_formula_block_lines(formula, formula_gap))

    if in_flushleft:
        lines.append(r"\end{flushleft}")
    if current_category is not None and current_category != current_class:
        append_source_comment(lines, f"END CATEGORY: {current_category}")
    if current_class is not None:
        append_source_comment(lines, f"END CLASS: {current_class}")

    return "\n".join(lines)


def _build_managed_formula_region(selected_formulas, font_size="9pt", spacing="small", existing_blocks=None, preserved_notes=""):
    if not selected_formulas:
        return preserved_notes.strip()
    appendix = _build_appendix_for_missing_formulas(selected_formulas, font_size, spacing, existing_blocks)
    lines = [
        MANAGED_FORMULA_REGION_START,
        "% This section syncs with sidebar formula selections. Deselecting a formula removes its managed block.",
        appendix,
    ]
    if preserved_notes.strip():
        lines.extend([
            "% Preserved manual notes from the previous formula section:",
            preserved_notes.strip(),
        ])
    lines.append(MANAGED_FORMULA_REGION_END)
    return "\n".join(lines)


def merge_selected_formulas_into_latex(content, selected_formulas, font_size="9pt", spacing="small"):
    """Merge selected formulas into an existing LaTeX document while preserving manual text.

    Managed formula blocks are removed when deselected. Missing selected formulas are
    appended as managed blocks before the current multicol footer when possible.
    """
    if not content:
        return content

    existing_blocks = _extract_existing_formula_blocks(content)
    existing_order = _extract_existing_formula_marker_order(content)
    selected_order = [get_formula_marker_id(formula) for formula in selected_formulas]
    if MANAGED_FORMULA_REGION_PATTERN.search(content) and existing_order == selected_order:
        return content

    preserved_notes = _extract_preserved_region_notes(content)
    content = _remove_existing_formula_regions(content)
    managed_region = _build_managed_formula_region(selected_formulas, font_size, spacing, existing_blocks, preserved_notes)
    if not managed_region:
        return content

    insertion = "\n" + managed_region + "\n"
    multicol_match = re.search(r"(?m)^\\end\{multicols\}\s*$", content)
    if multicol_match:
        return content[:multicol_match.start()] + insertion + content[multicol_match.start():]

    document_end_match = re.search(r"(?m)^\\end\{document\}\s*$", content)
    if document_end_match:
        return content[:document_end_match.start()] + insertion + content[document_end_match.start():]

    return content.rstrip() + insertion

def compile_latex_to_pdf(content):
    """
    Compiles LaTeX content to a PDF using Tectonic.
    Returns the generated PDF as bytes or raises an Exception.
    """
    # Ensure document has proper structure
    if r"\begin{document}" not in content:
        content = LATEX_HEADER + content + LATEX_FOOTER

    # Use a context manager so the temporary directory is always cleaned up
    with tempfile.TemporaryDirectory() as tempdir:
        tex_file_path = os.path.join(tempdir, "document.tex")
        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(content)

        try:
            subprocess.run(
                ["tectonic", tex_file_path],
                cwd=tempdir,
                capture_output=True,
                text=True,
                check=True,
            )
        except subprocess.CalledProcessError:
            # Propagate the error; the temporary directory will still be cleaned up
            raise

        pdf_file_path = os.path.join(tempdir, "document.pdf")
        if not os.path.exists(pdf_file_path):
            raise FileNotFoundError("PDF not generated")

        # Read and return the PDF bytes before the temporary directory is removed
        with open(pdf_file_path, "rb") as pdf_file:
            return pdf_file.read()
