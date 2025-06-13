from django.urls import path
from . import views

urlpatterns = [
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('issue-book/', views.IssueBookView.as_view(), name='issue-book'),
]
