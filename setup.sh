#!/bin/bash
echo "🚀 Booting Arth Setu Master Environment..."

echo "📦 1. Setting up Frontend..."
cd frontend
npm install
cd ..

echo "🐍 2. Setting up Python Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "🧹 3. Forcing nbstripout (Just in case)..."
pip install nbstripout
nbstripout --install

echo "✅ ALL DONE. To run the app:"
echo "Terminal 1: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo "Terminal 2: cd frontend && npm start"