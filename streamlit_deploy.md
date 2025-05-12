# Deploying to Streamlit Cloud

Follow these steps to deploy the MediCompare AI application to Streamlit Cloud:

1. **Create a Streamlit Cloud Account**
   - Go to [Streamlit Cloud](https://streamlit.io/cloud)
   - Sign up with your GitHub account

2. **Deploy the Application**
   - Click on "New app" in the Streamlit Cloud dashboard
   - Select the "DineshDumka/medi-compare-ai" repository
   - Select the main branch
   - Set the main file path to: `streamlit_app.py`
   - Click "Deploy"

3. **View Your App**
   - Once deployed, your app will be available at a URL like:
     `https://medicompare-ai.streamlit.app`

## Local Deployment

To run the application locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/DineshDumka/medi-compare-ai.git
   cd medi-compare-ai
   ```

2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. Run the Streamlit app:
   ```
   streamlit run streamlit_app.py
   ```

4. Open your browser and go to:
   ```
   http://localhost:8501
   ```

## Troubleshooting

- If you encounter any dependency issues, make sure your Python version is compatible (Python 3.8+ recommended)
- If you see errors related to missing directories or files, check that the backend/data and backend/models directories exist and have appropriate permissions
- For deployment issues on Streamlit Cloud, check the app logs in the Streamlit Cloud dashboard 