""" DATA STRUCTURES & ALGORITHMS III formulas """
CLASS_NAME = "DATA STRUCTURES & ALGORITHMS III"

FORMULAS = {
    "Advanced Data Structures": [
        {"name": "Disjoint Set (Union-Find)", "latex": r"\text{Find/Union: } O(\alpha(n)) \text{ (Inverse Ackermann)}"},
        {"name": "Segment Tree", "latex": r"\text{Build: } O(n), \text{ Query/Update: } O(\log n)"},
        {"name": "Fenwick Tree (Binary Indexed Tree)", "latex": r"\text{Build: } O(n \log n), \text{ Query/Update: } O(\log n)"},
        {"name": "Bloom Filter (False Positive Probability)", "latex": r"P = \left(1 - e^{-kn/m}\right)^k"},
    ],
    "Advanced Graphs & Network Flow": [
        {"name": "Topological Sort", "latex": r"\text{Time: } O(V + E) \quad \text{(DAGs only)}"},
        {"name": "Tarjan's (Strongly Connected Components)", "latex": r"\text{Time: } O(V + E)"},
        {"name": "Ford-Fulkerson (Max Flow)", "latex": r"\text{Time: } O(E \cdot f^*) \quad (f^* = \text{max flow})"},
        {"name": "Edmonds-Karp Algorithm", "latex": r"\text{Time: } O(V \cdot E^2)"},
    ],
    "Advanced String Matching": [
        {"name": "Rabin-Karp (Rolling Hash)", "latex": r"H(S_{i+1}) = (H(S_i) - S[i] \cdot B^{M-1}) \cdot B + S[i+M] \pmod P"},
        {"name": "Z-Algorithm", "latex": r"\text{Time: } O(N + M)"},
        {"name": "Suffix Array Construction", "latex": r"\text{Time: } O(n \log n) \text{ or } O(n)"},
    ],
    "Computational Geometry": [
        {"name": "2D Cross Product (Orientation)", "latex": r"(p_2.x - p_1.x)(p_3.y - p_1.y) - (p_2.y - p_1.y)(p_3.x - p_1.x)"},
        {"name": "Graham Scan (Convex Hull)", "latex": r"\text{Time: } O(n \log n)"},
        {"name": "Closest Pair of Points", "latex": r"\text{Time: } O(n \log n) \quad \text{(Divide \& Conquer)}"},
    ]
}