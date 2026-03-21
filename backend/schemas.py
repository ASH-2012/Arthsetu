from pydantic import BaseModel, Field
from typing import List


# 1. INPUT SCHEMAS 

class FinancialDataInput(BaseModel):
    # Field(...) means it is strictly required. No missing values allowed.
    # gt=0 means Greater Than 0. ge=0 means Greater Than or Equal to 0.
    Income_Annual: float = Field(..., description="Annual income in INR", gt=0)
    Savings_Balance: float = Field(..., description="Current savings balance", ge=0)
    Spending_Ratio: float = Field(..., description="Ratio of expenses to income", ge=0, le=10)
    Utility_Bill_Late_Count: int = Field(..., description="Number of late utility payments", ge=0)
    Credit_History_Length_Months: int = Field(..., description="Months of alternative credit history", ge=0)

class CreditEvaluationRequest(BaseModel):
    applicant_id: str = Field(..., description="Unique identifier for the applicant")
    financial_data: FinancialDataInput


# 2. OUTPUT SCHEMAS 

class ShapFactor(BaseModel):
    feature: str = Field(..., description="The name of the feature (e.g., Utility_Bill_Late_Count)")
    impact: float = Field(..., description="The SHAP value impact (+ raises risk, - lowers risk)")
    message: str = Field(..., description="Human-readable explanation for the UI")

class ShapExplanations(BaseModel):
    positive_factors: List[ShapFactor] = Field(..., description="Factors lowering default risk")
    negative_factors: List[ShapFactor] = Field(..., description="Factors increasing default risk")

class CreditAssessment(BaseModel):
    probability_of_default: float = Field(..., description="Raw XGBoost probability", ge=0, le=1)
    risk_category: str = Field(..., description="Low, Medium, or High Risk")
    credit_score_equivalent: int = Field(..., description="Scaled score (e.g., 300 to 900)")
    max_approval_limit: int = Field(..., description="Approved loan amount in INR", ge=0)

class CreditEvaluationResponse(BaseModel):
    status: str = Field(default="success")
    assessment: CreditAssessment
    shap_explanations: ShapExplanations