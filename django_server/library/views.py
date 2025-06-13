from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Book, BookRequest, IssuedBook
from .serializers import BookSerializer, IssueBookSerializer, BookRequestSerializer

class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class IssueBookView(generics.GenericAPIView):
    serializer_class = IssueBookSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        book_id = serializer.validated_data['book_id']
        user_id = serializer.validated_data['user_id']

        try:
            book = Book.objects.get(id=book_id)
            user = User.objects.get(id=user_id)
        except (Book.DoesNotExist, User.DoesNotExist):
            return Response({'error': 'Book or User not found'}, status=status.HTTP_404_NOT_FOUND)

        if book.available <= 0:
            return Response({'error': 'Book not available'}, status=status.HTTP_400_BAD_REQUEST)

        request_obj = BookRequest.objects.create(user=user, book=book)
        return Response(BookRequestSerializer(request_obj).data)
