const API_URL =
    "http://127.0.0.1:8000";



/* ========================================= */
/* ELEMENTS */
/* ========================================= */

const form =
    document.getElementById("loanForm");

const predictButton =
    document.getElementById("predictButton");

const placeholder =
    document.getElementById(
        "predictionPlaceholder"
    );

const result =
    document.getElementById(
        "predictionResult"
    );

const predictionText =
    document.getElementById(
        "predictionText"
    );

const approvalProbability =
    document.getElementById(
        "approvalProbability"
    );

const rejectionProbability =
    document.getElementById(
        "rejectionProbability"
    );

const approvalPercent =
    document.getElementById(
        "approvalPercent"
    );

const approvalBar =
    document.getElementById(
        "approvalBar"
    );

const rejectionBar =
    document.getElementById(
        "rejectionBar"
    );

const resultBanner =
    document.getElementById(
        "resultBanner"
    );

const resultIcon =
    document.getElementById(
        "resultIcon"
    );

const insightText =
    document.getElementById(
        "aiInsightText"
    );



let predictionChart = null;



/* ========================================= */
/* LOAD DATASET STATISTICS */
/* ========================================= */

async function loadStats() {

    try {

        const response =
            await fetch(
                `${API_URL}/stats`
            );

        if (!response.ok) {

            throw new Error(
                "Could not load statistics"
            );

        }

        const stats =
            await response.json();


        document.getElementById(
            "totalApplications"
        ).textContent =
            stats.total_applications
                .toLocaleString();


        if (
            stats.approval_rate !== null
        ) {

            document.getElementById(
                "approvalRate"
            ).textContent =
                stats.approval_rate
                .toFixed(1) + "%";

        } else {

            document.getElementById(
                "approvalRate"
            ).textContent = "—";

        }


        if (
            stats.avg_loan_amount !== null
        ) {

            document.getElementById(
                "avgLoanAmount"
            ).textContent =
                "₹" +
                stats.avg_loan_amount
                .toLocaleString(
                    "en-IN"
                );

        } else {

            document.getElementById(
                "avgLoanAmount"
            ).textContent = "—";

        }

    }

    catch (error) {

        console.error(
            "Stats error:",
            error
        );

    }

}



/* ========================================= */
/* FORM SUBMISSION */
/* ========================================= */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        setLoading(true);


        const applicationData = {

            Credit_Score:
                Number(
                    document.getElementById(
                        "Credit_Score"
                    ).value
                ),

            Applicant_Income:
                Number(
                    document.getElementById(
                        "Applicant_Income"
                    ).value
                ),

            Coapplicant_Income:
                Number(
                    document.getElementById(
                        "Coapplicant_Income"
                    ).value
                ),

            Loan_Amount:
                Number(
                    document.getElementById(
                        "Loan_Amount"
                    ).value
                ),

            Loan_Amount_Term:
                Number(
                    document.getElementById(
                        "Loan_Amount_Term"
                    ).value
                ),

            Debt_to_Income_Ratio:
                Number(
                    document.getElementById(
                        "Debt_to_Income_Ratio"
                    ).value
                ),

            Employment_Duration:
                Number(
                    document.getElementById(
                        "Employment_Duration"
                    ).value
                ),

            Employment_Type:
                document.getElementById(
                    "Employment_Type"
                ).value,

            Property_Area:
                document.getElementById(
                    "Property_Area"
                ).value,

            Dependents:
                Number(
                    document.getElementById(
                        "Dependents"
                    ).value
                )

        };


        try {

            const response =
                await fetch(
                    `${API_URL}/predict`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                applicationData
                            )

                    }
                );


            if (!response.ok) {

                const error =
                    await response.json();

                console.error(error);

                throw new Error(
                    "Prediction failed"
                );

            }


            const prediction =
                await response.json();


            showPrediction(
                prediction,
                applicationData
            );

        }


        catch(error) {

            console.error(error);

            alert(
                "Unable to connect to the prediction API.\n\n" +
                "Make sure FastAPI is running."
            );

        }


        finally {

            setLoading(false);

        }

    }
);



/* ========================================= */
/* LOADING */
/* ========================================= */

function setLoading(
    loading
) {

    predictButton.disabled =
        loading;
    
    const loadingMessage = document.getElementById("loadingMessage");


    if (loading) {

        predictButton
            .querySelector(
                "span:first-child"
            )
            .innerHTML =
            `
            <span class="button-icon">
                ◌
            </span>
            Analyzing Application...
            `;
        if (loadingMessage) {
            loadingMessage.classList.remove("hidden");
        }

    }

    else {

        predictButton
            .querySelector(
                "span:first-child"
            )
            .innerHTML =
            `
            <span class="button-icon">
                ✦
            </span>
            Analyze Application
            `;
        if (loadingMessage) {
            loadingMessage.classList.add("hidden");
        }

    }

}



/* ========================================= */
/* SHOW PREDICTION */
/* ========================================= */

function showPrediction(
    data,
    application
) {

    const approval =
        data.approval_probability * 100;

    const rejection =
        data.rejection_probability * 100;

    // Calculate model confidence

const confidence =
    Math.max(
        approval,
        rejection
    );

const confidenceText =
    document.getElementById(
        "confidenceText"
    );

    if (confidenceText) {

        if (confidence >= 75) {

            confidenceText.textContent =
                "High confidence";

        }

        else if (confidence >= 60) {

            confidenceText.textContent =
                "Moderate confidence";

        }

        else {

            confidenceText.textContent =
                "Low confidence";

        }

    }


    predictionText.textContent =
        data.prediction;

    approvalProbability.textContent =
        approval.toFixed(2) + "%";

    rejectionProbability.textContent =
        rejection.toFixed(2) + "%";

    approvalPercent.textContent =
        approval.toFixed(1) + "%";

    approvalBar.style.width =
        approval + "%";

    rejectionBar.style.width =
        rejection + "%";


    updateResultStyle(
        data.prediction
    );


    generateInsight(
        data,
        application
    );


    placeholder.classList.add(
        "hidden"
    );

    result.classList.remove(
        "hidden"
    );


    createChart(
        approval,
        rejection
    );


    addPredictionToHistory(data);

}



/* ========================================= */
/* PREDICTION HISTORY */
/* ========================================= */

let predictionHistory =
    JSON.parse(
        localStorage.getItem("predictionHistory")
    ) || [];


const historyBody =
    document.getElementById(
        "historyBody"
    );


const historyCount =
    document.getElementById(
        "historyCount"
    );
const clearHistoryBtn =
    document.getElementById(
        "clearHistoryBtn"
    );

// =========================================
// ADD PREDICTION
// =========================================

function addPredictionToHistory(result) {

    const record = {

        time: new Date().toLocaleString([],
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        ),

        prediction:
            result.prediction,

        approval:
            result.approval_probability * 100,

        rejection:
            result.rejection_probability * 100,

        loanAmount:
            document.getElementById(
                "Loan_Amount"
            )?.value || "—"

    };


    predictionHistory.unshift(
        record
    );


    // Keep latest 10
    if (
        predictionHistory.length > 10
    ) {

        predictionHistory.pop();

    }

    localStorage.setItem(
        "predictionHistory",
        JSON.stringify(
            predictionHistory
        )
    );


    renderPredictionHistory();

}


// =========================================
// RENDER HISTORY
// =========================================

function renderPredictionHistory() {

    if (!historyBody) {

        return;

    }


    // No predictions
    if (
        predictionHistory.length === 0
    ) {

        historyBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-history"
                >
                    No predictions yet
                </td>
            </tr>
        `;


        if (historyCount) {

            historyCount.textContent =
                "0 predictions";

        }


        return;

    }


    // Create rows
    historyBody.innerHTML =
        predictionHistory.map(
            function(item) {

                const resultClass =
                    item.prediction ===
                    "Approved"
                        ? "result-approved"
                        : "result-rejected";


                return `
                    <tr>
                        <td>
                            ${predictionHistory.indexOf(item) + 1}
                        </td>

                        <td>
                            ${item.time}
                        </td>

                        <td
                            class="${resultClass}"
                        >
                            ${item.prediction}
                        </td>

                        <td>
                            ${item.approval.toFixed(2)}%
                        </td>

                        <td>
                            ${item.rejection.toFixed(2)}%
                        </td>

                        <td>
                            ₹${Number(
                                item.loanAmount
                            ).toLocaleString("en-IN")}
                        </td>

                    </tr>
                `;

            }
        ).join("");


    // Update count
    if (historyCount) {

        historyCount.textContent =
            `${predictionHistory.length} ${
                predictionHistory.length === 1
                    ? "prediction"
                    : "predictions"
            }`;

    }

}


// =========================================
// LOAD HISTORY
// =========================================

renderPredictionHistory();


// =========================================
// CLEAR HISTORY
// =========================================

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
        "click",
        function() {

            if (predictionHistory.length === 0) {
                return;
            }

            const confirmed =
                confirm(
                    "Are you sure you want to clear all prediction history?"
                );

            if (!confirmed) {
                return;
            }

            predictionHistory = [];

            localStorage.removeItem(
                "predictionHistory"
            );

            renderPredictionHistory();

        }
    );

}


// ==========================================
// RESET APPLICATION
// ==========================================

if (resetBtn) {

    resetBtn.addEventListener("click", () => {

        const form = document.querySelector("form");

        if (form) {
            form.reset();
        }

        // Return prediction panel to initial state
        resetPredictionPanel();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* ========================================= */
/* RESULT STYLE */
/* ========================================= */

function updateResultStyle(
    prediction
) {

    if (
        prediction === "Approved"
    ) {

        resultBanner.classList.remove(
            "rejected"
        );

        resultIcon.textContent =
            "✓";

        resultIcon.style.color =
            "#16a477";

    }

    else {

        resultBanner.classList.add(
            "rejected"
        );

        resultIcon.textContent =
            "×";

        resultIcon.style.color =
            "#e85d75";

    }

}



/* ========================================= */
/* AI INSIGHT */
/* ========================================= */

function generateInsight(
    data,
    application
) {

    const approval =
        data.approval_probability * 100;

    const credit =
        application.Credit_Score;


    let message = "";


    if (
        data.prediction ===
        "Approved"
    ) {

        message =
            `The model estimates a ${approval.toFixed(1)}% ` +
            `approval probability for this application. `;

        if (credit >= 700) {

            message +=
                "The applicant's credit score is relatively strong.";

        }

        else {

            message +=
                "The prediction reflects the combined applicant and loan features.";

        }

    }

    else {

        message =
            `The model estimates a ${approval.toFixed(1)}% ` +
            `approval probability and a ` +
            `${(100 - approval).toFixed(1)}% rejection probability. ` +
            `The final prediction is based on the complete feature profile.`;

    }


    insightText.textContent =
        message;

}



/* ========================================= */
/* DONUT CHART */
/* ========================================= */

function createChart(
    approval,
    rejection
) {

    const canvas =
        document.getElementById(
            "predictionChart"
        );


    if (predictionChart) {

        predictionChart.destroy();

    }


    predictionChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Approved",
                        "Rejected"
                    ],

                    datasets: [

                        {

                            data: [
                                approval,
                                rejection
                            ],

                            backgroundColor: [
                                "#16a477",
                                "#e85d75"
                            ],

                            borderWidth: 0,

                            hoverOffset: 8

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "78%",

                    animation: {

                        animateRotate: true,

                        duration: 1000

                    },

                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            context.raw
                                                .toFixed(2) +
                                            "%"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}

/* ========================================= */
/* SIDEBAR NAVIGATION */
/* ========================================= */

const navLinks =
    document.querySelectorAll(".nav-link");


navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();


        // Remove active state
        navLinks.forEach(item => {

            item.classList.remove("active");

        });


        // Add active state
        this.classList.add("active");


        // Get target section
        const sectionId =
            this.getAttribute("data-section");


        const section =
            document.getElementById(
                sectionId
            );


        if (section) {

            section.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    });

});

/* ========================================= */
/* LOAD MODEL METRICS */
/* ========================================= */

async function loadMetrics() {

    try {

        const response =
            await fetch(
                `${API_URL}/metrics`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load model metrics"
            );

        }


        const metrics =
            await response.json();


        document.getElementById(
            "metricAccuracy"
        ).textContent =
            (metrics.accuracy * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricPrecision"
        ).textContent =
            (metrics.precision * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricRecall"
        ).textContent =
            (metrics.recall * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricF1"
        ).textContent =
            (metrics.f1_score * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricRocAuc"
        ).textContent =
            (metrics.roc_auc * 100)
            .toFixed(2) + "%";


    }

    catch (error) {

        console.error(
            "Metrics error:",
            error
        );

    }

}



loadStats();

let metricsChart = null;


/* ========================================= */
/* MODEL PERFORMANCE CHART */
/* ========================================= */

function createMetricsChart(metrics) {

    const canvas =
        document.getElementById(
            "metricsChart"
        );

    if (!canvas) return;

    if (metricsChart) {

        metricsChart.destroy();

    }

    metricsChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Accuracy",
                        "Precision",
                        "Recall",
                        "F1 Score",
                        "ROC-AUC"
                    ],

                    datasets: [

                        {

                            label:
                                "Performance",

                            data: [

                                metrics.accuracy * 100,

                                metrics.precision * 100,

                                metrics.recall * 100,

                                metrics.f1_score * 100,

                                metrics.roc_auc * 100

                            ],

                            backgroundColor:
                                "#635bff",

                            borderRadius: 8,

                            borderSkipped: false

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    scales: {

                        y: {

                            beginAtZero: true,

                            max: 100,

                            ticks: {

                                callback:
                                    function(value) {

                                        return value + "%";

                                    }

                            }

                        },

                        x: {

                            grid: {

                                display: false

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display: false

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " " +
                                            context.raw.toFixed(2) +
                                            "%"
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* ========================================= */
/* LOAD METRICS + CREATE CHART */
/* ========================================= */

async function loadMetrics() {

    try {

        const response =
            await fetch(
                `${API_URL}/metrics`
            );


        if (!response.ok) {

            throw new Error(
                "Could not load model metrics"
            );

        }


        const metrics =
            await response.json();


        document.getElementById(
            "metricAccuracy"
        ).textContent =
            (metrics.accuracy * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricPrecision"
        ).textContent =
            (metrics.precision * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricRecall"
        ).textContent =
            (metrics.recall * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricF1"
        ).textContent =
            (metrics.f1_score * 100)
            .toFixed(2) + "%";


        document.getElementById(
            "metricRocAuc"
        ).textContent =
            (metrics.roc_auc * 100)
            .toFixed(2) + "%";


        /* CREATE CHART */

        createMetricsChart(metrics);

    }

    catch (error) {

        console.error(
            "Metrics error:",
            error
        );

    }

}


/* ========================================= */
/* START */
/* ========================================= */

loadMetrics();