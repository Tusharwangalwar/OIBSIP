package com.oibsip.library.repository;

import com.oibsip.library.entity.BookIssue;
import com.oibsip.library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
    List<BookIssue> findByUser(User user);
    List<BookIssue> findByReturned(boolean returned);
}