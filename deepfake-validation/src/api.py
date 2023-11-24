from flask import Flask, request, jsonify

from utils import *

app = Flask(__name__)

def analyze_video(url: str) -> int:
    video_path = download_video(url)
    frames, frame_rate = extract_frames(video_path)

    face_detector = DlibFaceDetector()
    face_counts = []
    for frame in tqdm.tqdm(frames):
        faces = face_detector.detect_faces(frame)
        face_counts.append(len(faces))
    
    if len(face_counts) == 0:
        return {"error": "No faces found"}

    return {"max_faces": max(set(face_counts), key=face_counts.count)}

@app.route('/validate', methods=['POST'])
def validate():
    url = request.json['url']

    if not url:
        return jsonify({'error': 'No url provided'}), 400

    analysis = analyze_video(url)
    print(analysis)
    return analysis

if __name__ == '__main__':
    app.run()
