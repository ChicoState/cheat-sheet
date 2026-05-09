""" CHEMISTRY I formulas """
CLASS_NAME = "CHEMISTRY I"

FORMULAS = {
    "Moles & Stoichiometry": [
        {"name": "Avogadro's Number", "latex": r"N_A = 6.022 \times 10^{23} \text{ particles/mol}"},
        {"name": "Molarity (M)", "latex": r"M = \frac{\text{moles of solute}}{\text{liters of solution}}"},
        {"name": "Molality (m)", "latex": r"m = \frac{\text{moles of solute}}{\text{kg of solvent}}"},
        {"name": "Dilution", "latex": r"M_1V_1 = M_2V_2"},
        {"name": "Percent Yield", "latex": r"\% \text{ Yield} = \left( \frac{\text{Actual Yield}}{\text{Theoretical Yield}} \right) \times 100"},
    ],
    "Gas Laws": [
        {"name": "Ideal Gas Law", "latex": r"PV = nRT"},
        {"name": "Combined Gas Law", "latex": r"\frac{P_1V_1}{T_1} = \frac{P_2V_2}{T_2}"},
        {"name": "Dalton's Law of Partial Pressures", "latex": r"P_{\text{total}} = P_1 + P_2 + P_3 + \dots"},
        {"name": "Graham's Law of Effusion", "latex": r"\frac{\text{Rate}_1}{\text{Rate}_2} = \sqrt{\frac{M_2}{M_1}}"},
        {"name": "Root Mean Square Speed", "latex": r"v_{rms} = \sqrt{\frac{3RT}{M}}"},
    ],
    "Thermochemistry": [
        {"name": "Specific Heat (Calorimetry)", "latex": r"q = mc\Delta T"},
        {"name": "Heat Capacity", "latex": r"q = C\Delta T"},
        {"name": "Standard Enthalpy of Reaction", "latex": r"\Delta H^\circ_{\text{rxn}} = \sum \Delta H_f^\circ(\text{products}) - \sum \Delta H_f^\circ(\text{reactants})"},
    ],
    "Atomic Structure & Light": [
        {"name": "Speed of Light", "latex": r"c = \lambda \nu \quad (c = 3.00 \times 10^8 \text{ m/s})"},
        {"name": "Energy of a Photon", "latex": r"E = h\nu = \frac{hc}{\lambda}"},
        {"name": "De Broglie Wavelength", "latex": r"\lambda = \frac{h}{mv}"},
        {"name": "Rydberg Equation", "latex": r"\frac{1}{\lambda} = R_H \left(\frac{1}{n_1^2} - \frac{1}{n_2^2}\right)"},
    ],
    "Solutions & Properties": [
        {"name": "Raoult's Law (Vapor Pressure)", "latex": r"P_A = X_A P_A^\circ"},
        {"name": "Boiling Point Elevation", "latex": r"\Delta T_b = i K_b m"},
        {"name": "Freezing Point Depression", "latex": r"\Delta T_f = -i K_f m"},
        {"name": "Osmotic Pressure", "latex": r"\Pi = iMRT"},
    ]
}