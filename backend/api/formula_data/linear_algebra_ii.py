""" LINEAR ALGEBRA II formulas """
CLASS_NAME = "LINEAR ALGEBRA II"

FORMULAS = {
    "Matrix Properties & Classifications": [
        {"name": "Invertibility Condition", "latex": r"A \text{ is invertible iff } \det(A) \neq 0"},
        {"name": "Matrix Multiplication Property", "latex": r"(AB)^{-1} = B^{-1}A^{-1}"},
        {"name": "Orthogonal Matrix", "latex": r"Q^T Q = I \implies Q^{-1} = Q^T"},
        {"name": "Symmetric Matrix", "latex": r"A^T = A"},
        {"name": "Positive Definite Condition", "latex": r"\mathbf{x}^TA\mathbf{x} > 0 \text{ for all } \mathbf{x} \neq \mathbf{0}"},
    ],
    "Vector Spaces & Bases": [
        {"name": "Linear Independence", "latex": r"c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0} \implies c_i = 0"},
        {"name": "Rank-Nullity Theorem", "latex": r"\text{rank}(A) + \text{nullity}(A) = n"},
        {"name": "Change of Basis", "latex": r"[\mathbf{x}]_\mathcal{B} = P_{\mathcal{B} \leftarrow \mathcal{C}} [\mathbf{x}]_\mathcal{C}"},
    ],
    "Inner Product Spaces": [
        {"name": "Cauchy-Schwarz Inequality", "latex": r"|\langle \mathbf{u}, \mathbf{v} \rangle| \le \|\mathbf{u}\| \|\mathbf{v}\|"},
        {"name": "Triangle Inequality", "latex": r"\|\mathbf{u} + \mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\|"},
        {"name": "Projection Formula", "latex": r"\text{proj}_{\mathbf{u}}(\mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|^2}\mathbf{u}"},
        {"name": "Gram-Schmidt Process", "latex": r"\mathbf{u}_k = \mathbf{v}_k - \sum_{j=1}^{k-1} \text{proj}_{\mathbf{u}_j}(\mathbf{v}_k)"},
    ],
    "Eigenvalues & Diagonalization": [
        {"name": "Characteristic Equation", "latex": r"\det(A - \lambda I) = 0"},
        {"name": "Eigenvector Definition", "latex": r"A\mathbf{v} = \lambda\mathbf{v}"},
        {"name": "Eigenspace Definition", "latex": r"E_\lambda = \text{Nul}(A - \lambda I)"},
        {"name": "Diagonalization", "latex": r"A = PDP^{-1}"},
        {"name": "Spectral Theorem (Symmetric A)", "latex": r"A = QDQ^T \quad (Q^TQ = I)"},
    ],
    "Decompositions": [
        {"name": "Singular Value Decomposition (SVD)", "latex": r"A = U\Sigma V^T"},
        {"name": "QR Decomposition", "latex": r"A = QR \quad (Q \text{ orthogonal}, R \text{ upper triangular})"},
        {"name": "Quadratic Form", "latex": r"Q(\mathbf{x}) = \mathbf{x}^TA\mathbf{x}"},
    ],
    "Fundamental Subspaces": [
        {"name": "Column Space C(A)", "latex": r"C(A) = \text{Span}(\mathbf{a}_1, \dots, \mathbf{a}_n)"},
        {"name": "Null Space N(A)", "latex": r"N(A) = \{\mathbf{x} \in \mathbb{R}^n \mid A\mathbf{x} = \mathbf{0}\}"},
        {"name": "Row Space", "latex": r"C(A^T) = \text{Span}(\text{rows of } A)"},
        {"name": "Left Null Space", "latex": r"N(A^T) = \{\mathbf{y} \in \mathbb{R}^m \mid A^T\mathbf{y} = \mathbf{0}\}"},
    ],
    "Orthogonal Projections": [
        {"name": "Projection Matrix", "latex": r"P = A(A^TA)^{-1}A^T"},
        {"name": "Projection of b onto C(A)", "latex": r"\mathbf{p} = P\mathbf{b}"},
        {"name": "Error Vector (Orthogonal)", "latex": r"\mathbf{e} = \mathbf{b} - \mathbf{p}"},
    ],
    "Markov Chains": [
        {"name": "State Vector Update", "latex": r"\mathbf{x}_{k+1} = P\mathbf{x}_k"},
        {"name": "Steady-State Vector", "latex": r"P\mathbf{q} = \mathbf{q} \quad (\text{Eigenvector for } \lambda=1)"},
    ]
}