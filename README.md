# OptiPDF - Smart PDF Compressor

An intelligent full-stack PDF compression application using React and Python (FastAPI).

## Project Structure

This project uses a decoupled architecture:
1.  **Frontend**: React (TypeScript) + Tailwind CSS
2.  **Backend**: Python FastAPI + PyMuPDF (fitz) + Pillow

## 🚀 Setup Instructions

### 1. Backend Setup (Python)

The backend performs the heavy lifting of PDF image extraction and re-compression.

1.  Create a folder named `backend`.
2.  Move `backend_main.py` and `backend_requirements.txt` into this folder.
3.  Open a terminal in the `backend` folder.
4.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
5.  Install dependencies:
    ```bash
    pip install -r backend_requirements.txt
    ```
6.  Start the server:
    ```bash
    uvicorn backend_main:app --reload --port 8000
    ```
    The server will start at `http://localhost:8000`.

### 2. Frontend Setup (React)

1.  This preview environment runs the React code automatically.
2.  If running locally:
    ```bash
    npm install
    npm start
    ```
    The frontend runs at `http://localhost:3000`.

## Features

*   **Smart Compression**: Reduces PDF size by optimizing embedded images (JPEG compression, downsampling) while preserving text vectors.
*   **Quality Control**: Adjustable slider (1-100) to balance quality vs. file size.
*   **Privacy Focused**: Files are processed in a temporary directory and deleted immediately after download.
*   **Preview**: Instant preview of the compressed result within the browser.

## Troubleshooting

*   **"Backend Connection Required"**: Ensure the Python server is running on port 8000.
*   **CORS Errors**: The backend is configured to allow localhost:3000. If you change ports, update `origins` in `backend_main.py`.
*   **Compression Failed**: Some PDFs are already highly compressed or use encodings not supported by standard parsers. Check the server logs for specific PyMuPDF errors.
