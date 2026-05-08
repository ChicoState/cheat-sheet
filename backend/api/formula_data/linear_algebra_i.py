""" LINEAR ALGEBRA I formulas """
CLASS_NAME = "LINEAR ALGEBRA I"

FORMULAS = {
    "Vector Basics": [
        {"name": "Vector Addition", "latex": r"\mathbf{u} + \mathbf{v} = \langle u_1+v_1, u_2+v_2 \rangle"},
        {"name": "Scalar Multiplication", "latex": r"k\mathbf{u} = \langle ku_1, ku_2 \rangle"},
        {"name": "Magnitude (L2 Norm)", "latex": r"\|\mathbf{v}\| = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2}"},
        {"name": "Dot Product", "latex": r"\mathbf{u} \cdot \mathbf{v} = u_1v_1 + u_2v_2 + \dots + u_nv_n"},
        {"name": "Dot Product & Angle", "latex": r"\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\|\|\mathbf{v}\|\cos(\theta)"},
        {"name": "Cross Product (3D)", "latex": r"\mathbf{u} \times \mathbf{v} = \langle u_2v_3-u_3v_2, \ u_3v_1-u_1v_3, \ u_1v_2-u_2v_1 \rangle"},
        {"name": "Unit Vector", "latex": r"\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}"},
        {"name": "Vector Projection", "latex": r"\text{proj}_{\mathbf{v}}(\mathbf{u}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\mathbf{v}"},
    ],
    "Matrix Operations": [
        {"name": "Matrix Addition", "latex": r"A + B = [a_{ij} + b_{ij}]"},
        {"name": "Matrix-Vector Multiplication", "latex": r"A\mathbf{x} = \mathbf{b}"},
        {"name": "Matrix Multiplication", "latex": r"(AB)_{ij} = \sum_{k=1}^n A_{ik}B_{kj}"},
        {"name": "Transpose", "latex": r"(A^T)_{ij} = A_{ji}"},
        {"name": "Transpose Properties", "latex": r"(A^T)^T = A, \quad (AB)^T = B^T A^T"},
        {"name": "Trace", "latex": r"\text{tr}(A) = \sum_{i=1}^n a_{ii}"},
    ],
    "Determinants & Inverses": [
        {"name": "2x2 Determinant", "latex": r"\det(A) = ad - bc"},
        {"name": "2x2 Inverse", "latex": r"A^{-1} = \frac{1}{ad-bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}"},
        {"name": "3x3 Determinant Expansion", "latex": r"\det(A) = a(ei-fh) - b(di-fg) + c(dh-eg)"},
        {"name": "Inverse via Adjugate", "latex": r"A^{-1} = \frac{1}{\det(A)} \text{adj}(A)"},
    ],
    "Linear Systems": [
        {"name": "General System", "latex": r"A\mathbf{x} = \mathbf{b}"},
        {"name": "Homogeneous System", "latex": r"A\mathbf{x} = \mathbf{0}"},
        {"name": "Cramer's Rule", "latex": r"x_i = \frac{\det(A_i)}{\det(A)}"},
        {"name": "Least Squares Solution", "latex": r"\mathbf{\hat{x}} = (A^TA)^{-1}A^T\mathbf{b}"},
    ],
    "Lines & Planes": [
        {"name": "Line Equation (Parametric)", "latex": r"\mathbf{r}(t) = \mathbf{r}_0 + t\mathbf{v}"},
        {"name": "Plane Equation (Normal Form)", "latex": r"\mathbf{n} \cdot (\mathbf{r} - \mathbf{r}_0) = 0"},
        {"name": "Distance from Point to Plane", "latex": r"D = \frac{|ax_0 + by_0 + cz_0 + d|}{\sqrt{a^2 + b^2 + c^2}}"},
    ],
    "Determinant Properties": [
        {"name": "Multiplicative Property", "latex": r"\det(AB) = \det(A)\det(B)"},
        {"name": "Transpose Property", "latex": r"\det(A^T) = \det(A)"},
        {"name": "Scalar Multiplication", "latex": r"\det(kA) = k^n \det(A)"},
        {"name": "Inverse Property", "latex": r"\det(A^{-1}) = \frac{1}{\det(A)}"},
    ],
    "2D Transformations": [
        {"name": "Rotation Matrix (CCW)", "latex": r"R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}"},
        {"name": "Reflection Matrix (x-axis)", "latex": r"T = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}"},
        {"name": "Scaling Matrix", "latex": r"S = \begin{bmatrix} s_x & 0 \\ 0 & s_y \end{bmatrix}"},
    ]
}