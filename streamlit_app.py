import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib
import sys

# Add the backend directory to the path
sys.path.append('backend')

# Import backend modules
from models.model_factory import create_model, train_model, evaluate_model
from data.data_processor import load_data, preprocess_data, split_data

# Set page configuration
st.set_page_config(
    page_title="MediCompare AI",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Page styling
st.markdown("""
<style>
    .main {
        background-color: #f5f7f9;
    }
    .stApp {
        max-width: 1200px;
        margin: 0 auto;
    }
</style>
""", unsafe_allow_html=True)

# Available diseases and their datasets
DISEASES = {
    'diabetes': {
        'filename': 'backend/data/diabetes.csv',
        'description': 'Diabetes dataset from the Pima Indians Diabetes Database'
    },
    'brain_stroke': {
        'filename': 'backend/data/brain_stroke.csv',
        'description': 'Brain stroke prediction dataset'
    },
    'heart_disease': {
        'filename': 'backend/data/heart_disease.csv',
        'description': 'Heart disease dataset'
    }
}

# Available ML algorithms
ALGORITHMS = [
    'logistic_regression',
    'random_forest',
    'svm',
    'neural_network'
]

# Helper functions
def format_name(name):
    """Format a snake_case string to Title Case"""
    return name.replace('_', ' ').title()

def plot_metrics_comparison(results, metric_name='accuracy'):
    """Create a bar plot comparing algorithms by a specific metric"""
    algorithms = [result['algorithm_name'] for result in results]
    metrics = [result['metrics'][metric_name] for result in results]
    
    fig, ax = plt.subplots(figsize=(10, 5))
    bars = ax.bar(algorithms, metrics, color='skyblue')
    ax.set_xlabel('Algorithm')
    ax.set_ylabel(format_name(metric_name))
    ax.set_title(f'{format_name(metric_name)} Comparison')
    ax.set_ylim(0, 1)
    
    # Add values above bars
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.3f}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')
    
    return fig

def plot_confusion_matrix(cm_data, algorithm_name):
    """Create a heatmap for the confusion matrix"""
    cm = np.array([[cm_data['true_negative'], cm_data['false_positive']], 
                  [cm_data['false_negative'], cm_data['true_positive']]])
    
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
    ax.set_xlabel('Predicted')
    ax.set_ylabel('Actual')
    ax.set_title(f'Confusion Matrix - {algorithm_name}')
    ax.set_xticklabels(['Negative', 'Positive'])
    ax.set_yticklabels(['Negative', 'Positive'])
    
    return fig

# Main app layout
st.title("🩺 MediCompare AI")
st.markdown("Interactive platform to compare machine learning models across various disease datasets.")

# Sidebar
st.sidebar.title("Settings")

# Disease selection
selected_disease = st.sidebar.selectbox(
    "Select Disease Dataset",
    options=list(DISEASES.keys()),
    format_func=format_name
)

# Display dataset description
st.sidebar.info(DISEASES[selected_disease]['description'])

# Algorithm selection 
selected_algorithms = st.sidebar.multiselect(
    "Select ML Algorithms",
    options=ALGORITHMS,
    default=ALGORITHMS,
    format_func=format_name
)

# Test size and random state parameters
test_size = st.sidebar.slider("Test Size", 0.1, 0.5, 0.2, 0.05)
random_state = st.sidebar.number_input("Random State", 1, 100, 42)

# Main content area
if not selected_algorithms:
    st.warning("Please select at least one algorithm to continue.")
    st.stop()

# Train models button
if st.button("Train and Compare Models"):
    try:
        # Display loading spinner
        with st.spinner("Training models and calculating metrics..."):
            # Load and preprocess the data
            df = load_data(DISEASES[selected_disease]['filename'])
            X, y = preprocess_data(df, selected_disease)
            X_train, X_test, y_train, y_test = split_data(X, y, test_size, random_state)
            
            results = []
            
            # Train and evaluate each requested algorithm
            for algo in selected_algorithms:
                model = create_model(algo, random_state)
                trained_model = train_model(model, X_train, y_train)
                
                # Evaluate the model
                metrics = evaluate_model(trained_model, X_test, y_test)
                
                # Save the model
                model_dir = "backend/models"
                os.makedirs(model_dir, exist_ok=True)
                model_filename = f"{model_dir}/{selected_disease}_{algo}.joblib"
                joblib.dump(trained_model, model_filename)
                
                results.append({
                    'algorithm': algo,
                    'algorithm_name': format_name(algo),
                    'metrics': metrics
                })
                
        # Display dataset information
        st.subheader("Dataset Information")
        st.write(f"Dataset: **{format_name(selected_disease)}**")
        st.write(f"Total samples: **{len(df)}**")
        st.write(f"Training samples: **{len(X_train)}**")
        st.write(f"Testing samples: **{len(X_test)}**")
        
        # Display results in a tabular format
        st.subheader("Performance Metrics")
        
        # Create a DataFrame for the metrics
        metrics_df = pd.DataFrame([
            {
                'Algorithm': result['algorithm_name'],
                'Accuracy': result['metrics']['accuracy'],
                'Precision': result['metrics']['precision'],
                'Recall': result['metrics']['recall'],
                'F1 Score': result['metrics']['f1_score'],
                'ROC AUC': result['metrics'].get('roc_auc', 'N/A')
            }
            for result in results
        ])
        
        st.dataframe(metrics_df, hide_index=True)
        
        # Display visualization tabs
        st.subheader("Visualizations")
        viz_tab1, viz_tab2 = st.tabs(["Metrics Comparison", "Confusion Matrices"])
        
        with viz_tab1:
            col1, col2 = st.columns(2)
            
            with col1:
                st.pyplot(plot_metrics_comparison(results, 'accuracy'))
                
            with col2:
                st.pyplot(plot_metrics_comparison(results, 'f1_score'))
                
            col3, col4 = st.columns(2)
            
            with col3:
                st.pyplot(plot_metrics_comparison(results, 'precision'))
                
            with col4:
                st.pyplot(plot_metrics_comparison(results, 'recall'))
        
        with viz_tab2:
            # Create a grid of confusion matrices
            cols = st.columns(min(3, len(results)))
            for i, result in enumerate(results):
                col_idx = i % 3
                with cols[col_idx]:
                    cm_data = result['metrics']['confusion_matrix']
                    st.write(f"**{result['algorithm_name']}**")
                    st.pyplot(plot_confusion_matrix(cm_data, result['algorithm_name']))
                    
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")

# If no button pressed, show instructions
else:
    st.info("👈 Select a disease dataset and algorithm(s) from the sidebar, then click 'Train and Compare Models' to see the results.")
    
    # Display sample data
    st.subheader("Sample Data")
    try:
        sample_df = load_data(DISEASES[selected_disease]['filename'])
        st.dataframe(sample_df.head())
    except Exception as e:
        st.error(f"Could not load sample data: {str(e)}") 