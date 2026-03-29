"""
Quick email test script to verify SMTP configuration works.
Run this from the backend directory: python test_email.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    """Send a test email to verify SMTP configuration."""
    
    print("=" * 60)
    print("Testing Email Configuration")
    print("=" * 60)
    print(f"Backend: {settings.EMAIL_BACKEND}")
    print(f"Host: {settings.EMAIL_HOST}")
    print(f"Port: {settings.EMAIL_PORT}")
    print(f"User: {settings.EMAIL_HOST_USER}")
    print(f"From: {settings.DEFAULT_FROM_EMAIL}")
    print("=" * 60)
    
    test_recipient = input("\nEnter test email address: ").strip()
    
    if not test_recipient:
        print("❌ No email provided. Exiting.")
        return
    
    print(f"\n📧 Sending test email to {test_recipient}...")
    
    try:
        send_mail(
            subject="Test Email from Hostel Nepal",
            message="This is a test email to verify SMTP configuration is working correctly.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[test_recipient],
            fail_silently=False,
            html_message="""
            <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #059669;">✅ Email Configuration Test</h2>
                    <p>This is a test email from Hostel Nepal.</p>
                    <p>If you received this, your SMTP configuration is working correctly!</p>
                    <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 12px;">Hostel Nepal - Email System Test</p>
                </body>
            </html>
            """,
        )
        print("✅ Email sent successfully!")
        print(f"   Check {test_recipient} inbox (and spam folder)")
        
    except Exception as e:
        print(f"❌ Failed to send email: {str(e)}")
        print("\nCommon issues:")
        print("  • Gmail App Password not set correctly")
        print("  • 2FA not enabled on Gmail account")
        print("  • EMAIL_BACKEND still set to console")
        print("  • Firewall blocking SMTP port 587")

if __name__ == "__main__":
    test_email()
