import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import os

def load_data(file_path):
    """
    Load a dataset from a CSV file
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        pandas DataFrame containing the dataset
    """
    try:
        return pd.read_csv(file_path)
    except FileNotFoundError:
        # If the file doesn't exist, create a sample dataset
        if 'diabetes' in file_path:
            return create_sample_diabetes_data()
        elif 'brain_stroke' in file_path:
            return create_sample_brain_stroke_data()
        elif 'heart_disease' in file_path:
            return create_sample_heart_disease_data()
        else:
            raise FileNotFoundError(f"File {file_path} not found and no sample data available.")

def preprocess_data(df, disease_type):
    """
    Preprocess the dataset based on the disease type
    
    Args:
        df: pandas DataFrame containing the dataset
        disease_type: String indicating the type of disease dataset
        
    Returns:
        X: Features DataFrame
        y: Target Series
    """
    if disease_type == 'diabetes':
        return preprocess_diabetes_data(df)
    elif disease_type == 'brain_stroke':
        return preprocess_brain_stroke_data(df)
    elif disease_type == 'heart_disease':
        return preprocess_heart_disease_data(df)
    else:
        raise ValueError(f"Preprocessing for {disease_type} not implemented")

def split_data(X, y, test_size=0.2, random_state=42):
    """
    Split data into training and testing sets
    
    Args:
        X: Features DataFrame
        y: Target Series
        test_size: Proportion of the dataset to include in the test split
        random_state: Random seed for reproducibility
        
    Returns:
        X_train, X_test, y_train, y_test: Split datasets
    """
    return train_test_split(X, y, test_size=test_size, random_state=random_state)

def preprocess_diabetes_data(df):
    """
    Preprocess the diabetes dataset
    
    Args:
        df: pandas DataFrame containing the diabetes dataset
        
    Returns:
        X: Features DataFrame
        y: Target Series
    """
    # Create a copy to avoid modifying the original dataframe
    df_processed = df.copy()
    
    # Handle missing values (zeros in certain columns are considered missing)
    zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
    for col in zero_cols:
        if col in df_processed.columns:
            df_processed[col] = df_processed[col].replace(0, np.nan)
            df_processed[col] = df_processed[col].fillna(df_processed[col].mean())
    
    # Feature selection
    X = df_processed.drop('Outcome', axis=1) if 'Outcome' in df_processed.columns else df_processed.iloc[:, :-1]
    y = df_processed['Outcome'] if 'Outcome' in df_processed.columns else df_processed.iloc[:, -1]
    
    # Feature scaling
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    
    return X_scaled, y

def preprocess_brain_stroke_data(df):
    """
    Preprocess the brain stroke dataset
    
    Args:
        df: pandas DataFrame containing the brain stroke dataset
        
    Returns:
        X: Features DataFrame
        y: Target Series
    """
    # Create a copy to avoid modifying the original dataframe
    df_processed = df.copy()
    
    # Handle categorical variables
    categorical_cols = ['gender', 'ever_married', 'work_type', 'Residence_type', 'smoking_status']
    for col in categorical_cols:
        if col in df_processed.columns:
            df_processed = pd.get_dummies(df_processed, columns=[col], drop_first=True)
    
    # Handle missing values
    for col in df_processed.columns:
        if df_processed[col].dtype in ['float64', 'int64']:
            df_processed[col] = df_processed[col].fillna(df_processed[col].mean())
        else:
            df_processed[col] = df_processed[col].fillna(df_processed[col].mode()[0])
    
    # Feature selection
    target_col = 'stroke' if 'stroke' in df_processed.columns else -1
    if target_col != -1:
        X = df_processed.drop(target_col, axis=1)
        y = df_processed[target_col]
    else:
        X = df_processed.iloc[:, :-1]
        y = df_processed.iloc[:, -1]
    
    # Feature scaling
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    
    return X_scaled, y

def preprocess_heart_disease_data(df):
    """
    Preprocess the heart disease dataset
    
    Args:
        df: pandas DataFrame containing the heart disease dataset
        
    Returns:
        X: Features DataFrame
        y: Target Series
    """
    # Create a copy to avoid modifying the original dataframe
    df_processed = df.copy()
    
    # Handle categorical variables
    categorical_cols = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']
    for col in categorical_cols:
        if col in df_processed.columns:
            df_processed = pd.get_dummies(df_processed, columns=[col], drop_first=True)
    
    # Handle missing values
    for col in df_processed.columns:
        if df_processed[col].dtype in ['float64', 'int64']:
            df_processed[col] = df_processed[col].fillna(df_processed[col].mean())
        else:
            df_processed[col] = df_processed[col].fillna(df_processed[col].mode()[0])
    
    # Feature selection
    target_col = 'HeartDisease' if 'HeartDisease' in df_processed.columns else -1
    if target_col != -1:
        X = df_processed.drop(target_col, axis=1)
        y = df_processed[target_col]
    else:
        X = df_processed.iloc[:, :-1]
        y = df_processed.iloc[:, -1]
    
    # Feature scaling
    scaler = StandardScaler()
    X_scaled = pd.DataFrame(scaler.fit_transform(X), columns=X.columns)
    
    return X_scaled, y

def create_sample_diabetes_data():
    """Create a sample diabetes dataset"""
    # Based on Pima Indians Diabetes Database
    columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 
               'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']
    
    # Create sample data (100 rows)
    np.random.seed(42)
    n_samples = 100
    
    data = {
        'Pregnancies': np.random.randint(0, 17, n_samples),
        'Glucose': np.random.randint(70, 200, n_samples),
        'BloodPressure': np.random.randint(40, 120, n_samples),
        'SkinThickness': np.random.randint(10, 50, n_samples),
        'Insulin': np.random.randint(15, 250, n_samples),
        'BMI': np.random.uniform(18, 40, n_samples),
        'DiabetesPedigreeFunction': np.random.uniform(0.1, 1.5, n_samples),
        'Age': np.random.randint(21, 80, n_samples),
        'Outcome': np.random.randint(0, 2, n_samples)
    }
    
    df = pd.DataFrame(data, columns=columns)
    
    # Save the dataset
    os.makedirs(os.path.dirname('data/diabetes.csv'), exist_ok=True)
    df.to_csv('data/diabetes.csv', index=False)
    
    return df

def create_sample_brain_stroke_data():
    """Create a sample brain stroke dataset"""
    # Define columns based on a typical brain stroke dataset
    columns = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married', 
               'work_type', 'Residence_type', 'avg_glucose_level', 
               'bmi', 'smoking_status', 'stroke']
    
    # Create sample data (100 rows)
    np.random.seed(42)
    n_samples = 100
    
    genders = ['Male', 'Female']
    married = ['Yes', 'No']
    work_types = ['Private', 'Self-employed', 'Govt_job', 'children', 'Never_worked']
    residence_types = ['Urban', 'Rural']
    smoking_statuses = ['formerly smoked', 'never smoked', 'smokes', 'Unknown']
    
    data = {
        'gender': [genders[np.random.randint(0, 2)] for _ in range(n_samples)],
        'age': np.random.uniform(18, 85, n_samples),
        'hypertension': np.random.randint(0, 2, n_samples),
        'heart_disease': np.random.randint(0, 2, n_samples),
        'ever_married': [married[np.random.randint(0, 2)] for _ in range(n_samples)],
        'work_type': [work_types[np.random.randint(0, 5)] for _ in range(n_samples)],
        'Residence_type': [residence_types[np.random.randint(0, 2)] for _ in range(n_samples)],
        'avg_glucose_level': np.random.uniform(70, 250, n_samples),
        'bmi': np.random.uniform(15, 45, n_samples),
        'smoking_status': [smoking_statuses[np.random.randint(0, 4)] for _ in range(n_samples)],
        'stroke': np.random.randint(0, 2, n_samples)
    }
    
    df = pd.DataFrame(data, columns=columns)
    
    # Save the dataset
    os.makedirs(os.path.dirname('data/brain_stroke.csv'), exist_ok=True)
    df.to_csv('data/brain_stroke.csv', index=False)
    
    return df

def create_sample_heart_disease_data():
    """Create a sample heart disease dataset"""
    # Define columns based on a typical heart disease dataset
    columns = ['Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol', 'FastingBS', 
               'RestingECG', 'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope', 'HeartDisease']
    
    # Create sample data (100 rows)
    np.random.seed(42)
    n_samples = 100
    
    sex_values = ['M', 'F']
    chest_pain_types = ['TA', 'ATA', 'NAP', 'ASY']
    resting_ecg = ['Normal', 'ST', 'LVH']
    exercise_angina = ['Y', 'N']
    st_slope = ['Up', 'Flat', 'Down']
    
    data = {
        'Age': np.random.randint(28, 80, n_samples),
        'Sex': [sex_values[np.random.randint(0, 2)] for _ in range(n_samples)],
        'ChestPainType': [chest_pain_types[np.random.randint(0, 4)] for _ in range(n_samples)],
        'RestingBP': np.random.randint(90, 200, n_samples),
        'Cholesterol': np.random.randint(100, 400, n_samples),
        'FastingBS': np.random.randint(0, 2, n_samples),
        'RestingECG': [resting_ecg[np.random.randint(0, 3)] for _ in range(n_samples)],
        'MaxHR': np.random.randint(60, 200, n_samples),
        'ExerciseAngina': [exercise_angina[np.random.randint(0, 2)] for _ in range(n_samples)],
        'Oldpeak': np.random.uniform(0, 5, n_samples),
        'ST_Slope': [st_slope[np.random.randint(0, 3)] for _ in range(n_samples)],
        'HeartDisease': np.random.randint(0, 2, n_samples)
    }
    
    df = pd.DataFrame(data, columns=columns)
    
    # Save the dataset
    os.makedirs(os.path.dirname('data/heart_disease.csv'), exist_ok=True)
    df.to_csv('data/heart_disease.csv', index=False)
    
    return df 