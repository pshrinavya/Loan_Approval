from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

from backend.schemas import LoanApplication


# ==========================================
# 1. CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="Loan Approval Prediction API",
    description="API for predicting loan approval using Logistic Regression",
    version="1.0.0"
)


# ==========================================
# 2. ENABLE CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 3. LOAD TRAINED MODEL
# ==========================================

model = joblib.load("ml/loan_model.pkl")
metrics = joblib.load("ml/model_metrics.pkl")


# ==========================================
# 4. HOME ENDPOINT
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Loan Approval Prediction API is running"
    }


# ==========================================
# 5. HEALTH ENDPOINT
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ==========================================
# 6. PREDICTION ENDPOINT
# ==========================================

@app.post("/predict")
def predict(application: LoanApplication):

    # Convert input into dictionary
    data = application.model_dump()

    # Convert dictionary into DataFrame
    input_data = pd.DataFrame([data])

    # Get prediction
    prediction = model.predict(input_data)[0]

    # Get probabilities
    probabilities = model.predict_proba(input_data)[0]

    # Probability of rejection
    rejection_probability = probabilities[0]

    # Probability of approval
    approval_probability = probabilities[1]

    # Convert prediction number to text
    if prediction == 1:
        result = "Approved"
    else:
        result = "Rejected"

    return {
        "prediction": result,
        "approval_probability": round(
            float(approval_probability), 4
        ),
        "rejection_probability": round(
            float(rejection_probability), 4
        ),
        "model": "Logistic Regression"
    }


# ==========================================
# MODEL METRICS
# ==========================================

@app.get("/metrics")
def get_metrics():

    return {

        "model": "Logistic Regression",

        "accuracy":
            round(
                metrics["accuracy"],
                4
            ),

        "precision":
            round(
                metrics["precision"],
                4
            ),

        "recall":
            round(
                metrics["recall"],
                4
            ),

        "f1_score":
            round(
                metrics["f1_score"],
                4
            ),

        "roc_auc":
            round(
                metrics["roc_auc"],
                4
            )

    }



# ==========================================
# DATASET STATISTICS
# ==========================================

@app.get("/stats")
def get_stats():

    df = pd.read_csv("dataset/loan_approval_dataset.csv")

    total_applications = len(df)

    # Average loan amount
    avg_loan_amount = None

    if "Loan_Amount" in df.columns:
        avg_loan_amount = float(
            pd.to_numeric(
                df["Loan_Amount"],
                errors="coerce"
            ).mean()
        )

    possible_target_columns = [
        "Loan_Status",
        "Loan_Approval",
        "Loan_Approved",
        "Approved",
        "LoanApproval",
        "loan_status"
    ]

    target_column = None

    for column in possible_target_columns:

        if column in df.columns:
            target_column = column
            break

    approval_rate = None

    if target_column is not None:

        values = (
            df[target_column]
            .astype(str)
            .str.strip()
            .str.lower()
        )

        approved_values = [
            "approved",
            "approve",
            "yes",
            "y",
            "1",
            "true"
        ]

        approved_count = values.isin(
            approved_values
        ).sum()

        approval_rate = (
            approved_count / total_applications
        ) * 100

    return {

        "total_applications":
            total_applications,

        "approval_rate":
            round(approval_rate, 2)
            if approval_rate is not None
            else None,

        "avg_loan_amount":
            round(avg_loan_amount, 2)
            if avg_loan_amount is not None
            else None
    }
