import hashlib
import os
import urllib.request
from typing import List

import dlib
import cv2
import matplotlib.pyplot as plt
import numpy as np
import tqdm

class DlibFaceDetector:
    def __init__(self):
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(
            f'{__file__}/../../models/shape_predictor_68_face_landmarks.dat'
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
    video_path = f'{__file__}/../../data/{hash_sha256(url)}.{extension}'
    video_path = os.path.abspath(video_path)
    urllib.request.urlretrieve(url, video_path)
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

def test():
    face_detector = DlibFaceDetector()

    # file = download_video()
    frames, frame_rate = extract_frames(f"{__file__}/../../data/test.mp4")
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
            # image_center = np.mean(lms, axis=0)
            # image_center = image_center.astype(int)
            # image_center = tuple(image_center)
            kps_min = np.min(lms, axis=0) - 20
            kps_max = np.max(lms, axis=0) + 20
            cropped_image = grayscale[kps_min[1]:kps_max[1], kps_min[0]:kps_max[0]]

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

if __name__ == "__main__":
    test()
