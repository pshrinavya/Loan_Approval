from pydantic import BaseModel, Field


class LoanApplication(BaseModel):

    Credit_Score: float = Field(
        ...,
        ge=0,
        le=1000
    )

    Applicant_Income: float = Field(
        ...,
        ge=0
    )

    Coapplicant_Income: float = Field(
        ...,
        ge=0
    )

    Loan_Amount: float = Field(
        ...,
        ge=0
    )

    Loan_Amount_Term: float = Field(
        ...,
        gt=0
    )

    Debt_to_Income_Ratio: float = Field(
        ...,
        ge=0
    )

    Employment_Duration: float = Field(
        ...,
        ge=0
    )

    Employment_Type: str

    Property_Area: str

    Dependents: int = Field(
        ...,
        ge=0
    )