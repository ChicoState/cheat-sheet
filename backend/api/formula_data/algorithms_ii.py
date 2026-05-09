""" DATA STRUCTURES & ALGORITHMS II formulas """
CLASS_NAME = "DATA STRUCTURES & ALGORITHMS II"

FORMULAS = {
    "Non-Linear Data Structures": [
        {"name": "Binary Search Tree", "latex": r"\text{Search/Insert: } O(\log n) \text{ avg, } O(n) \text{ worst}"},
        {"name": "Balanced BST (AVL/Red-Black)", "latex": r"\text{Search/Insert/Delete: } O(\log n) \text{ worst}"},
        {"name": "Min/Max Heap", "latex": r"\text{Peek: } O(1), \text{ Insert/Extract: } O(\log n)"},
        {"name": "Trie (Prefix Tree)", "latex": r"\text{Search/Insert: } O(L) \quad (L = \text{word length})"},
    ],
    "Graph Algorithms": [
        {"name": "BFS / DFS", "latex": r"\text{Time: } O(V + E), \text{ Space: } O(V)"},
        {"name": "Dijkstra's (Min-Heap)", "latex": r"\text{Time: } O((V + E) \log V)"},
        {"name": "Bellman-Ford", "latex": r"\text{Time: } O(V \cdot E)"},
        {"name": "Floyd-Warshall", "latex": r"\text{Time: } O(V^3)"},
        {"name": "Prim's / Kruskal's (MST)", "latex": r"\text{Time: } O(E \log V)"},
    ],
    "Dynamic Programming": [
        {"name": "0/1 Knapsack", "latex": r"dp[i][w] = \max(dp[i-1][w], dp[i-1][w-w_i] + v_i)"},
        {"name": "Longest Common Subsequence", "latex": r"dp[i][j] = dp[i-1][j-1] + 1 \text{ (if match)}"},
        {"name": "Longest Increasing Subsequence", "latex": r"dp[i] = \max(dp[i], dp[j] + 1) \text{ for } j < i \text{ and } A[j] < A[i]"},
    ],
    "String & Bitwise Algorithms": [
        {"name": "KMP (Pattern Matching)", "latex": r"\text{Time: } O(N + M), \text{ Space: } O(M)"},
        {"name": "Check if Power of 2", "latex": r"(n \ \& \ (n - 1)) == 0"},
        {"name": "Multiply by 2^k", "latex": r"n \ll k"},
        {"name": "Divide by 2^k", "latex": r"n \gg k"},
    ]
}