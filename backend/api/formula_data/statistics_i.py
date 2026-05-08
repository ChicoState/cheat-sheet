""" STATISTICS I formulas """
CLASS_NAME = "STATISTICS I"

FORMULAS = {
    "Descriptive Statistics": [
        {"name": "Sample Mean", "latex": r"\bar{x} = \frac{\sum x_i}{n}"},
        {"name": "Population Mean", "latex": r"\mu = \frac{\sum x_i}{N}"},
        {"name": "Sample Variance", "latex": r"s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}"},
        {"name": "Sample Standard Deviation", "latex": r"s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}}"},
        {"name": "Z-Score", "latex": r"z = \frac{x - \mu}{\sigma}"},
    ],
    "Probability": [
        {"name": "Addition Rule", "latex": r"P(A \cup B) = P(A) + P(B) - P(A \cap B)"},
        {"name": "Multiplication Rule", "latex": r"P(A \cap B) = P(A) \cdot P(B|A)"},
        {"name": "Conditional Probability", "latex": r"P(A|B) = \frac{P(A \cap B)}{P(B)}"},
        {"name": "Bayes' Theorem", "latex": r"P(A|B) = \frac{P(B|A)P(A)}{P(B)}"},
        {"name": "Expected Value", "latex": r"E(X) = \mu_X = \sum [x_i \cdot P(x_i)]"},
    ],
    "Distributions": [
        {"name": "Binomial Probability", "latex": r"P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}"},
        {"name": "Mean of Binomial Dist.", "latex": r"\mu_X = np"},
        {"name": "Standard Dev. of Binomial", "latex": r"\sigma_X = \sqrt{np(1-p)}"},
        {"name": "Poisson Probability", "latex": r"P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}"},
        {"name": "Normal Distribution (PDF)", "latex": r"f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}"},
    ],
    "Inferential Statistics": [
        {"name": "Confidence Interval (Mean)", "latex": r"\bar{x} \pm z^* \frac{\sigma}{\sqrt{n}}"},
        {"name": "Confidence Interval (Proportion)", "latex": r"\hat{p} \pm z^* \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}"},
        {"name": "Margin of Error", "latex": r"ME = z^* \frac{\sigma}{\sqrt{n}}"},
        {"name": "Test Statistic (1-Sample Z)", "latex": r"z = \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}"},
    ]
}