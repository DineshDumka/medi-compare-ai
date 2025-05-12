# MediCompare AI 🧠🩺

Interactive platform to compare machine learning models across various disease datasets.

## Project Structure

```
.
├── backend/
│   ├── data/           # Dataset storage
│   ├── models/         # ML model implementations
│   └── app.py          # Flask API server
├── frontend/
│   ├── public/         # Static files
│   └── src/            # React source code
└── streamlit_app.py    # Streamlit application
```

## Features

- Analysis of multiple disease datasets (diabetes, brain stroke, heart disease)
- Comparison of different ML algorithms:
  - Logistic Regression
  - Random Forest
  - Support Vector Machine (SVM)
  - Neural Network
- Interactive visualization of model performance metrics
- RESTful API for model training and evaluation
- Streamlit web application for easy model comparison

## Setup Instructions

### Option 1: Streamlit App (Recommended)

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Streamlit app:
   ```
   streamlit run streamlit_app.py
   ```
   The app will open in your browser at http://localhost:8501

### Option 2: Backend and Frontend Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   venv\Scripts\activate  # On Windows
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```
   python app.py
   ```
   The server will start on http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Usage

### Streamlit App

1. Select a disease dataset from the sidebar
2. Choose the machine learning algorithms to compare
3. Adjust test size and random state parameters if needed
4. Click "Train and Compare Models" to start the analysis
5. View the results in the metrics table and visualizations

### React Frontend

1. Select one or more diseases to analyze
2. Choose the machine learning algorithms to compare
3. Click "Train & Compare" to start the analysis
4. View the results in the visualization dashboard

## API Endpoints

- `GET /api/diseases` - List available diseases
- `GET /api/algorithms` - List available algorithms
- `POST /api/train` - Train models on a single disease
- `POST /api/compare` - Compare models across multiple diseases

## Deployment

The Streamlit app can be deployed on Streamlit Cloud or any other platform that supports Python applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 