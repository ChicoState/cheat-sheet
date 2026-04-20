# Practice Problem Compiler MVP

## Goal

Let users author practice problems in a simple indented syntax, keep the original source, compile it into pure LaTeX, and reorder named problem blocks in the UI.

## Product shape

- One draggable **block** in the UI maps to one `PracticeProblem` record.
- Each block has:
  - a user-facing label/name
  - source text in a simple syntax
  - compiled LaTeX
- The cheat sheet document still assembles a final PDF by stitching together stored LaTeX blocks.

## MVP decisions

- **Block unit:** reuse `PracticeProblem` as the block model.
- **Compiler format name:** `simple_v1`
- **Storage strategy:** compile on create/update and store both source and compiled LaTeX.
- **UI strategy:** add a block list with drag reorder, label input, and source editor.
- **Legacy compatibility:** existing `question_latex` / `answer_latex` rows still render until migrated.

## Non-goals

- Full math parser
- Arbitrary raw LaTeX passthrough in `simple_v1`
- Nested block trees
- Substeps, hints, grading metadata, or answer checking
- Multi-block source files inside a single textarea

## User workflow

1. User creates a practice-problem block.
2. User enters a block label, such as `Quadratic factoring`.
3. User writes source text in the simple syntax.
4. Frontend saves the block through `/api/problems/`.
5. Backend validates and compiles the block into LaTeX.
6. Drag reorder changes block `order`.
7. Cheat sheet PDF uses compiled block LaTeX in that saved order.

## Data model changes

Extend `backend/api/models.py` `PracticeProblem` with:

- `label = models.CharField(max_length=120, blank=True, default="")`
- `source_format = models.CharField(max_length=20, default="simple_v1")`
- `source_text = models.TextField(blank=True, default="")`
- `compiled_latex = models.TextField(blank=True, default="")`

Keep existing fields during MVP rollout:

- `question_latex`
- `answer_latex`
- `order`
- `cheat_sheet`

### Compatibility rule

- New compiler-backed blocks use `label`, `source_format`, `source_text`, and `compiled_latex`.
- Legacy rows without compiler data continue rendering from `question_latex` / `answer_latex`.

## Compiler boundary

Add a pure service module:

- `backend/api/services/practice_problem_compiler.py`

Recommended functions:

```python
def compile_source(source_text: str, label: str = "") -> CompilationResult:
    ...

def parse_source(source_text: str) -> ParsedProblemBlock:
    ...

def compile_math_expression(expression: str) -> str:
    ...
```

`CompilationResult` should include:

- `compiled_latex: str`
- `errors: list[CompilerError]`

`CompilerError` should include:

- `line`
- `column`
- `message`

### Why this boundary

- Keeps parser/compiler logic out of models and views
- Makes unit testing cheap
- Lets serializers return line-aware validation errors
- Keeps `CheatSheet.build_full_latex()` focused on document assembly only

## Serializer behavior

`PracticeProblemSerializer` should:

- accept `label`, `source_format`, `source_text`, `order`, `cheat_sheet`
- validate `source_text` when `source_format == "simple_v1"`
- call the compiler service during create/update
- store `compiled_latex`
- expose read-only `compiled_latex`

For MVP, no separate parse-preview endpoint is required.

## Rendering behavior

`CheatSheet._build_practice_problems_section()` should render blocks in this order:

1. `compiled_latex` if present
2. legacy `question_latex` / `answer_latex` fallback

This keeps final document generation deterministic and avoids recompiling every block during PDF generation.

## Syntax overview

### Top-level structure

`simple_v1` supports exactly two top-level keys:

- `problem:`
- `steps:`

Indentation is significant.

### Allowed child item types

- `text:`
- `math:`

### Valid example

```txt
problem:
	text: Solve for x
	math: x^2 - 5x + 6 = 0

steps:
	text: Factor the trinomial
	math: x^2 - 5x + 6 = (x - 2)(x - 3)
	math: x - 2 = 0
	math: x - 3 = 0
	text: Therefore x = 2 or x = 3
```

Equivalent spaces-based indentation is also valid.

### Invalid examples

Unknown key:

```txt
problem:
	text: Solve for x
answer:
	math: x = 2
```

Bad indentation:

```txt
problem:
	text: Solve for x
  math: x^2 - 5x + 6 = 0
```

Missing top-level section:

```txt
steps:
	math: x = 2
```

## Syntax rules

### `problem:`

- required
- must contain at least one child line
- may contain one or more `text:` and `math:` lines
- preserves author order

### `steps:`

- required for MVP
- must contain at least one child line
- each child becomes one displayed step
- may contain `text:` and `math:` lines

### Indentation rules

- tabs or spaces are allowed
- mixed indentation styles in the same block are invalid
- child lines must be indented deeper than their parent key

## Math compilation rules

`math:` lines accept calculator-style keyboard input and apply a narrow rewrite set.

### Supported rewrites in MVP

- `^` for superscripts
- `sqrt(x)` to `\sqrt{x}`
- `<=` to `\le`
- `>=` to `\ge`
- `!=` to `\ne`
- optional `*` to `\cdot`

### Not supported in MVP

- implicit multiplication normalization
- pretty fraction inference from `/`
- arbitrary function parsing
- symbolic simplification
- custom macros

Unsupported constructs should return a readable validation error instead of guessing.

## Example compiled output

For label `Quadratic factoring`, this source:

```txt
problem:
	text: Solve for x
	math: x^2 - 5x + 6 = 0

steps:
	text: Factor the trinomial
	math: x^2 - 5x + 6 = (x - 2)(x - 3)
	math: x - 2 = 0
	math: x - 3 = 0
	text: Therefore x = 2 or x = 3
```

compiles to:

```latex
\subsection*{Quadratic factoring}
\textbf{Problem.}

Solve for \(x\)

\[
x^2 - 5x + 6 = 0
\]

\textbf{Steps.}
\begin{enumerate}
  \item Factor the trinomial
  \item \(x^2 - 5x + 6 = (x - 2)(x - 3)\)
  \item \(x - 2 = 0\)
  \item \(x - 3 = 0\)
  \item Therefore \(x = 2\) or \(x = 3\)
\end{enumerate}
```

## Frontend MVP

Add a practice-problem block editor to `frontend/src/components/CreateCheatSheet.jsx` using the existing drag-and-drop pattern.

Each block should support:

- label input
- source textarea
- compile/save status
- drag handle
- delete button
- reorder persistence through `order`

Suggested initial UX:

- left side: list of problem blocks
- block card header: label + drag handle + remove action
- block body: syntax textarea
- optional future enhancement: compiled preview panel per block

## API shape for MVP

### Create/update payload

```json
{
  "cheat_sheet": 1,
  "label": "Quadratic factoring",
  "source_format": "simple_v1",
  "source_text": "problem:\n\ttext: Solve for x\n\tmath: x^2 - 5x + 6 = 0\n\nsteps:\n\ttext: Factor the trinomial\n\tmath: x^2 - 5x + 6 = (x - 2)(x - 3)",
  "order": 1
}
```

### Response fields

```json
{
  "id": 10,
  "cheat_sheet": 1,
  "label": "Quadratic factoring",
  "source_format": "simple_v1",
  "source_text": "...",
  "compiled_latex": "...",
  "order": 1
}
```

### Validation errors

Should be line-aware when possible, for example:

```json
{
  "source_text": [
    "Line 5: unknown key 'answer'. Expected 'text:' or 'math:' inside steps."
  ]
}
```

## Testing plan

### Compiler unit tests

- valid `problem + steps` source compiles successfully
- unknown top-level key fails
- mixed indentation fails
- missing `problem:` fails
- missing `steps:` fails
- unsupported math token fails with readable error

### Serializer/API tests

- creating compiler-backed problem stores `compiled_latex`
- updating `source_text` recompiles and replaces stored LaTeX
- invalid source returns `400` with line-aware errors
- legacy rows still serialize and render

### Integration tests

- cheat sheet `full_latex` includes compiled block LaTeX
- compile endpoint still produces PDF with compiler-backed blocks
- ordering of blocks is preserved

## Risks to avoid

1. Turning MVP into a full programming language
2. Designing one giant source field containing many named blocks
3. Recompiling on every document build instead of storing stable output
4. Adding nested models for steps before the syntax proves it is needed
5. Using heuristics to guess whether a free-form line is text or math

## Suggested implementation order

1. Add model fields and migration
2. Add compiler service and pure unit tests
3. Update serializer and API tests
4. Update cheat sheet LaTeX assembly for compiler-backed blocks
5. Add frontend block editor and reorder UI
6. Verify full save → retrieve → compile flow

## Open assumptions for MVP

- Block label is a separate UI/API field, not part of the source grammar.
- Each block represents one problem with ordered steps.
- `steps:` is required in MVP even if later versions may relax that.
- `simple_v1` favors explicit `text:` / `math:` lines over heuristic parsing.
