# Requirements Traceability Matrix (RTM)

This document maps requirements and features across the OrangeHRM system under test to their corresponding automated and manual test cases.

| Module | Feature / Requirement | Test Type | Test Case ID | Test Case Title / Scenario Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth / Login** | Invalid login credential error handling | Automation | `Q1-AUT-001` | Verify error message on invalid username/password | **Pass** |
| **Auth / Login** | Mandatory field validation (empty inputs) | Manual | `TC-LOGIN-001` | Verify 'Required' error on submitting empty form | **Pass** |
| **Auth / Login** | Password security & masking | Manual | `TC-LOGIN-002` | Verify password characters masked by default | **Pass** |
| **Auth / Login** | Session protection & route guarding | Manual | `TC-LOGIN-003` | Verify unauthorized direct URL access redirects to login | **Pass** |
| **PIM** | Add employee with random data & search in list | Automation | `Q2-AUT-002` | Add employee with dynamic data, search by ID, logout | **Pass** |
| **PIM** | Mandatory name fields validation | Manual | `TC-PIM-001` | Verify required validation when names are empty | **Pass** |
| **PIM** | Boundary testing: Names with special characters | Manual | `TC-PIM-002` | Verify names with hyphens and apostrophes save cleanly | **Pass** |
| **PIM** | Uniqueness constraint on Employee ID | Manual | `TC-PIM-003` | Verify duplicate Employee ID is rejected | **Pass** |
| **Admin** | User search, role/status update, persistence | Automation | `Q3-AUT-003` | Search user, edit role/status, verify persistence on reload | **Pass** |
| **Admin** | Safe search input & SQL/script injection defense | Manual | `TC-ADMIN-001` | Verify search field handles special/SQL characters safely | **Pass** |
| **Admin** | Password complexity policy enforcement | Manual | `TC-ADMIN-002` | Verify weak password displays complexity warnings | **Pass** |
| **Admin** | Session safety: prevent self-deletion | Manual | `TC-ADMIN-003` | Verify logged-in admin cannot delete their own account | **Pass** |
| **Leave** | Apply leave, check My Leave, cancel request | Automation | `Q4-AUT-004` | Apply leave, verify Pending Approval, cancel request | **Pass** |
| **Leave** | Date range validation (To Date < From Date) | Manual | `TC-LEAVE-001` | Verify error when To Date is earlier than From Date | **Pass** |
| **Leave** | Leave balance entitlement rules | Manual | `TC-LEAVE-002` | Verify leave request blocked when balance is 0 | **Pass** |
| **Leave** | Input format boundary check on date picker | Manual | `TC-LEAVE-003` | Verify manual input of invalid calendar date format | **Pass** |

---
**Summary**:
- Total Requirements Covered: 16
- Automated Scenarios: 4
- Manual Test Cases: 12
- Execution Coverage: 100%
