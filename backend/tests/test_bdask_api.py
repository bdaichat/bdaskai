"""
BdAsk.com Backend API Tests
Tests chat, translation, and status endpoints
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndStatus:
    """Tests for health check and status endpoints"""
    
    def test_api_root_endpoint(self):
        """Test the API root returns welcome message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API Root: {data}")
    
    def test_status_create(self):
        """Test creating a status check"""
        response = requests.post(
            f"{BASE_URL}/api/status",
            json={"client_name": "TEST_bdask_client"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["client_name"] == "TEST_bdask_client"
        print(f"Status created: {data}")
    
    def test_status_list(self):
        """Test getting status checks"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Status list count: {len(data)}")


class TestChatEndpoints:
    """Tests for chat session and message endpoints"""
    
    def test_create_chat_session(self):
        """Test creating a new chat session"""
        response = requests.post(
            f"{BASE_URL}/api/chat/session",
            json={"title": "TEST_session"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "title" in data
        assert data["title"] == "TEST_session"
        self.__class__.session_id = data["id"]
        print(f"Chat session created: {data['id']}")
        return data["id"]
    
    def test_get_chat_sessions(self):
        """Test getting all chat sessions"""
        response = requests.get(f"{BASE_URL}/api/chat/sessions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Chat sessions count: {len(data)}")
    
    def test_send_chat_message_bengali(self):
        """Test sending a Bengali message and getting AI response"""
        # First create a session
        session_response = requests.post(
            f"{BASE_URL}/api/chat/session",
            json={"title": "TEST_bengali_chat"}
        )
        session_id = session_response.json()["id"]
        
        # Send a Bengali message
        response = requests.post(
            f"{BASE_URL}/api/chat/send",
            json={
                "session_id": session_id,
                "message": "হ্যালো, তুমি কে?"
            },
            timeout=30  # AI responses may take time
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 0
        print(f"AI Response (Bengali): {data['response'][:100]}...")
        
        # Cleanup - delete session
        requests.delete(f"{BASE_URL}/api/chat/session/{session_id}")
    
    def test_get_chat_messages(self):
        """Test getting messages for a session"""
        # Create a session first
        session_response = requests.post(
            f"{BASE_URL}/api/chat/session",
            json={"title": "TEST_messages"}
        )
        session_id = session_response.json()["id"]
        
        # Get messages (should be empty initially)
        response = requests.get(f"{BASE_URL}/api/chat/messages/{session_id}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Messages for session: {len(data)}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/chat/session/{session_id}")
    
    def test_delete_chat_session(self):
        """Test deleting a chat session"""
        # Create a session first
        session_response = requests.post(
            f"{BASE_URL}/api/chat/session",
            json={"title": "TEST_to_delete"}
        )
        session_id = session_response.json()["id"]
        
        # Delete it
        response = requests.delete(f"{BASE_URL}/api/chat/session/{session_id}")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"Session deleted: {session_id}")


class TestTranslationEndpoint:
    """Tests for the translation API endpoint"""
    
    def test_translate_bengali_to_english(self):
        """Test translating Bengali to English"""
        response = requests.post(
            f"{BASE_URL}/api/translate",
            json={
                "text": "হ্যালো",
                "source": "bn",
                "target": "en"
            },
            timeout=30  # AI translation may take time
        )
        assert response.status_code == 200
        data = response.json()
        assert "translated_text" in data
        assert data["source"] == "bn"
        assert data["target"] == "en"
        print(f"Translation: হ্যালো -> {data['translated_text']}")
    
    def test_translate_english_to_bengali(self):
        """Test translating English to Bengali"""
        response = requests.post(
            f"{BASE_URL}/api/translate",
            json={
                "text": "Hello Bangladesh",
                "source": "en",
                "target": "bn"
            },
            timeout=30
        )
        assert response.status_code == 200
        data = response.json()
        assert "translated_text" in data
        assert data["source"] == "en"
        assert data["target"] == "bn"
        print(f"Translation: Hello Bangladesh -> {data['translated_text']}")
    
    def test_translate_hindi_to_bengali(self):
        """Test translating Hindi to Bengali"""
        response = requests.post(
            f"{BASE_URL}/api/translate",
            json={
                "text": "नमस्ते",
                "source": "hi",
                "target": "bn"
            },
            timeout=30
        )
        assert response.status_code == 200
        data = response.json()
        assert "translated_text" in data
        print(f"Translation: नमस्ते -> {data['translated_text']}")
    
    def test_translate_empty_text(self):
        """Test that empty text still returns a response (or appropriate error)"""
        response = requests.post(
            f"{BASE_URL}/api/translate",
            json={
                "text": "",
                "source": "bn",
                "target": "en"
            },
            timeout=30
        )
        # Could be 200 with empty result or 400/422 for validation error
        # Just check it doesn't crash with 500
        assert response.status_code in [200, 400, 422]
        print(f"Empty text response status: {response.status_code}")


class TestAPIValidation:
    """Tests for API validation and error handling"""
    
    def test_invalid_session_id_for_messages(self):
        """Test getting messages for non-existent session"""
        response = requests.get(f"{BASE_URL}/api/chat/messages/nonexistent-session-id")
        # Should return empty list or 404, not 500
        assert response.status_code in [200, 404]
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)
    
    def test_chat_send_missing_session_id(self):
        """Test sending message without session_id"""
        response = requests.post(
            f"{BASE_URL}/api/chat/send",
            json={"message": "test"}  # Missing session_id
        )
        assert response.status_code == 422  # Validation error
        print(f"Missing session_id validation: {response.status_code}")
    
    def test_translate_missing_fields(self):
        """Test translation with missing required fields"""
        response = requests.post(
            f"{BASE_URL}/api/translate",
            json={"text": "test"}  # Missing source and target
        )
        assert response.status_code == 422  # Validation error


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
