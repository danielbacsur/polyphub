import hashlib
import os
import urllib.request
from typing import List

import dlib
import cv2
import matplotlib.pyplot as plt
import numpy as np
import tqdm

def get_current_path() -> str:
    """Return path to current file"""
    return os.path.dirname(os.path.abspath(__file__))

class DlibFaceDetector:
    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(
            f'{get_current_path()}/../models/shape_predictor_68_face_landmarks.dat'
        )

    def detect_faces(self, image: np.ndarray) -> List[dlib.rectangle]:
        """Detect faces in image"""
        return self.detector(image)
    
    def detect_landmarks(self, image: np.ndarray, face: dlib.rectangle) -> np.ndarray:
        """Detect landmarks in image"""
        return np.array([
            [point.x, point.y]
            for point in self.predictor(image, face).parts()
        ])


def hash_sha256(url: str) -> str:
    """Return hash of string"""
    return hashlib.sha256(url.encode()).hexdigest()

def download_video(url: str) -> str:
    """Download video and return path to it"""
    
    # Get file extension
    url_segments = url.split(".")
    if len(url_segments) > 1:
        extension = url_segments[-1]
    else:
        extension = "file"

    # Download video
    video_path = f'{get_current_path()}/../data/{hash_sha256(url)}.{extension}'
    video_path = os.path.abspath(video_path)

    # urllib.request.urlretrieve(url, video_path)

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = response.read()
        with open(video_path, 'wb') as f:
            f.write(data)

    return video_path

def extract_frames(video_path: str) -> (List[np.ndarray], int):
    """Extract frames from video"""
    cap = cv2.VideoCapture(video_path)
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    return frames, frame_rate

def convert_frame_grayscale(frame: np.ndarray) -> np.ndarray:
    """Convert frame to grayscale"""
    return cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

def high_pass_filter(image: np.ndarray) -> np.ndarray:
    """ Apply a high-pass filter to isolate noise. """
    kernel = np.array([[-1, -1, -1], [-1, 8.9, -1], [-1, -1, -1]])
    return cv2.filter2D(image, -1, kernel)

def crop_image(image: np.ndarray, landmarks: np.ndarray) -> np.ndarray:
    """ Crop image around facial landmarks. """
    # image_center = np.mean(landmarks, axis=0)
    # image_center = image_center.astype(int)
    # image_center = tuple(image_center)
    kps_min = np.min(landmarks, axis=0) - 20
    kps_max = np.max(landmarks, axis=0) + 20
    cropped_image = image[kps_min[1]:kps_max[1], kps_min[0]:kps_max[0]]
    return cropped_image

def test():
    face_detector = DlibFaceDetector()

    # file = download_video()
    frames, frame_rate = extract_frames(f"{get_current_path()}/../data/test.mp4")
    print(f"Extracted {len(frames)} frames with frame rate {frame_rate}")

    noise_levels = []
    landmarks = []
    for frame in tqdm.tqdm(frames):
        grayscale = convert_frame_grayscale(frame)
    
        faces = face_detector.detect_faces(grayscale)

        if len(faces) == 0:
            print("No faces found")
            noise_levels.append(0)
            # landmarks.append(np.zeros((68, 2)))
        elif len(faces) > 1:
            print("More than one face found")
        else:
            lms = face_detector.detect_landmarks(grayscale, faces[0])
            
            cropped_image = crop_image(grayscale, lms)

            cv2.imshow("cropped", cropped_image)
            cv2.waitKey(1)

            high_pass = high_pass_filter(cropped_image)
            
            noise_levels.append(np.std(high_pass))
            landmarks.append(lms)

    # plt.plot(noise_levels)
    landmarks = np.array(landmarks)
    for lm in range(68):
        lm_x_offset = landmarks[1:, lm, 0] - landmarks[:-1, lm, 0]
        lm_y_offset = landmarks[1:, lm, 1] - landmarks[:-1, lm, 1]
        plt.plot(lm_x_offset, label=f"lm_x_{lm}")
        plt.plot(lm_y_offset, label=f"lm_y_{lm}")

    plt.show()

def check_frame_consistency(frames: List[np.ndarray], frame_rate: int, threshold: int = 20) -> List[List[float]]:
    alerts = []
    prev_frame = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
    for idx, frame in tqdm.tqdm(enumerate(frames[1:]), total=len(frames) - 1, leave=False):
        curr_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Calculate frame difference
        frame_diff = cv2.absdiff(curr_frame, prev_frame)

        # Check if frame difference is above threshold
        if np.mean(frame_diff) > threshold:
            alerts.append([idx / frame_rate, np.mean(frame_diff)])

        prev_frame = curr_frame

    return alerts

def check_face_consistency(frames: List[np.ndarray], frame_rate: int) -> List[List[float]]:
    face_detector = DlibFaceDetector()

    alerts = []
    for idx, frame in tqdm.tqdm(enumerate(frames), total=len(frames), leave=False):
        faces = face_detector.detect_faces(frame)
        if len(faces) != 1:
            alerts.append([idx / frame_rate, len(faces)])
    
    return alerts
    
def check_authenticity(file_path: str):
    # Check frame-to-frame consistency
    frames, frame_rate = extract_frames(file_path)
    print(f"Extracted {len(frames)} frames with frame rate {frame_rate}")

    # Check for frame inconsistencies
    frame_inconsistencies = check_frame_consistency(frames, frame_rate)
    if len(frame_inconsistencies) > 0:
        print("❗ Found frame inconsistencies")
        print(frame_inconsistencies)
    else:
        print("✅ No frame inconsistencies found")

    # Check for face inconsistencies
    face_inconsistencies = check_face_consistency(frames, frame_rate)
    if len(face_inconsistencies) > 0:
        print("❗ Found face inconsistencies")
        print(face_inconsistencies)
    else:
        print("✅ No face inconsistencies found")

if __name__ == "__main__":
    filename = input("Enter filename: ")
    if filename == '':
        filename = "invalid.mov"
    check_authenticity(f"{get_current_path()}/../data/{filename}")
