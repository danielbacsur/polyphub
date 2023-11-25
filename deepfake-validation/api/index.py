import os
from flask import Flask, request, jsonify
import multiprocessing
from utils import *
import requests


def analyze_video( url: str) -> int:
    video_path = download_video(url)
    frames, frame_rate = extract_frames(video_path)

    face_detector = DlibFaceDetector()

    print(f"Extracted {len(frames)} frames with frame rate {frame_rate}")

    # Check for frame inconsistencies
    frame_inconsistencies = check_frame_consistency(frames, frame_rate)
    if len(frame_inconsistencies) > 0:
        print("Found frame inconsistencies")
        print(frame_inconsistencies)
    else:
        print("No frame inconsistencies found")

    # Check for face count inconsistencies
    face_inconsistencies = check_face_consistency(frames, frame_rate, face_detector)
    if len(face_inconsistencies) > 0:
        print("Found face inconsistencies")
        print(face_inconsistencies)
    else:
        print("No face inconsistencies found")

    # Check for brightness and contrast inconsistencies
    brightness_contrast_inconsistencies = check_brightness_contrast_consistency(frames, frame_rate)
    if len(brightness_contrast_inconsistencies) > 0:
        print("Found brightness and contrast inconsistencies")
        print(brightness_contrast_inconsistencies)
    else:
        print("No brightness and contrast inconsistencies found")

    # Check for blinks
    blink_frames = detect_blinks(frames, frame_rate, face_detector)
    blink_error_type = "nominal"
    if len(blink_frames) == 0:
        print("No blinks found")
        blink_error_type = "no-blinks"
    elif len(blink_frames) > len(frames) / frame_rate * 1.5 and len(blink_frames) > 2:
        print("Too many blinks found")
        blink_error_type = "too-many-blinks"
    else:
        print("No blink inconsistencies found")
    
    print("Blinks:", len(blink_frames))

    # Check blur
    blur_failed_frames = validate_blur(frames, frame_rate, face_detector)
    if len(blur_failed_frames) > 0:
        print("Found blur inconsistencies")

    # Probability calculation based on metrics
    probability = 0.0

    # Weight factors for each metric
    weight_frame_inconsistencies = 0.5
    weight_blink_inconsistencies = 0.1
    weight_blur_failures = 0.4

    total_frames = len(frames)

    # Adjust probability based on frame inconsistencies
    if len(frame_inconsistencies) > 0:
        probability += weight_frame_inconsistencies

    # Adjust probability based on blink inconsistencies
    if blink_error_type == "no-blinks":
        probability += weight_blink_inconsistencies

    # Adjust probability based on blur failures
    blur_failure_ratio = len(blur_failed_frames) * frame_rate / 10 / total_frames
    if blur_failure_ratio > 0.1:  # Assuming more than 10% blur failures is significant
        probability += weight_blur_failures * blur_failure_ratio

    # Normalize probability to be within 0 to 1
    probability = np.clip(probability, 0, 1)

    os.remove(video_path)
    
    return {
        "tags": [
            {
                "type": "frame_inconsistencies",
                "count": len(frame_inconsistencies),
                "times": frame_inconsistencies,
            },
            {
                "type": "face_inconsistencies",
                "count": len(face_inconsistencies),
                "times": face_inconsistencies,
            },
            {
                "type": "brightness_contrast_inconsistencies",
                "count": len(brightness_contrast_inconsistencies),
                "times": brightness_contrast_inconsistencies,
            },
            {
                "type": "blinks",
                "count": len(blink_frames),
                "times": blink_frames,
            },
            {
                "type": "blur",
                "count": len(blur_failed_frames),
                "times": blur_failed_frames,
            }
        ],
        "length": len(frames),
        "framerate": frame_rate,
        "duration": len(frames) / frame_rate,
        "blinks": blink_error_type,
        "deepfake_probability": probability
    }

app = Flask(__name__)

def timed_process(url: str, callback: str):

    print("Analizing", url)

    analization = analyze_video(url)

    print("Posting to", callback)
    
    try:
        response = requests.post(callback, json=analization)
        print(f"Response from {callback}: {response.status_code}")
    except Exception as e:
        print(f"Error during request: {e}")

    exit()

@app.route('/validate', methods=['POST'])
def validate():
    url = request.json['url']
    callback = request.json['callback']
    
    process = multiprocessing.Process(target=timed_process, args=(url, callback))
    process.start()

    return "Success", 200

if __name__ == '__main__':
    app.run("0.0.0.0", 80)
