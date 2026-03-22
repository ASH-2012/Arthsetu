import React, { useState } from "react";

function CreditForm() {
  const [formData, setFormData] = useState({
    Income_Annual: "",
    Savings_Balance: "",
    Spending_Ratio: "",
    Utility_Bill_Late_Count: "",
    Credit_History_Length_Months: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Updated mock response to strictly match the new Pydantic schema
  const mockResponse = {
    status: "success",
    assessment: {
      probability_of_default: 0.08,
      risk_category: "Low Risk",
      credit_score_equivalent: 742,
      max_approval_limit: 300000
    },
    shap_explanations: {
      positive_factors: [
        { feature: "Income_Annual", impact: 0.34, message: "Income lowered risk." },
        { feature: "Savings_Balance", impact: 0.26, message: "Savings lowered risk." },
        { feature: "Credit_History_Length_Months", impact: 0.10, message: "History lowered risk." }
      ],
      negative_factors: [
        { feature: "Spending_Ratio", impact: 0.18, message: "Spending increased risk." },
        { feature: "Utility_Bill_Late_Count", impact: 0.12, message: "Late bills increased risk." }
      ]
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      Income_Annual: Number(formData.Income_Annual),
      Savings_Balance: Number(formData.Savings_Balance),
      Spending_Ratio: Number(formData.Spending_Ratio),
      Utility_Bill_Late_Count: Number(formData.Utility_Bill_Late_Count),
      Credit_History_Length_Months: Number(formData.Credit_History_Length_Months)
    };

    // Wrapping payload to satisfy Pydantic CreditEvaluationRequest schema
    const payload = {
      applicant_id: `DEMO-APP-${Math.floor(Math.random() * 10000)}`,
      financial_data: requestData
    };

    console.log("Submitted JSON:");
    console.log(JSON.stringify(payload, null, 2));

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) // Sending the wrapped payload
      });

      const data = await response.json();

      console.log("API Response:");
      console.log(data);

      if (!response.ok) {
        console.error("Backend Error:", data);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 900);
    } catch (error) {
      console.error("Error sending data:", error);

      setTimeout(() => {
        setResult(mockResponse);
        setLoading(false);
      }, 1200);
    }
  };

  const assessment = result?.assessment;
  
  // Safely extract and combine SHAP data for rendering
  const shapExplanations = result?.shap_explanations || { positive_factors: [], negative_factors: [] };
  const combinedShap = [
    ...(shapExplanations.positive_factors || []).map(f => ({ ...f, direction: 'positive' })),
    ...(shapExplanations.negative_factors || []).map(f => ({ ...f, direction: 'negative' }))
  ].sort((a, b) => b.impact - a.impact);

  const getRiskStyle = (risk) => {
    if (risk === "Low Risk") return styles.scoreLabelLow;
    if (risk === "Medium Risk" || risk === "Moderate Risk") return styles.scoreLabelModerate;
    return styles.scoreLabelHigh;
  };

  const getBarColor = (direction) => {
    return direction === "positive" ? "#16a34a" : "#dc2626";
  };

  const getBarWidth = (impact) => {
    const percentage = Math.min(Math.max(Number(impact) * 100, 8), 100);
    return `${percentage}%`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.left}>
          <div style={styles.topRow}>
            <div style={styles.logo}>Arth Setu</div>
            <div style={styles.badge}>India Hackathon Demo</div>
          </div>

          <div style={styles.heroText}>
            <h1 style={styles.title}>Alternative Credit Scoring Platform</h1>
            <p style={styles.subtitle}>
              Evaluate applicants beyond traditional credit history using
              alternative financial indicators, transparent model outputs, and
              SHAP-based feature explanations.
            </p>
          </div>

          <div style={styles.glassStrip}>
            <div style={styles.glassMiniCard}>
              <div style={styles.miniLabel}>Region</div>
              <div style={styles.miniValue}>India</div>
            </div>

            <div style={styles.glassMiniCard}>
              <div style={styles.miniLabel}>Use Case</div>
              <div style={styles.miniValue}>Inclusive Lending</div>
            </div>

            <div style={styles.glassMiniCard}>
              <div style={styles.miniLabel}>Output</div>
              <div style={styles.miniValue}>Score + SHAP</div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Applicant Input</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="number"
                name="Income_Annual"
                placeholder="Annual Income"
                value={formData.Income_Annual}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="number"
                name="Savings_Balance"
                placeholder="Savings Balance"
                value={formData.Savings_Balance}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="number"
                step="0.01"
                name="Spending_Ratio"
                placeholder="Spending Ratio"
                value={formData.Spending_Ratio}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="number"
                name="Utility_Bill_Late_Count"
                placeholder="Utility Bill Late Count"
                value={formData.Utility_Bill_Late_Count}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                type="number"
                name="Credit_History_Length_Months"
                placeholder="Credit History Length (Months)"
                value={formData.Credit_History_Length_Months}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? "Running Model..." : "Evaluate Applicant"}
              </button>
            </form>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.resultCard}>
            <h2 style={styles.sectionTitle}>Assessment Result</h2>

            {loading && (
              <div style={styles.loading}>
                <div style={styles.loadingOrb}>
                  <div style={styles.spinner}></div>
                </div>

                <p style={styles.loadingTitle}>AI model is running...</p>
                <p style={styles.loadingText}>
                  Generating credit score, risk category, probability of
                  default, and SHAP explanation.
                </p>
              </div>
            )}

            {!loading && !assessment && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📈</div>
                <p style={styles.emptyTitle}>Awaiting assessment</p>
                <p style={styles.emptyText}>
                  Submit the applicant data to display the score, risk label,
                  and feature contribution breakdown.
                </p>
              </div>
            )}

            {!loading && assessment && (
              <div style={styles.resultsWrap}>
                <div style={styles.scoreCard}>
                  <div style={styles.scoreRing}>
                    <div style={styles.scoreRingInner}>
                      <div style={styles.scoreNumber}>
                        {assessment.credit_score_equivalent}
                      </div>
                      <div style={styles.scoreSubLabel}>Credit Score</div>
                    </div>
                  </div>

                  <div
                    style={{
                      ...styles.scoreLabel,
                      ...getRiskStyle(assessment.risk_category)
                    }}
                  >
                    {assessment.risk_category}
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoBox}>
                    <div style={styles.infoHeading}>Probability of Default</div>
                    <div style={styles.infoValue}>
                      {(Number(assessment.probability_of_default) * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div style={styles.infoBox}>
                    <div style={styles.infoHeading}>Score Equivalent</div>
                    <div style={styles.infoValue}>
                      {assessment.credit_score_equivalent}
                    </div>
                  </div>
                </div>

                <div style={styles.shapCard}>
                  <h3 style={styles.shapTitle}>SHAP Feature Explanation</h3>
                  <p style={styles.shapSubtitle}>
                    Green bars increased the score. Red bars reduced the score.
                  </p>

                  {combinedShap.map((item, index) => (
                    <div key={index} style={styles.shapRow}>
                      <div style={styles.shapHeaderRow}>
                        <span style={styles.featureName}>{item.feature}</span>
                        <span
                          style={{
                            ...styles.impactValue,
                            color: getBarColor(item.direction)
                          }}
                        >
                          {item.direction === "positive" ? "+" : "-"}
                          {(Number(item.impact) * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div style={styles.barTrack}>
                        <div
                          style={{
                            ...styles.barFill,
                            width: getBarWidth(item.impact),
                            background: getBarColor(item.direction)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.jsonCard}>
                  <div style={styles.jsonTitle}>Raw Response</div>
                  <pre style={styles.pre}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.24), transparent 26%), linear-gradient(135deg, #0b1220 0%, #102a43 40%, #1d4ed8 100%)",
    fontFamily: "'Manrope', sans-serif",
    padding: "28px"
  },

  wrapper: {
    maxWidth: "1320px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.03fr 0.97fr",
    gap: "28px",
    alignItems: "stretch"
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  right: {
    display: "flex"
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  },

  logo: {
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "15px",
    letterSpacing: "0.01em",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)"
  },

  badge: {
    background: "#e0f2fe",
    color: "#075985",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px"
  },

  heroText: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  title: {
    color: "#ffffff",
    fontSize: "44px",
    fontWeight: "800",
    lineHeight: "1.05",
    letterSpacing: "-0.03em",
    margin: 0
  },

  subtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "1.75",
    margin: 0,
    maxWidth: "760px"
  },

  glassStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px"
  },

  glassMiniCard: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "18px",
    padding: "16px",
    backdropFilter: "blur(12px)"
  },

  miniLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "8px"
  },

  miniValue: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "-0.02em"
  },

  card: {
    background: "rgba(255,255,255,0.98)",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)"
  },

  resultCard: {
    background: "rgba(255,255,255,0.98)",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
    width: "100%"
  },

  sectionTitle: {
    margin: "0 0 20px 0",
    color: "#0f172a",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.02em"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  input: {
    padding: "15px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    fontSize: "15px",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    fontFamily: "'Manrope', sans-serif",
    fontWeight: "500"
  },

  button: {
    marginTop: "8px",
    padding: "15px",
    background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    fontFamily: "'Manrope', sans-serif",
    boxShadow: "0 14px 30px rgba(37,99,235,0.28)"
  },

  loading: {
    minHeight: "420px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },

  loadingOrb: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    animation: "pulseGlow 1.8s infinite",
    marginBottom: "18px"
  },

  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #bfdbfe",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  loadingTitle: {
    fontSize: "20px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  },

  loadingText: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.75",
    maxWidth: "360px",
    fontWeight: "500"
  },

  emptyState: {
    minHeight: "420px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "#64748b",
    padding: "20px"
  },

  emptyIcon: {
    fontSize: "46px",
    marginBottom: "12px"
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
    letterSpacing: "-0.02em"
  },

  emptyText: {
    fontSize: "15px",
    lineHeight: "1.75",
    maxWidth: "340px",
    margin: 0,
    fontWeight: "500"
  },

  resultsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    animation: "slideUp 0.45s ease"
  },

  scoreCard: {
    background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "1px solid #bfdbfe",
    borderRadius: "24px",
    padding: "30px 22px",
    textAlign: "center"
  },

  scoreRing: {
    width: "220px",
    height: "220px",
    margin: "0 auto 18px auto",
    borderRadius: "50%",
    background:
      "conic-gradient(from 0deg, #2563eb, #38bdf8, #2563eb, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 32px rgba(37,99,235,0.25)"
  },

  scoreRingInner: {
    width: "176px",
    height: "176px",
    borderRadius: "50%",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  scoreNumber: {
    fontSize: "64px",
    lineHeight: "1",
    fontWeight: "800",
    letterSpacing: "-0.06em",
    color: "#0f172a",
    marginBottom: "8px"
  },

  scoreSubLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },

  scoreLabel: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "15px",
    letterSpacing: "-0.01em"
  },

  scoreLabelLow: {
    background: "#dcfce7",
    color: "#166534"
  },

  scoreLabelModerate: {
    background: "#fef3c7",
    color: "#92400e"
  },

  scoreLabelHigh: {
    background: "#fee2e2",
    color: "#991b1b"
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px"
  },

  infoBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px"
  },

  infoHeading: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },

  infoValue: {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.03em"
  },

  shapCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px"
  },

  shapTitle: {
    margin: "0 0 6px 0",
    color: "#0f172a",
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "-0.02em"
  },

  shapSubtitle: {
    margin: "0 0 16px 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.7",
    fontWeight: "500"
  },

  shapRow: {
    marginBottom: "15px"
  },

  shapHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    gap: "12px"
  },

  featureName: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#0f172a",
    fontFamily: "'Manrope', sans-serif"
  },

  impactValue: {
    fontWeight: "800",
    fontSize: "13px"
  },

  barTrack: {
    width: "100%",
    height: "10px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden"
  },

  barFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.5s ease"
  },

  jsonCard: {
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: "20px",
    padding: "18px"
  },

  jsonTitle: {
    color: "#cbd5e1",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.06em"
  },

  pre: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: "monospace"
  }
};

export default CreditForm;