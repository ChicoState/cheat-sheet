""" STATISTICS II formulas """
CLASS_NAME = "STATISTICS II"

FORMULAS = {
    "Two-Sample Inference": [
        {"name": "Two-Sample t-Test (Means)", "latex": r"t = \frac{(\bar{x}_1 - \bar{x}_2)}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}"},
        {"name": "Two-Sample z-Test (Proportions)", "latex": r"z = \frac{(\hat{p}_1 - \hat{p}_2)}{\sqrt{\hat{p}_c(1-\hat{p}_c)(\frac{1}{n_1} + \frac{1}{n_2})}}"},
        {"name": "Pooled Proportion", "latex": r"\hat{p}_c = \frac{x_1 + x_2}{n_1 + n_2}"},
        {"name": "CI for Diff. of Means", "latex": r"(\bar{x}_1 - \bar{x}_2) \pm t^* \sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}"},
    ],
    "Chi-Square Tests": [
        {"name": "Chi-Square Statistic", "latex": r"\chi^2 = \sum \frac{(O - E)^2}{E}"},
        {"name": "Expected Count", "latex": r"E = \frac{\text{row total} \times \text{column total}}{\text{table total}}"},
        {"name": "Degrees of Freedom (Matrix)", "latex": r"df = (r-1)(c-1)"},
        {"name": "Degrees of Freedom (Goodness of Fit)", "latex": r"df = k - 1"},
    ],
    "Linear & Multiple Regression": [
        {"name": "Simple Regression Line", "latex": r"\hat{y} = b_0 + b_1x"},
        {"name": "Correlation Coefficient (r)", "latex": r"r = \frac{1}{n-1} \sum \left(\frac{x_i - \bar{x}}{s_x}\right)\left(\frac{y_i - \bar{y}}{s_y}\right)"},
        {"name": "Coefficient of Determination", "latex": r"R^2 = \frac{SSR}{SST} = 1 - \frac{SSE}{SST}"},
        {"name": "Multiple Regression Model", "latex": r"\hat{y} = b_0 + b_1x_1 + b_2x_2 + \dots + b_kx_k"},
    ],
    "ANOVA (Analysis of Variance)": [
        {"name": "F-Statistic", "latex": r"F = \frac{MSG}{MSE}"},
        {"name": "Mean Square (Groups)", "latex": r"MSG = \frac{SSG}{k-1}"},
        {"name": "Mean Square (Error)", "latex": r"MSE = \frac{SSE}{N-k}"},
        {"name": "Total Sum of Squares", "latex": r"SST = SSG + SSE"},
    ]
}