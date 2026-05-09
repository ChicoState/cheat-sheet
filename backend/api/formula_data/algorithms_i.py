""" DATA STRUCTURES & ALGORITHMS I formulas """
CLASS_NAME = "DATA STRUCTURES & ALGORITHMS I"

FORMULAS = {
    "Asymptotic Notation": [
        {"name": "Big-O (Upper Bound)", "latex": r"f(n) \le c \cdot g(n) \implies O(g(n))"},
        {"name": "Big-Omega (Lower Bound)", "latex": r"f(n) \ge c \cdot g(n) \implies \Omega(g(n))"},
        {"name": "Big-Theta (Tight Bound)", "latex": r"c_1 g(n) \le f(n) \le c_2 g(n) \implies \Theta(g(n))"},
        {"name": "Master Theorem Formula", "latex": r"T(n) = aT\left(\frac{n}{b}\right) + O(n^d)"},
    ],
    "Linear Data Structures (Time)": [
        {"name": "Dynamic Array", "latex": r"\text{Access: } O(1), \text{ Append: } O(1) \text{ amortized}"},
        {"name": "Singly Linked List", "latex": r"\text{Search: } O(n), \text{ Insert/Delete at Head: } O(1)"},
        {"name": "Stack", "latex": r"\text{Push/Pop/Peek: } O(1)"},
        {"name": "Queue", "latex": r"\text{Enqueue/Dequeue: } O(1)"},
        {"name": "Hash Table", "latex": r"\text{Search/Insert/Delete: } O(1) \text{ avg, } O(n) \text{ worst}"},
    ],
    "Sorting Algorithms": [
        {"name": "Merge Sort", "latex": r"\text{Time: } O(n \log n), \text{ Space: } O(n)"},
        {"name": "Quick Sort", "latex": r"\text{Time: } O(n \log n) \text{ avg, Space: } O(\log n)"},
        {"name": "Insertion Sort", "latex": r"\text{Time: } O(n^2) \text{ worst, } O(n) \text{ best (sorted)}"},
        {"name": "Selection Sort", "latex": r"\text{Time: } O(n^2), \text{ Space: } O(1)"},
        {"name": "Counting Sort", "latex": r"\text{Time: } O(n + k), \text{ Space: } O(k)"},
    ],
    "Search & Selection": [
        {"name": "Binary Search", "latex": r"\text{Time: } O(\log n), \text{ Space: } O(1)"},
        {"name": "Linear Search", "latex": r"\text{Time: } O(n), \text{ Space: } O(1)"},
        {"name": "Quickselect", "latex": r"\text{Time: } O(n) \text{ avg, } O(n^2) \text{ worst}"},
    ]
}