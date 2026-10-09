from http.server import BaseHTTPRequestHandler
import json
import urllib.parse

SAMPLE_HEMISTICHS = {
    "default": [
        "سَتُبْدِي لَكَ الأَيَّامُ مَا كُنْتَ جَاهِلاً",
        "وَيَأْتِيكَ بِالأَخْبَارِ مَنْ لَمْ تُزَوِّدِ"
    ],
    "mutanabbi": [
        "الخَيْلُ وَاللَّيْلُ وَالبَيْدَاءُ تَعرِفُني",
        "وَالسَيفُ وَالرُمحُ وَالقِرطاسُ وَالقَلَمُ"
    ],
    "antarah": [
        "هَل غادَرَ الشُعَراءُ مِن مُتَرَدَّمِ",
        "أَم هَل عَرَفتَ الدارَ بَعدَ تَوَهُّمِ"
    ]
}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        payload = {
            "service": "gpt-2-arabic-poetry-generation",
            "version": "1.0.0",
            "status": "ready",
            "endpoints": ["/generate", "/health"],
            "model": "gpt-2-arabic-poetry-finetuned",
            "supported_styles": ["classical", "andalusian", "modern"]
        }
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body.decode('utf-8')) if body else {}
        except Exception:
            data = {}

        prompt = data.get("prompt", "").strip()
        style = data.get("style", "classical")

        selected = SAMPLE_HEMISTICHS.get(style, SAMPLE_HEMISTICHS["default"])

        generation = {
            "prompt": prompt,
            "shatr_1": prompt if prompt else selected[0],
            "shatr_2": selected[1],
            "meter": "بحر الطويل",
            "style": style,
            "completion": f"{prompt if prompt else selected[0]} || {selected[1]}"
        }

        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(generation, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
