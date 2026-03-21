import shap
import pandas as pd

def generate_shap_explanations(model, input_df: pd.DataFrame):
    """
    Takes the trained XGBoost model and the user's input dataframe.
    Returns a list of dictionaries formatted for the React frontend.
    """
    # 1. Initialize the SHAP explainer
    explainer = shap.TreeExplainer(model)
    
    # 2. Calculate SHAP values for the specific applicant
    shap_values = explainer.shap_values(input_df)
    
    # XGBoost binary classification returns a 2D array or a list depending on version.
    # Extract the values for the specific row (index 0)
    if isinstance(shap_values, list):
        applicant_shap = shap_values[1][0] # Focus on the 'default' class
    else:
        applicant_shap = shap_values[0]

    feature_names = input_df.columns.tolist()
    
    explanations = []
    
    # 3. Format the output to strictly match the API contract
    for i, feature in enumerate(feature_names):
        impact_value = float(applicant_shap[i])
        
        # Determine direction. Positive SHAP means higher risk (bad). Negative means lower risk (good).
        # We map this to the frontend: positive impact on default risk -> red bar.
        direction = "negative" if impact_value > 0 else "positive"
        
        explanations.append({
            "feature": feature,
            "impact": abs(round(impact_value, 4)), 
            "direction": direction
        })
        
    return explanations