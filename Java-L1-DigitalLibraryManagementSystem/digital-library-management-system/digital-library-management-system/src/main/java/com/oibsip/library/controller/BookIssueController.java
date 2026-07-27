package com.oibsip.library.controller;

import com.oibsip.library.entity.BookIssue;
import com.oibsip.library.service.BookIssueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class BookIssueController {

    private final BookIssueService bookIssueService;

    public BookIssueController(BookIssueService bookIssueService) {
        this.bookIssueService = bookIssueService;
    }

    @PostMapping("/issue/{bookId}")
    public ResponseEntity<BookIssue> issueBook(@PathVariable Long bookId, Authentication authentication) {
        String userEmail = authentication.getName();
        return new ResponseEntity<>(bookIssueService.issueBook(bookId, userEmail), HttpStatus.CREATED);
    }

    @PutMapping("/return/{issueId}")
    public ResponseEntity<BookIssue> returnBook(@PathVariable Long issueId) {
        return ResponseEntity.ok(bookIssueService.returnBook(issueId));
    }

    @GetMapping
    public ResponseEntity<List<BookIssue>> getAllIssues() {
        return ResponseEntity.ok(bookIssueService.getAllIssues());
    }

    @GetMapping("/my-issues")
    public ResponseEntity<List<BookIssue>> getMyIssues(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookIssueService.getUserIssues(userEmail));
    }
}