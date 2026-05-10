""" DISCRETE MATH I formulas """
CLASS_NAME = "DISCRETE MATH I"

FORMULAS = {
    "Propositional Logic": [
        {"name": "De Morgan's Laws", "latex": r"\neg(p \land q) \equiv \neg p \lor \neg q, \quad \neg(p \lor q) \equiv \neg p \land \neg q"},
        {"name": "Implication", "latex": r"p \rightarrow q \equiv \neg p \lor q"},
        {"name": "Biconditional", "latex": r"p \leftrightarrow q \equiv (p \rightarrow q) \land (q \rightarrow p)"},
        {"name": "Modus Ponens", "latex": r"(p \land (p \rightarrow q)) \rightarrow q"},
        {"name": "Modus Tollens", "latex": r"(\neg q \land (p \rightarrow q)) \rightarrow \neg p"},
    ],
    "Set Theory": [
        {"name": "Subset Definition", "latex": r"A \subseteq B \iff \forall x (x \in A \rightarrow x \in B)"},
        {"name": "Power Set Cardinality", "latex": r"|P(A)| = 2^{|A|}"},
        {"name": "Cartesian Product", "latex": r"A \times B = \{(a, b) \mid a \in A \land b \in B\}"},
        {"name": "Inclusion-Exclusion (2 Sets)", "latex": r"|A \cup B| = |A| + |B| - |A \cap B|"},
    ],
    "Functions & Relations": [
        {"name": "Injective (One-to-One)", "latex": r"f(a) = f(b) \implies a = b"},
        {"name": "Surjective (Onto)", "latex": r"\forall y \in Y, \exists x \in X \text{ s.t. } f(x) = y"},
        {"name": "Reflexive Relation", "latex": r"\forall a \in A, (a, a) \in R"},
        {"name": "Symmetric Relation", "latex": r"(a, b) \in R \implies (b, a) \in R"},
        {"name": "Transitive Relation", "latex": r"(a, b) \in R \land (b, c) \in R \implies (a, c) \in R"},
    ],
    "Basic Combinatorics": [
        {"name": "Permutations (Order Matters)", "latex": r"P(n, r) = \frac{n!}{(n-r)!}"},
        {"name": "Combinations (Order Doesn't Matter)", "latex": r"C(n, r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}"},
        {"name": "Pascal's Identity", "latex": r"\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}"},
    ]
}