""" CHEMISTRY II formulas """
CLASS_NAME = "CHEMISTRY II"

FORMULAS = {
    "Thermodynamics": [
        {"name": "Gibbs Free Energy", "latex": r"\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ"},
        {"name": "Free Energy & Equilibrium", "latex": r"\Delta G^\circ = -RT \ln K"},
        {"name": "Free Energy (Non-Standard)", "latex": r"\Delta G = \Delta G^\circ + RT \ln Q"},
        {"name": "Boltzmann Entropy", "latex": r"S = k_B \ln W"},
    ],
    "Kinetics": [
        {"name": "Zero-Order Integrated Rate Law", "latex": r"[A]_t = -kt + [A]_0"},
        {"name": "First-Order Integrated Rate Law", "latex": r"\ln[A]_t = -kt + \ln[A]_0"},
        {"name": "Second-Order Integrated Rate Law", "latex": r"\frac{1}{[A]_t} = kt + \frac{1}{[A]_0}"},
        {"name": "Half-Life (First-Order)", "latex": r"t_{1/2} = \frac{0.693}{k}"},
        {"name": "Arrhenius Equation", "latex": r"k = Ae^{-\frac{E_a}{RT}}"},
    ],
    "Chemical Equilibrium": [
        {"name": "Equilibrium Constant (Concentration)", "latex": r"K_c = \frac{[C]^c [D]^d}{[A]^a [B]^b}"},
        {"name": "Equilibrium Constant (Pressure)", "latex": r"K_p = K_c(RT)^{\Delta n}"},
        {"name": "Reaction Quotient", "latex": r"Q = \frac{[C]^c [D]^d}{[A]^a [B]^b} \quad (\text{at any time } t)"},
    ],
    "Acids, Bases & Buffers": [
        {"name": "pH and pOH", "latex": r"\text{pH} = -\log[H^+], \quad \text{pOH} = -\log[OH^-]"},
        {"name": "Water Ionization Constant", "latex": r"K_w = [H^+][OH^-] = 1.0 \times 10^{-14}"},
        {"name": "Weak Acid Equilibrium", "latex": r"K_a = \frac{[H^+][A^-]}{[HA]}"},
        {"name": "Henderson-Hasselbalch (Buffers)", "latex": r"\text{pH} = \text{pK}_a + \log\left(\frac{[\text{A}^-]}{[\text{HA}]}\right)"},
    ],
    "Electrochemistry": [
        {"name": "Standard Cell Potential", "latex": r"E^\circ_{\text{cell}} = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}"},
        {"name": "Nernst Equation", "latex": r"E = E^\circ - \frac{RT}{nF} \ln Q"},
        {"name": "Gibbs Free Energy & Voltage", "latex": r"\Delta G^\circ = -nFE^\circ_{\text{cell}}"},
        {"name": "Faraday's Law of Electrolysis", "latex": r"I = \frac{q}{t} \implies m = \frac{I \cdot t \cdot M}{n \cdot F}"},
    ]
}