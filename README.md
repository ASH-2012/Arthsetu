# Arth Setu: Alternative Credit Scoring Platform

## ⚠️ Repository Status: CODE FREEZE
**This is the master deployment repository. The core MVP pipeline (Data -> ML Model -> API -> React Frontend) is fully functional and locked.**

* **Frontend:** Vaibhavi (React.js, Custom CSS)
* **Backend Pipeline:** Nirali & Aaryahi (FastAPI, scikit-learn, SHAP)
* **Architecture & DevOps:** 
**DO NOT push untested code, ChatGPT hallucinations, or architectural changes to the `main` branch. All commits must be reviewed.**

---

## 🏗️ System Architecture

1.  **Machine Learning Engine (`/backend/models/`)**
    * Trained on 150,000+ records using a Random Forest Classifier (bypassing Apple Silicon C++ architecture bugs).
    * Outputs probability of default, risk categorization, and 300-900 equivalent credit scores.
2.  **Explainability Layer (`/backend/utils/shap_explainer.py`)**
    * Generates dynamic SHAP (SHapley Additive exPlanations) values to ensure algorithmic transparency for banking compliance.
    * Includes a Graceful Degradation failsafe to prevent API crashes during matrix mismatches.
3.  **FastAPI Server (`/backend/main.py`)**
    * Stateless, asynchronous REST API running on `localhost:8000`.
4.  **React Frontend (`/frontend/`)**
    * Raw CSS-in-JS architecture (Zero Bootstrap dependency).

---

## 🚀 How to Run the Application Locally

We have automated the environment setup to prevent dependency errors. Do not attempt to manually install packages globally.

### Step 1: Run the Automated Setup
Depending on your operating system, run the setup script from the root directory to build your Node modules and Python virtual environment.

**For Mac/Linux:**
```bash
bash setup.sh

**For Windows:**
Double-click setup.bat or run:
 setup.bat

 Step 2: Boot the System
You must run the frontend and backend in two separate terminal windows.

Terminal 1 (The AI Server):

Bash
cd backend
# Mac: source venv/bin/activate | Windows: venv\Scripts\activate
uvicorn main:app --reload

Wait for: "ArthSetu AI Engine loaded successfully."

Terminal 2 (The UI):

Bash
cd frontend
npm start
The dashboard will automatically open at http://localhost:3000

🛑 Troubleshooting
ModuleNotFoundError (Python): You did not activate your virtual environment. Ensure (venv) is visible in your terminal before running the server.

JSONParseError / React crashes on start: You did not run npm install. Run the setup script.

CORS Error in Browser: Your FastAPI server is not running on port 8000, or you closed Terminal 1.