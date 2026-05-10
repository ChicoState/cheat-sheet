""" DISCRETE MATH II formulas """
CLASS_NAME = "DISCRETE MATH II"

FORMULAS = {
    "Advanced Counting": [
        {"name": "Pigeonhole Principle", "latex": r"\text{If } n \text{ items are in } m \text{ boxes, at least one box has } \lceil \frac{n}{m} \rceil \text{ items}"},
        {"name": "Stars and Bars", "latex": r"\text{Ways to put } n \text{ identical objects into } k \text{ distinct bins: } \binom{n+k-1}{k-1}"},
        {"name": "Inclusion-Exclusion (3 Sets)", "latex": r"|A \cup B \cup C| = |A|+|B|+|C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|"},
    ],
    "Number Theory & Cryptography": [
        {"name": "Division Algorithm", "latex": r"a = dq + r, \quad 0 \le r < d"},
        {"name": "Bezout's Identity", "latex": r"\exists s, t \in \mathbb{Z} \text{ s.t. } as + bt = \gcd(a, b)"},
        {"name": "Fermat's Little Theorem", "latex": r"a^{p-1} \equiv 1 \pmod p \quad \text{(for prime } p\text{)}"},
        {"name": "Euler's Totient Function", "latex": r"\phi(p) = p-1, \quad \phi(pq) = (p-1)(q-1)"},
    ],
    "Graph Theory": [
        {"name": "Handshaking Lemma", "latex": r"\sum_{v \in V} \deg(v) = 2|E|"},
        {"name": "Euler's Formula (Planar Graphs)", "latex": r"V - E + F = 2"},
        {"name": "Complete Graph Edges (K_n)", "latex": r"|E| = \frac{n(n-1)}{2}"},
        {"name": "Tree Edges", "latex": r"|E| = |V| - 1"},
        {"name": "Chromatic Number (\chi)", "latex": r"\text{Minimum colors needed to color } G \text{ such that no adjacent vertices share a color}"},
    ],
    "Recurrence Relations": [
        {"name": "Linear Homogeneous (Distinct Roots)", "latex": r"a_n = \alpha_1 r_1^n + \alpha_2 r_2^n"},
        {"name": "Linear Homogeneous (Single Root)", "latex": r"a_n = \alpha_1 r^n + \alpha_2 n r^n"},
        {"name": "Fibonacci Sequence", "latex": r"F_n = F_{n-1} + F_{n-2}, \quad F_0 = 0, F_1 = 1"},
    ]
}