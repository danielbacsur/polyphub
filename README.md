# PolypHUB - Real or rendered: The Authenticity Challenge

## 📜 Overview

PolypHUB is our innovative solution developed for the "Real or Rendered: The Authenticity Challenge" at the JunctionX Budapest Hackathon. Our solution is crafted to authenticate short selfie-videos in KYC (Know Your Customer) processes, crucial for the banking sector. By leveraging cutting-edge technologies in deepfake detection, we ensure the authenticity of videos submitted by customers.

## ⚙️ Features

* **Frontend UI using Next.js**: An intuitive and responsive user interface for easy video submission and result visualization.
* **Python-based HTTP API Backend**: A robust backend system hosted on AWS EC2 that return diagnostic results using callbacks.
* **Deepfake Detection**: Advanced algorithms to detect deepfakes by examining various video characteristics.
* **Authentication through Head Movement**: Innovative authentication method that utilizes head movement patterns to distinguish real users from deepfakes.

## 🎯 Getting Started

### Prerequisites

* Node.js and npm (for Next.js frontend)
* Python 3.x
* Required Python libraries: `dlib`, `cv2`, `numpy`, `tqdm`.
* Dlib pre-trained model: `shape_predictor_68_face_landmarks.dat`

### Installation

1. Clone the repository

```bash
git clone https://github.com/danielbacsur/junction-x-polyp
```

2. Install frontend dependencies:
```bash
cd deepfake
npm install
```

3. Set up the Python environment and install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Backend API

### Key Functionalities

1. **Face Detection & Analysis**: Utilizes *DlibFaceDetector* to identify faces and extract facial landmarks.
2. **Deepfake Indicators**: Analyzes noise levels, frame consistency, face cont, brightness, contrast, and blur.
