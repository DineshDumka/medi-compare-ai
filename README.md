# MediCompare AI 🧠🩺

[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://dineshdumka-medi-compare-ai-streamlit-app-upag4n.streamlit.app/)

Interactive platform to compare machine learning models across various disease datasets. Try the live demo [here](https://dineshdumka-medi-compare-ai-streamlit-app-upag4n.streamlit.app/).

![MediCompare AI Screenshot](https://raw.githubusercontent.com/DineshDumka/medi-compare-ai/main/screenshots/app_screenshot.png)

## Overview

MediCompare AI helps healthcare professionals and data scientists explore and compare the performance of various machine learning algorithms across different disease datasets. The platform provides:

- Comprehensive comparison of multiple ML models
- Easy-to-understand visualizations of model performance
- Detailed metrics for model evaluation
- Sample datasets for immediate testing

## Disease Datasets

The platform supports multiple disease datasets:

| Disease | Description | Features |
|---------|-------------|----------|
| Diabetes | Pima Indians Diabetes Database | Glucose levels, BMI, insulin, age, etc. |
| Brain Stroke | Brain stroke prediction dataset | Age, gender, hypertension, heart disease, etc. |
| Heart Disease | Heart disease classification dataset | Chest pain type, resting BP, cholesterol, etc. |

## Machine Learning Algorithms

Compare the performance of various classification algorithms:

- Logistic Regression
- Random Forest
- Support Vector Machine (SVM)
- Neural Network (MLP)

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

## Live Demo

Access the live application at:
[https://dineshdumka-medi-compare-ai-streamlit-app-upag4n.streamlit.app/](https://dineshdumka-medi-compare-ai-streamlit-app-upag4n.streamlit.app/)

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

## Usage Guide

### Streamlit App

1. **Select a disease dataset** from the sidebar
2. **Choose the machine learning algorithms** to compare
3. **Adjust test size and random state parameters** if needed
4. Click **"Train and Compare Models"** to start the analysis
5. View the results in the metrics table and visualizations

![How to Use](https://raw.githubusercontent.com/DineshDumka/medi-compare-ai/main/screenshots/usage_guide.png)

### Evaluation Metrics

The application calculates and displays several evaluation metrics:

- **Accuracy**: Overall correctness of the model
- **Precision**: Ratio of true positives to all predicted positives
- **Recall**: Ratio of true positives to all actual positives
- **F1 Score**: Harmonic mean of precision and recall
- **ROC AUC**: Area under the ROC curve (when applicable)
- **Confusion Matrix**: Visual representation of true/false positives and negatives

## API Endpoints

For developers who want to use the backend API directly:

- `GET /api/diseases` - List available diseases
- `GET /api/algorithms` - List available algorithms
- `POST /api/train` - Train models on a single disease
- `POST /api/compare` - Compare models across multiple diseases

## Technology Stack

- **Frontend**: Streamlit, React
- **Backend**: Flask, Python
- **Machine Learning**: scikit-learn
- **Data Processing**: pandas, numpy
- **Visualization**: matplotlib, seaborn

## Deployment

The Streamlit app is deployed on Streamlit Cloud. For self-hosting, you can deploy on:

- Streamlit Cloud
- Heroku
- AWS
- Google Cloud
- Microsoft Azure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Dinesh Dumka - [@DineshDumka](https://github.com/DineshDumka)

Project Link: [https://github.com/DineshDumka/medi-compare-ai](https://github.com/DineshDumka/medi-compare-ai) 