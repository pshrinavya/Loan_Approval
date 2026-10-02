import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)


# ==========================================
# LOAD DATASET
# ==========================================

df = pd.read_csv("dataset/loan_approval_dataset.csv")

print("Dataset loaded successfully!")
print("Dataset shape:", df.shape)


# ==========================================
# CONVERT NUMERICAL COLUMNS
# ==========================================

numeric_columns = [
    "Credit_Score",
    "Applicant_Income",
    "Coapplicant_Income",
    "Loan_Amount",
    "Loan_Amount_Term",
    "Debt_to_Income_Ratio",
    "Employment_Duration",
    "Dependents"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )


# ==========================================
# SELECT FEATURES
# ==========================================

features = [
    "Credit_Score",
    "Applicant_Income",
    "Coapplicant_Income",
    "Loan_Amount",
    "Loan_Amount_Term",
    "Debt_to_Income_Ratio",
    "Employment_Duration",
    "Employment_Type",
    "Property_Area",
    "Dependents"
]

X = df[features]


# ==========================================
#  CREATE TARGET
# ==========================================

y = df["Loan_Status"].map({
    "Approved": 1,
    "Rejected": 0
})


# ==========================================
#  SEPARATE FEATURE TYPES
# ==========================================

numeric_features = [
    "Credit_Score",
    "Applicant_Income",
    "Coapplicant_Income",
    "Loan_Amount",
    "Loan_Amount_Term",
    "Debt_to_Income_Ratio",
    "Employment_Duration",
    "Dependents"
]

categorical_features = [
    "Employment_Type",
    "Property_Area"
]


# ==========================================
# NUMERICAL PIPELINE
# ==========================================

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])


# ==========================================
# CATEGORICAL PIPELINE
# ==========================================

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])


# ==========================================
# COMBINE PREPROCESSING
# ==========================================

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numeric_features),
    ("cat", categorical_pipeline, categorical_features)
])


# ==========================================
#  CREATE COMPLETE ML PIPELINE
# ==========================================

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(
        max_iter=1000,
        random_state=42
    ))
])


# ==========================================
#  TRAIN-TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
#  TRAIN MODEL
# ==========================================

print("\nTraining Logistic Regression...")

model.fit(X_train, y_train)

print("Model trained successfully!")


# ==========================================
# MAKE PREDICTIONS
# ==========================================

y_pred = model.predict(X_test)

y_probability = model.predict_proba(X_test)[:, 1]


# ==========================================
# EVALUATE MODEL
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)


print("\n================================")
print("MODEL EVALUATION")
print("================================")

print(f"Accuracy  : {accuracy:.4f}")
print(f"Precision : {precision:.4f}")
print(f"Recall    : {recall:.4f}")
print(f"F1 Score  : {f1:.4f}")
print(f"ROC-AUC   : {roc_auc:.4f}")


# ==========================================
#  CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["Rejected", "Approved"],
        zero_division=0
    )
)


# ==========================================
#  CONFUSION MATRIX
# ==========================================

print("\nConfusion Matrix:")

cm = confusion_matrix(
    y_test,
    y_pred
)

print(cm)


# ==========================================
#  SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "loan_model.pkl"
)

print("\nModel saved successfully!")
print("File: ml/loan_model.pkl")


# ==========================================
# SAVE MODEL METRICS
# ==========================================

metrics = {

    "accuracy": accuracy,

    "precision": precision,

    "recall": recall,

    "f1_score": f1,

    "roc_auc": roc_auc

}


joblib.dump(
    metrics,
    "model_metrics.pkl"
)


print("Model metrics saved successfully!")
print("File: ml/model_metrics.pkl")


# ==========================================
# TEST NEW APPLICATION
# ==========================================

new_application = pd.DataFrame([{
    "Credit_Score": 720,
    "Applicant_Income": 6000,
    "Coapplicant_Income": 2000,
    "Loan_Amount": 150000,
    "Loan_Amount_Term": 360,
    "Debt_to_Income_Ratio": 0.25,
    "Employment_Duration": 5,
    "Employment_Type": "Salaried",
    "Property_Area": "Urban",
    "Dependents": 1
}])

prediction = model.predict(new_application)[0]

probabilities = model.predict_proba(new_application)[0]

rejection_probability = probabilities[0]
approval_probability = probabilities[1]


print("\n================================")
print("NEW APPLICATION PREDICTION")
print("================================")

if prediction == 1:
    print("Prediction: APPROVED")
else:
    print("Prediction: REJECTED")

print(
    f"Approval Probability: "
    f"{approval_probability * 100:.2f}%"
)

print(
    f"Rejection Probability: "
    f"{rejection_probability * 100:.2f}%"
)

