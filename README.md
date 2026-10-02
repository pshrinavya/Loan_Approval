# LoanPredict AI

LoanPredict AI is a web-based loan approval prediction application that uses a trained **Logistic Regression** machine learning model to estimate whether a loan application is likely to be approved or rejected.

The application combines a simple applicant form, machine learning prediction, probability visualization, prediction history, dataset statistics, and model performance analytics in one dashboard.

---

## 🚀 Features

- **Loan Approval Prediction**
  - Enter applicant and loan details.
  - Get an AI-based prediction of **Approved** or **Rejected**.

- **Approval & Rejection Probabilities**
  - Displays the probability of approval.
  - Displays the probability of rejection.
  - Shows the probabilities using a doughnut chart.

- **Prediction History**
  - Stores the latest 10 predictions.
  - Shows:
    - Time
    - Result
    - Approval probability
    - Rejection probability
    - Loan amount
  - Uses browser `localStorage`, so history remains after refreshing the page.

- **New Application**
  - Clears the current application form.
  - Resets the prediction panel.
  - Does not delete saved prediction history.

- **Dataset Statistics**
  - Total applications.
  - Approval rate.
  - Average loan amount.

- **Model Performance**
  - Accuracy.
  - Precision.
  - Recall.
  - F1 Score.
  - ROC-AUC.
  - Performance visualization using a bar chart.

- **AI Assessment**
  - Provides a short explanation of the model's prediction.

- **Responsive Dashboard**
  - Desktop and mobile-friendly layout.
  - Sidebar navigation for Dashboard, Predictions, and Analytics.

---

## 🧠 Machine Learning Model

The application uses **Logistic Regression** for binary loan approval prediction.

The model is trained using the project's loan dataset and the corresponding preprocessing pipeline.

### Input Features

The application currently uses these features:

- `Credit_Score`
- `Applicant_Income`
- `Coapplicant_Income`
- `Loan_Amount`
- `Loan_Amount_Term`
- `Debt_to_Income_Ratio`
- `Employment_Duration`
- `Employment_Type`
- `Property_Area`
- `Dependents`

The exact feature names are kept consistent between the frontend, backend, and machine learning pipeline.

---

## 🏗️ Project Architecture

```text
LoanPredict AI
│
├── Frontend
│   ├── HTML
│   ├── CSS
│   └── JavaScript
│
├── Backend
│   └── FastAPI
│
├── Machine Learning
│   ├── Logistic Regression
│   └── Preprocessing Pipeline
│
└── Dataset
    └── Loan Application Dataset
```

### Data Flow

```text
User enters application details
            ↓
        HTML Form
            ↓
       JavaScript
            ↓
     FastAPI /predict
            ↓
 Preprocessing Pipeline
            ↓
   Logistic Regression
            ↓
 Prediction + Probabilities
            ↓
       JavaScript
            ↓
 Dashboard Visualization
```

---

## 💻 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend

- Python
- FastAPI
- Uvicorn

### Machine Learning

- Scikit-learn
- Logistic Regression
- Data preprocessing pipeline

### Browser Storage

- `localStorage`

---

## 📊 Dashboard

The dashboard contains several sections.

### 1. Applicant Profile

The user enters:

- Employment Type
- Employment Duration
- Dependents
- Property Area
- Credit Score
- Applicant Income
- Coapplicant Income
- Debt-to-Income Ratio
- Loan Amount
- Loan Term

---

### 2. Prediction Result

After submitting an application, the application displays:

```text
MODEL ASSESSMENT
Approved / Rejected
```

It also displays:

```text
Approval: XX.XX%
Rejection: XX.XX%
```

The doughnut chart provides a visual representation of the prediction probabilities.

---

### 3. Prediction History

Every successful prediction is added to the history table.

Only the latest **10 predictions** are retained.

The history is stored in the browser using:

```javascript
localStorage
```

Clicking **New Application** only resets the current form and prediction panel. It does not remove prediction history.

---

### 4. Analytics

The analytics section displays dataset-level information such as:

- Total Applications
- Approval Rate
- Average Loan Amount

It also provides model evaluation metrics.

---

### 5. Model Performance

The model is evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

The metrics are displayed as both numerical values and a bar chart.

---

## 📈 Model Evaluation

The current model evaluation results are:

| Metric | Value |
|---|---:|
| Accuracy | 82.00% |
| Precision | 83.33% |
| Recall | 80.00% |
| F1 Score | 81.63% |
| ROC-AUC | 89.44% |

These values describe the model's performance on the evaluation/test data used during development.

---

## 🔌 API Endpoints

The frontend communicates with the FastAPI backend.

### Prediction

```text
POST /predict
```

Receives applicant information and returns:

```json
{
  "prediction": "Approved",
  "approval_probability": 0.82,
  "rejection_probability": 0.18
}
```

---

### Dataset Statistics

```text
GET /stats
```

Returns statistics used by the dashboard KPI cards.

Example structure:

```json
{
  "total_applications": 1000,
  "approval_rate": 68.5,
  "avg_loan_amount": 145000
}
```

---

### Model Metrics

```text
GET /metrics
```

Returns the trained model's evaluation metrics.

Example:

```json
{
  "model": "Logistic Regression",
  "accuracy": 0.82,
  "precision": 0.8333,
  "recall": 0.8,
  "f1_score": 0.8163,
  "roc_auc": 0.8944
}
```

---

## ▶️ How to Run the Project

### 1. Start the FastAPI Backend

Open a terminal in the backend/project folder.

Run:

```bash
uvicorn main:app --reload
```

The API should start at:

```text
http://127.0.0.1:8000
```

---

### 2. Start the Frontend

Open the frontend using a local development server.

For example, if using VS Code, install/use the **Live Server** extension and open the HTML file with Live Server.

The frontend communicates with:

```text
http://127.0.0.1:8000
```

---

### 3. Test the Application

1. Open the dashboard.
2. Enter applicant information.
3. Click **Analyze Application**.
4. Wait for the prediction.
5. Check the approval/rejection probabilities.
6. Check the prediction history.
7. Click **New Application** to start another application.
8. Open **Analytics** to view dataset statistics and model performance.

---

## 📁 Suggested Project Structure

```text
LoanPredict-AI/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── main.py
│   ├── model.pkl
│   └── ...
│
├── dataset/
│   └── loan_dataset.csv
│
└── README.md
```

The exact filenames can be adjusted according to the final project structure.

---

## 🔐 Important Notes

- The application is intended as a **machine learning demonstration/project**.
- A model prediction should not be treated as a real financial approval decision.
- The quality of predictions depends on the training dataset and preprocessing pipeline.
- The API must be running for predictions, statistics, and model metrics to load.
- Prediction history is stored locally in the user's browser.

---

## 🎯 Project Goals

The project was developed to demonstrate how a machine learning model can be integrated into a complete web application.

The main learning goals include:

- Data preprocessing
- Logistic Regression
- Model evaluation
- Probability prediction
- FastAPI backend development
- REST API communication
- HTML/CSS/JavaScript frontend development
- Chart.js visualization
- Browser local storage
- Dashboard design
- Connecting ML with a real user interface

---

## 🔮 Future Improvements

Possible future improvements include:

- User authentication
- Database-based prediction history
- Downloadable prediction reports
- More machine learning models
- Model comparison
- Feature importance visualization
- Advanced analytics
- Admin dashboard
- Cloud deployment
- Improved accessibility
- More detailed explanation of individual predictions

---

## 👩‍💻 Project Summary

**LoanPredict AI** demonstrates a complete machine learning application workflow:

```text
Dataset
   ↓
Data Preprocessing
   ↓
Logistic Regression
   ↓
Model Evaluation
   ↓
FastAPI Backend
   ↓
HTML/CSS/JavaScript Frontend
   ↓
Interactive Loan Prediction Dashboard
```

The project brings together **Machine Learning + FastAPI + Frontend Development + Data Visualization** into one complete application.
