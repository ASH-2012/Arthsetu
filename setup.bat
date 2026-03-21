@echo off
echo 🚀 Booting Arth Setu Master Environment...

echo 📦 1. Setting up Frontend...
cd frontend
call npm install
cd ..

echo 🐍 2. Setting up Python Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo 🧹 3. Forcing nbstripout (Just in case)...
pip install nbstripout
nbstripout --install

echo ✅ ALL DONE. To run the app:
echo Terminal 1: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
echo Terminal 2: cd frontend ^&^& npm start
pause