from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def create_model(algorithm, random_state=42):
    """
    Create a model based on the specified algorithm
    
    Args:
        algorithm: String indicating the type of algorithm to use
        random_state: Random seed for reproducibility
        
    Returns:
        Initialized model instance
    """
    if algorithm == 'logistic_regression':
        return LogisticRegression(random_state=random_state, max_iter=1000)
    elif algorithm == 'random_forest':
        return RandomForestClassifier(random_state=random_state)
    elif algorithm == 'svm':
        return SVC(random_state=random_state, probability=True)
    elif algorithm == 'neural_network':
        return MLPClassifier(random_state=random_state, max_iter=1000)
    else:
        raise ValueError(f"Algorithm {algorithm} not implemented")

def train_model(model, X_train, y_train):
    """
    Train a model on the provided data
    
    Args:
        model: The model to train
        X_train: Training features
        y_train: Training target
        
    Returns:
        Trained model
    """
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    """
    Evaluate a trained model on test data
    
    Args:
        model: Trained model
        X_test: Testing features
        y_test: Testing target
        
    Returns:
        Dictionary of evaluation metrics
    """
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate probabilities for ROC-AUC (if the model supports it)
    try:
        y_prob = model.predict_proba(X_test)[:, 1]
        roc_auc = roc_auc_score(y_test, y_prob)
    except (AttributeError, IndexError):
        roc_auc = None
    
    # Calculate confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    
    # Calculate other metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    # Return metrics as a dictionary
    metrics = {
        'accuracy': float(accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'confusion_matrix': {
            'true_negative': int(tn),
            'false_positive': int(fp),
            'false_negative': int(fn),
            'true_positive': int(tp)
        }
    }
    
    if roc_auc is not None:
        metrics['roc_auc'] = float(roc_auc)
    
    return metrics 