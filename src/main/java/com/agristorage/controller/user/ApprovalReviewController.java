package com.agristorage.controller.user;

import com.agristorage.dto.request.ApprovalRequest;
import com.agristorage.dto.response.MessageResponse;
import com.agristorage.entity.user.User;
import com.agristorage.service.user.ApprovalReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ApprovalReviewController {

    private final ApprovalReviewService approvalReviewService;

    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return approvalReviewService.getPendingUsers();
    }

    @PostMapping("/approve/{userId}")
    public MessageResponse approveUser(@PathVariable Long userId,
                                       @RequestBody ApprovalRequest request,
                                       @AuthenticationPrincipal UserDetails adminDetails) {
        Long adminId = approvalReviewService.getUserIdByEmail(adminDetails.getUsername());
        approvalReviewService.approveUser(userId, adminId, request.getComment());
        return new MessageResponse("User approved");
    }

    @PostMapping("/reject/{userId}")
    public MessageResponse rejectUser(@PathVariable Long userId,
                                      @RequestBody ApprovalRequest request,
                                      @AuthenticationPrincipal UserDetails adminDetails) {
        Long adminId = approvalReviewService.getUserIdByEmail(adminDetails.getUsername());
        approvalReviewService.rejectUser(userId, adminId, request.getReason());
        return new MessageResponse("User rejected");
    }

    @GetMapping("/history/{userId}")
    public List<?> getApprovalHistory(@PathVariable Long userId) {
        return approvalReviewService.getApprovalHistory(userId);
    }
}