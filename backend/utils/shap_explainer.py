import shap
import pandas as pd

def generate_shap_explanations(model, input_df: pd.DataFrame):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(input_df)
    
    if isinstance(shap_values, list):
        applicant_shap = shap_values[1][0] 
    else:
        applicant_shap = shap_values[0]

    feature_names = input_df.columns.tolist()
    
    # COMPLIANCE: Adhering strictly to schemas.py ShapExplanations
    positive_factors = []
    negative_factors = []
    
    for i, feature in enumerate(feature_names):
        impact_value = float(applicant_shap[i])
        
        factor = {
            "feature": feature,
            "impact": abs(round(impact_value, 4)), 
            "message": f"{feature} impacted the score by {abs(round(impact_value*100, 1))}%"
        }
        
        # Positive SHAP pushes default risk up (Bad for applicant -> negative factor for credit)
        if impact_value > 0:
            negative_factors.append(factor)
        else:
            positive_factors.append(factor)
            
    return {
        "positive_factors": positive_factors,
        "negative_factors": negative_factors
    }