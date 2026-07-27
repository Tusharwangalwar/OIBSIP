package com.oibsip.library.service;

import com.oibsip.library.entity.Book;
import com.oibsip.library.entity.BookIssue;
import com.oibsip.library.entity.User;
import com.oibsip.library.repository.BookIssueRepository;
import com.oibsip.library.repository.BookRepository;
import com.oibsip.library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit; // 👈 Import added for calculating overdue days
import java.util.List;

@Service
public class BookIssueService {

    private final BookIssueRepository bookIssueRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookIssueService(BookIssueRepository bookIssueRepository,
                            BookRepository bookRepository,
                            UserRepository userRepository) {
        this.bookIssueRepository = bookIssueRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public BookIssue issueBook(Long bookId, String userEmail) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is currently not available for issue!");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // Set book as unavailable
        book.setAvailable(false);
        bookRepository.save(book);

        // Issue for 14 days by default
        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(14);

        BookIssue bookIssue = new BookIssue(user, book, issueDate, dueDate);
        return bookIssueRepository.save(bookIssue);
    }

    public BookIssue returnBook(Long issueId) {
        BookIssue bookIssue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue record not found with id: " + issueId));

        if (bookIssue.isReturned()) {
            throw new RuntimeException("This book has already been returned!");
        }

        LocalDate returnDate = LocalDate.now();
        bookIssue.setReturned(true);
        bookIssue.setReturnDate(returnDate);

        // 💰 Fine Calculation Logic ($2 / ₹2 per overdue day)
        if (returnDate.isAfter(bookIssue.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(bookIssue.getDueDate(), returnDate);
            double finePerDay = 2.0;
            bookIssue.setFine(daysOverdue * finePerDay);
        } else {
            bookIssue.setFine(0.0);
        }

        // Mark book as available again
        Book book = bookIssue.getBook();
        book.setAvailable(true);
        bookRepository.save(book);

        return bookIssueRepository.save(bookIssue);
    }

    public List<BookIssue> getAllIssues() {
        return bookIssueRepository.findAll();
    }

    public List<BookIssue> getUserIssues(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        return bookIssueRepository.findByUser(user);
    }
}