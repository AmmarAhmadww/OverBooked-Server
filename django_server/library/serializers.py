from rest_framework import serializers
from .models import Book, BookRequest, IssuedBook

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'book_name', 'author', 'category', 'available', 'issued', 'cover', 'rating', 'pdf', 'read_count', 'description']

class IssueBookSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    user_id = serializers.IntegerField()

class BookRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookRequest
        fields = ['id', 'user', 'book', 'status', 'request_date']

class IssuedBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssuedBook
        fields = ['id', 'user', 'book', 'issue_date', 'return_date', 'has_read']
