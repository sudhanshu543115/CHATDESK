import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

print("--- Cloudinary Deep Diagnostic ---")
print(f"Cloud Name: [{os.getenv('CLOUDINARY_CLOUD_NAME')}]")
print(f"API Key: [{os.getenv('CLOUDINARY_API_KEY')}]")

key = os.getenv('CLOUDINARY_API_KEY', '')
secret = os.getenv('CLOUDINARY_API_SECRET', '')

if key != key.strip():
    print("WARNING: API Key has hidden spaces!")
if secret != secret.strip():
    print("WARNING: API Secret has hidden spaces!")

print("\nAttempting a tiny test upload...")
try:
    result = cloudinary.uploader.upload(
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        folder="test_diag"
    )
    print("SUCCESS! Cloudinary is working perfectly.")
    print(f"Test URL: {result.get('secure_url')}")
except Exception as e:
    print(f"FAILED: {str(e)}")
print("---------------------------")
