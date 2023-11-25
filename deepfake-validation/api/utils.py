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

# Consistency checks

def check_frame_consistency(frames: List[np.ndarray], frame_rate: int, threshold: int = 20) -> List[List[float]]:
    alerts = []
    prev_frame = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
    for idx, frame in tqdm.tqdm(enumerate(frames[1:]), total=len(frames) - 1, leave=False):
        curr_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Calculate frame difference
        frame_diff = cv2.absdiff(curr_frame, prev_frame)

        # Check if frame difference is above threshold
        if np.mean(frame_diff) > threshold:
            alerts.append(idx / frame_rate)

        prev_frame = curr_frame

    return alerts

def check_face_consistency(frames: List[np.ndarray], frame_rate: int, face_detector: DlibFaceDetector) -> List[List[float]]:
    alerts = []
    for idx in tqdm.trange(0, len(frames) - 10, 10, leave=False):
        frame = frames[idx]
        faces = face_detector.detect_faces(frame)
        if len(faces) != 1:
            alerts.append(idx / frame_rate)
    
    return alerts
    
def calculate_brightness_contrast(frame):
    # Convert to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Calculate brightness (mean) and contrast (standard deviation)
    brightness = np.mean(gray_frame)
    contrast = np.std(gray_frame)
    
    return brightness, contrast

def check_brightness_contrast_consistency(frames: List[np.ndarray], frame_rate: int, brightness_threshold: float = 10.0, contrast_threshold: float = 5.0) -> List[List[float]]:
    alerts = []
    
    prev_brightness, prev_contrast = calculate_brightness_contrast(frames[0])
    
    for idx, frame in tqdm.tqdm(enumerate(frames[1:]), total=len(frames) - 1, leave=False):
        brightness, contrast = calculate_brightness_contrast(frame)
        
        # Check if brightness or contrast difference is above the threshold
        if abs(brightness - prev_brightness) > brightness_threshold or abs(contrast - prev_contrast) > contrast_threshold:
            alerts.append(idx / frame_rate)

        prev_brightness, prev_contrast = brightness, contrast

    return alerts

def eye_aspect_ratio(eye):
    # Compute the distances between the two sets of vertical eye landmarks (x, y)-coordinates
    A = np.linalg.norm(eye[1] - eye[5])
    B = np.linalg.norm(eye[2] - eye[4])

    # Compute the distance between the horizontal eye landmark (x, y)-coordinates
    C = np.linalg.norm(eye[0] - eye[3])

    # Compute the eye aspect ratio
    ear = (A + B) / (2.0 * C)

    return ear

def detect_blinks(frames: List[np.ndarray], frame_rate: int, face_detector: DlibFaceDetector, ear_threshold: float = 0.3, consecutive_frames: int = 3) -> List[int]:
    blink_frames = []
    blink_counter = 0
    frame_counter = 0

    for idx in tqdm.trange(0, len(frames) - 10, 10, leave=False):
        frame = frames[idx]
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detect_faces(gray)

        for face in faces:
            landmarks = face_detector.detect_landmarks(gray, face)

            # Extract the left and right eye coordinates
            leftEye = landmarks[42:48]
            rightEye = landmarks[36:42]

            # Calculate the EAR for both eyes
            leftEAR = eye_aspect_ratio(leftEye)
            rightEAR = eye_aspect_ratio(rightEye)

            # Average the EAR
            ear = (leftEAR + rightEAR) / 2.0

            # Check if EAR is below the blink threshold
            if ear < ear_threshold:
                blink_counter += 1
            else:
                # If the eyes were closed for a sufficient number of frames, then increment the total number of blinks
                if blink_counter >= consecutive_frames:
                    blink_frames.append(frame_counter / frame_rate)

                blink_counter = 0

        frame_counter += 1

    return blink_frames

def check_blur(frame: np.ndarray):
    grid_size=(16, 16)

    height, width, _ = frame.shape

    # Calculate the size of each grid cell
    cell_height, cell_width = height // grid_size[0], width // grid_size[1]

    # Initialize an array to store blurriness values
    blurriness_grid = np.zeros(grid_size)

    for row in range(grid_size[0]):
        for col in range(grid_size[1]):
            # Extract the cell
            cell = frame[row * cell_height:(row + 1) * cell_height,
                            col * cell_width:(col + 1) * cell_width]

            # Calculate the Laplacian variance
            variance_of_laplacian = cv2.Laplacian(cell, cv2.CV_64F).var()

            # Store the blurriness value
            blurriness_grid[row, col] = variance_of_laplacian

    return np.std(blurriness_grid)

def validate_blur(frames: List[np.ndarray], frame_rate: int, face_detector: DlibFaceDetector):
    blur_failed_frames = []
    for frame_idx in range(0, len(frames) - 10, 10):
        frame = frames[frame_idx]
        
        faces = face_detector.detect_faces(frame)
        if len(faces) != 1:
            continue

        blur_baseline = check_blur(frame)

        l,r,b,t = face.left(), face.right(), face.bottom(), face.top()
        image_cropped = image[t:b, l:r]
        
        blur_new = check_blur(image_cropped)

        if abs(blur_new - blur_baseline) > 45:
            blur_failed_frames.append(frame_idx / frame_rate)
    return blur_failed_frames

def check_authenticity(file_path: str):
    face_detector = DlibFaceDetector()
    
    frames, frame_rate = extract_frames(file_path)
    if len(frames) == 0:
        print("[❗] No frames found")
        return
    
    print(f"Extracted {len(frames)} frames with frame rate {frame_rate}")

    # Check for frame inconsistencies
    frame_inconsistencies = check_frame_consistency(frames, frame_rate)
    if len(frame_inconsistencies) > 0:
        print("[❗] Found frame inconsistencies")
        print(frame_inconsistencies)
    else:
        print("[✅] No frame inconsistencies found")

    # Check for face count inconsistencies
    face_inconsistencies = check_face_consistency(frames, frame_rate, face_detector)
    if len(face_inconsistencies) > 0:
        print("[❗] Found face inconsistencies")
        print(face_inconsistencies)
    else:
        print("[✅] No face inconsistencies found")

    # Check for brightness and contrast inconsistencies
    brightness_contrast_inconsistencies = check_brightness_contrast_consistency(frames, frame_rate)
    if len(brightness_contrast_inconsistencies) > 0:
        print("[❗] Found brightness and contrast inconsistencies")
        print(brightness_contrast_inconsistencies)
    else:
        print("[✅] No brightness and contrast inconsistencies found")

    # Check for blinks
    blink_frames = detect_blinks(frames, frame_rate, face_detector)
    if len(blink_frames) == 0:
        print("[❗] No blinks found")
    elif len(blink_frames) > len(frames) / frame_rate * 1.5 and len(blink_frames) > 2:
        print("[❗] Too many blinks found")
        print(blink_frames)
    else:
        print("[✅] No blink inconsistencies found")
        print("Blinks:", len(blink_frames))

if __name__ == "__main__":
    filename = input("Enter filename: ")
    if filename == '':
        filename = "invalid.mov"
    check_authenticity(f"{get_current_path()}/../data/{filename}")
