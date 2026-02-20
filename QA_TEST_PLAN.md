# QA Test Plan - TODO API Testing Playground

## Document Information

**Project:** TODO API Testing Playground  
**Version:** 1.0.0  
**Last Updated:** February 2026  
**Purpose:** Comprehensive test plan for API functionality, security, and performance validation  
**Target Audience:** QA Engineers, Test Automation Engineers  

---

## 1. Test Plan Overview

### 1.1 Purpose and Scope

This test plan covers comprehensive testing of the TODO API, which is designed specifically as a testing playground for QA engineers to practice various API testing scenarios.

**In Scope:**
- Functional testing of all 19 API endpoints
- Authentication and authorization mechanisms
- Input validation and data integrity
- Error handling and response formats
- Query parameters and filtering
- Performance and response time validation
- Security testing (JWT, cross-user access)
- Integration workflows

**Out of Scope:**
- Database internal architecture testing
- Infrastructure and deployment testing
- UI/Frontend testing (API only)
- Load testing beyond basic concurrent requests

### 1.2 Test Environment

**Server:** http://localhost:3000  
**Database:** SQLite (local file)  
**Authentication:** JWT Bearer tokens (24-hour expiration)  
**Response Format:** JSON  

### 1.3 Test Data Requirements

The API includes pre-seeded test data:

**Test Users (3):**
- Email: `tester1@example.com` | Password: `password123`
- Email: `tester2@example.com` | Password: `password123`
- Email: `tester3@example.com` | Password: `password123`

**Sample Todos:** 10 todos distributed across users with various completion states

**Reset Command:** `npm run db:reset` (to restore test data)

### 1.4 Prerequisites for Testing

1. Server must be running (`npm run dev`)
2. Database must be seeded (`npm run db:seed`)
3. Testing tools ready (Postman, curl, or automation framework)
4. Understanding of JWT token handling
5. Ability to send HTTP requests with custom headers

---

## 2. Authentication & Authorization Testing

### Test Objective
Verify that the authentication system properly handles user registration, login, logout, and token-based access control.

### Preconditions
- Fresh database state
- No active tokens initially

### Test Scenarios

#### 2.1 User Registration

**What to Test:**
- Successful registration with valid email, password (8+ characters), and name
- Verify JWT token is returned along with user details
- Confirm user can immediately use returned token for authenticated requests
- Test duplicate email registration returns appropriate error
- Validate email format enforcement (reject invalid formats)
- Test password length requirement (minimum 8 characters)
- Verify missing required fields return validation errors
- Check that password is not returned in response
- Test special characters in name field
- Validate very long names (boundary testing)
- Attempt SQL injection in email field
- Test registration with whitespace-only name

**Expected Behaviors:**
- 201 status for successful registration
- 400 status for validation errors or duplicate email
- Response includes user object (id, email, name) and JWT token
- Error messages are clear and specific to the validation failure
- Email format must be valid (contains @ and domain)
- Password must be at least 8 characters

**Edge Cases:**
- Email with special characters (valid ones like +, .)
- Password exactly 8 characters (boundary)
- Password with 7 characters (below boundary)
- Very long email addresses
- Unicode characters in name
- Empty string vs null values

#### 2.2 User Login

**What to Test:**
- Successful login with valid credentials
- Verify JWT token is returned
- Test login with incorrect password
- Test login with non-existent email
- Validate case sensitivity of email
- Test missing email or password fields
- Attempt SQL injection in email/password fields
- Test login with recently created user
- Verify password is not exposed in any error messages

**Expected Behaviors:**
- 200 status for successful login
- 401 status for invalid credentials
- Generic error message ("Invalid email or password") for security
- JWT token has 24-hour expiration
- Token contains user ID and email in payload

**Edge Cases:**
- Login immediately after registration
- Login with whitespace in email/password
- Multiple failed login attempts
- Very long password strings

#### 2.3 Logout Functionality

**What to Test:**
- Successful logout with valid token
- Verify token is blacklisted after logout
- Attempt to use logged-out token on protected routes
- Test logout without providing token
- Test logout with invalid token format
- Test logout with expired token

**Expected Behaviors:**
- 200 status for successful logout
- 401 status when attempting to reuse blacklisted token
- Token remains in blacklist for duration of server session
- Clear success message returned

#### 2.4 Token Management

**What to Test:**
- Access protected routes with valid token
- Access protected routes without token
- Access protected routes with malformed Bearer header
- Test token with missing "Bearer" prefix
- Test token with extra spaces in header
- Verify token expiration after 24 hours (if feasible in testing window)
- Test token with invalid signature
- Test token from different JWT secret
- Concurrent requests with same token

**Expected Behaviors:**
- Valid tokens grant access to protected endpoints
- Missing tokens return 401 with clear error message
- Expired tokens return 401 with "Token expired" message
- Invalid tokens return 401 with "Invalid token" message
- Same token works across multiple concurrent requests

**Data Requirements:**
- At least 3 test users for various scenarios
- Freshly generated tokens and expired tokens (for simulation)

---

## 3. User Management Testing

### Test Objective
Validate user profile operations including retrieval, updates, and account deletion.

### Preconditions
- User must be logged in with valid JWT token
- Test users exist in database

### Test Scenarios

#### 3.1 Get User Profile

**What to Test:**
- Retrieve profile with valid authentication
- Verify all user fields are returned (id, email, name, timestamps)
- Test profile retrieval without authentication
- Test profile retrieval with expired token
- Verify profile shows current user data only
- Check timestamp formats are consistent
- Test profile retrieval immediately after name update

**Expected Behaviors:**
- 200 status with complete user object
- 401 status without valid authentication
- User can only see their own profile
- Timestamps in ISO 8601 format
- Email and name match user's current data

**Edge Cases:**
- Profile retrieval during concurrent updates
- Very recently updated profiles

#### 3.2 Update User Profile

**What to Test:**
- Successfully update name with valid data
- Verify name is updated in subsequent GET requests
- Test empty name value
- Test name with special characters
- Test very long name (boundary testing)
- Attempt to update with missing name field
- Test name with only whitespace
- Verify email cannot be changed (if not allowed)
- Test update without authentication
- Test update with another user's token

**Expected Behaviors:**
- 200 status for successful update
- 400 status for validation errors
- 401 status without authentication
- Updated name reflected immediately
- Other user fields remain unchanged

**Edge Cases:**
- Names with emoji or unicode
- Names at maximum reasonable length
- Concurrent updates from same user
- Update immediately after registration

#### 3.3 Delete User Account

**What to Test:**
- Successfully delete account with valid authentication
- Verify user cannot login after deletion
- Confirm all user's todos are deleted (cascade)
- Test deletion without authentication
- Attempt to access deleted user's data
- Test deleted user's token becomes invalid
- Verify deletion is permanent (cannot be undone)
- Test account deletion of user with many todos

**Expected Behaviors:**
- 200 status for successful deletion
- 401 status for subsequent requests with deleted user's token
- User's todos are automatically deleted
- Login with deleted credentials returns 401
- No orphaned data remains

**Data Requirements:**
- Test users with varying numbers of todos
- User with zero todos
- User with maximum todos

---

## 4. Todo CRUD Operations Testing

### Test Objective
Thoroughly test all create, read, update, and delete operations for todos, including ownership validation.

### Preconditions
- User authenticated with valid JWT token
- Test data includes existing todos

### Test Scenarios

#### 4.1 Create Todo

**What to Test:**
- Create todo with only title (required field)
- Create todo with title and description
- Create todo with completed flag set
- Test missing title returns validation error
- Test title at maximum length (100 characters)
- Test title exceeding maximum length (101 characters)
- Test description at maximum length (500 characters)
- Test description exceeding maximum length
- Test special characters in title and description
- Test HTML/script tags in text fields (XSS prevention)
- Create todo without authentication
- Test empty string vs missing title
- Test unicode characters in title

**Expected Behaviors:**
- 201 status for successful creation
- 400 status for validation errors
- 401 status without authentication
- Created todo includes auto-generated ID and timestamps
- Completed defaults to false if not provided
- Todo is associated with authenticated user

**Edge Cases:**
- Title with exactly 100 characters
- Description with exactly 500 characters
- Title/description with only special characters
- Creating multiple todos rapidly
- Todo with null description vs empty string

#### 4.2 Retrieve Todos

**What to Test:**
- Get all todos for authenticated user
- Verify only user's own todos are returned
- Test retrieval with no todos (empty array)
- Get single todo by valid ID
- Get single todo by non-existent ID
- Attempt to get another user's todo by ID
- Verify todo list is sorted by creation date (newest first)
- Test retrieval without authentication

**Expected Behaviors:**
- 200 status with array of todos
- Empty array if user has no todos
- 404 status for non-existent todo ID
- 401 status without authentication
- Only authenticated user's todos are visible
- Each todo includes all fields and timestamps

**Data Requirements:**
- Users with different numbers of todos (0, 1, many)
- Mix of completed and incomplete todos

#### 4.3 Update Todo

**What to Test:**
- Update todo title only
- Update todo description only
- Update completed status
- Update all fields simultaneously
- Test partial updates (some fields changed, others unchanged)
- Update with invalid data (title too long)
- Update non-existent todo
- Attempt to update another user's todo
- Update without authentication
- Test updating with no changes (idempotency)

**Expected Behaviors:**
- 200 status for successful update
- 400 status for validation errors
- 401 status without authentication
- 403 status when attempting to update another user's todo
- 404 status for non-existent todo
- updatedAt timestamp changes
- Only specified fields are modified

**Edge Cases:**
- Concurrent updates to same todo
- Update immediately after creation
- Toggle completed status multiple times
- Update with same values as current

#### 4.4 Mark as Completed

**What to Test:**
- Mark incomplete todo as completed
- Mark already completed todo (idempotency)
- Test without authentication
- Attempt to complete another user's todo
- Complete non-existent todo
- Verify completed field becomes true
- Check that other fields remain unchanged

**Expected Behaviors:**
- 200 status for successful operation
- 401 status without authentication
- 403 status for other user's todo
- 404 status for non-existent todo
- Completed field set to true
- updatedAt timestamp updated

#### 4.5 Delete Todo

**What to Test:**
- Successfully delete own todo
- Delete non-existent todo
- Attempt to delete another user's todo
- Delete without authentication
- Verify deleted todo cannot be retrieved
- Test deletion of completed vs incomplete todos

**Expected Behaviors:**
- 200 status for successful deletion
- 401 status without authentication
- 403 status for other user's todo
- 404 status for non-existent todo
- Subsequent GET returns 404
- Deletion is permanent

**Data Requirements:**
- Multiple users with their own todos
- Mix of completed/incomplete todos
- Todos at various ages

---

## 5. Query Parameters & Filtering Testing

### Test Objective
Validate filtering, searching, and pagination functionality work correctly and efficiently.

### Preconditions
- Database contains varied test data
- Multiple todos with different states

### Test Scenarios

#### 5.1 Filter by Completion Status

**What to Test:**
- Filter completed todos only (`?completed=true`)
- Filter incomplete todos only (`?completed=false`)
- Retrieve all todos (no filter)
- Test with invalid boolean values
- Test case sensitivity of parameter value
- Verify filtered results contain only requested type

**Expected Behaviors:**
- Only matching todos returned
- Pagination still works with filters
- Invalid boolean values handled gracefully
- Empty array if no matches

**Edge Cases:**
- User with all completed todos
- User with all incomplete todos
- Filter with string "true"/"false"

#### 5.2 Search Functionality

**What to Test:**
- Search by exact title match
- Search by partial title match
- Test case sensitivity of search
- Search with special characters
- Search with very short query (1 character)
- Search with no matches (empty result)
- Search with empty string
- Combine search with completed filter
- Test SQL injection in search parameter

**Expected Behaviors:**
- Partial matches returned (LIKE query)
- Search is case-insensitive
- Special characters handled safely
- Empty results return empty array
- Pagination works with search results

**Edge Cases:**
- Search term that matches all todos
- Search term that matches none
- Search with unicode characters
- Very long search strings

#### 5.3 Pagination

**What to Test:**
- First page retrieval (page=1)
- Second page retrieval (page=2)
- Page beyond available data
- Test with different limit values (5, 10, 20)
- Default pagination values (no params)
- Test page=0 or negative page numbers
- Test limit=0 or negative limit
- Verify pagination metadata accuracy (total, totalPages)
- Test with very large page numbers

**Expected Behaviors:**
- Default: page=1, limit=10
- Pagination metadata includes: total, page, limit, totalPages
- Empty array for pages beyond data
- Negative or zero values handled gracefully
- Total count is accurate

**Edge Cases:**
- User with exactly limit items
- User with 1 item more than limit
- User with 0 items
- Very large limit values

#### 5.4 Combined Filters

**What to Test:**
- Combine completed filter + search + pagination
- Verify all filters work together correctly
- Test conflicting or redundant parameters
- Multiple search queries (implementation dependent)
- Order of parameters doesn't affect results

**Expected Behaviors:**
- All filters applied correctly
- Pagination reflects filtered results
- Order independent
- Invalid params ignored or return error

**Data Requirements:**
- At least 20 todos per test user
- Mix of completed/incomplete
- Varied titles for search testing

---

## 6. Authorization & Security Testing

### Test Objective
Ensure users can only access and modify their own data, and authentication is properly enforced.

### Preconditions
- Multiple test users with their own todos
- Valid tokens for each user

### Test Scenarios

#### 6.1 Cross-User Data Access

**What to Test:**
- User A attempts to view User B's todo by ID
- User A attempts to update User B's todo
- User A attempts to delete User B's todo
- User A attempts to complete User B's todo
- Verify GET /todos only returns own todos
- Test accessing todos with sequential ID guessing

**Expected Behaviors:**
- 403 Forbidden for unauthorized access attempts
- 404 Not Found if implementation hides existence
- Clear error message about permissions
- No data leakage about other users

**Edge Cases:**
- Recently created todos from other users
- Deleted user's todos
- Concurrent access attempts

#### 6.2 Ownership Verification

**What to Test:**
- Create todo is automatically associated with creator
- Updated todos maintain correct userId
- Completed todos still belong to original user
- Verify user cannot change userId field
- Profile updates only affect own profile

**Expected Behaviors:**
- userId is set automatically
- userId cannot be modified by user
- All operations validate ownership
- Cascade deletes maintain data integrity

#### 6.3 Token Security

**What to Test:**
- Token reuse after logout (should fail)
- Token sharing between users (User A's token, User B's endpoint)
- Token tampering (modified payload)
- Token with invalid signature
- Concurrent sessions with same token
- Token replay attacks

**Expected Behaviors:**
- Blacklisted tokens rejected (401)
- Tokens are user-specific
- Tampered tokens rejected
- Valid tokens work across concurrent requests
- Token expiration enforced

**Data Requirements:**
- Minimum 3 test users
- Tokens for each user
- Cross-user todo IDs for testing

---

## 7. Validation Testing

### Test Objective
Verify all input validation rules are properly enforced and return meaningful error messages.

### Preconditions
- Understanding of validation rules for each field

### Test Scenarios

#### 7.1 Field-Level Validation

**What to Test:**
- Email format validation on registration
- Password minimum length (8 characters)
- Todo title required field
- Todo title max length (100 characters)
- Todo description max length (500 characters)
- Name required field in user update
- Data type validation (boolean for completed)

**Expected Behaviors:**
- Clear, specific error messages for each validation failure
- 400 status code for validation errors
- Multiple validation errors reported together
- Error messages indicate which field failed
- Error format is consistent

**Edge Cases:**
- Multiple validation failures in single request
- Valid data mixed with invalid data
- Empty string vs null vs missing field

#### 7.2 Boundary Testing

**What to Test:**
- Title with exactly 100 characters (valid)
- Title with 101 characters (invalid)
- Description with exactly 500 characters (valid)
- Description with 501 characters (invalid)
- Password with exactly 8 characters (valid)
- Password with 7 characters (invalid)
- Minimum length names (1 character)
- Maximum reasonable length names

**Expected Behaviors:**
- Boundary values at limit are accepted
- Values exceeding limit are rejected
- Error messages specify the exact limit
- No off-by-one errors

**Data Requirements:**
- Pre-calculated strings at boundary lengths
- Strings just over and under boundaries

#### 7.3 Invalid Data Types

**What to Test:**
- String instead of boolean for completed
- Number instead of string for title
- Array instead of object for request body
- Null values for required fields
- Undefined vs null handling

**Expected Behaviors:**
- Type mismatches rejected with clear errors
- Validation library catches type errors
- 400 status for type errors

#### 7.4 SQL Injection & XSS Attempts

**What to Test:**
- SQL injection strings in email field
- SQL injection in todo title/description
- XSS scripts in text fields
- HTML tags in text fields
- JavaScript code in input fields

**Expected Behaviors:**
- Inputs are properly escaped/sanitized
- No SQL injection vulnerabilities
- No XSS vulnerabilities
- Data stored as provided (encoded if necessary)
- No code execution from stored data

**Security Note:**
This is a test API, but validation should still prevent obvious attacks.

---

## 8. Error Handling & Response Testing

### Test Objective
Validate that error responses are consistent, helpful, and return appropriate HTTP status codes.

### Preconditions
- Understanding of expected status codes per endpoint

### Test Scenarios

#### 8.1 HTTP Status Codes

**What to Test:**
- 200 OK for successful GET, PUT, PATCH operations
- 201 Created for successful POST operations
- 400 Bad Request for validation errors
- 401 Unauthorized for authentication failures
- 403 Forbidden for authorization failures
- 404 Not Found for missing resources
- 500 Internal Server Error (simulated endpoint)

**Expected Behaviors:**
- Status codes match RESTful conventions
- Codes are consistent across similar operations
- Error responses include proper status code
- Success responses include proper status code

**What to Verify:**
- Each endpoint returns correct status for success
- Each endpoint returns correct status for each error type
- Status code matches response body content

#### 8.2 Error Response Format

**What to Test:**
- Consistent error response structure (`success`, `error`, `message`)
- Error messages are clear and actionable
- Validation errors list all field errors
- No sensitive data in error responses (no passwords, tokens)
- Error messages don't reveal system architecture
- Stack traces not exposed in production mode

**Expected Behaviors:**
- All errors follow standard format
- Multiple validation errors shown together
- Error field indicates what went wrong
- Message field provides context if available

**Edge Cases:**
- Multiple simultaneous errors
- Unexpected error types
- Database errors

#### 8.3 Error Simulation Endpoints

**What to Test:**
- GET /api/errors/400 returns 400
- GET /api/errors/401 returns 401
- GET /api/errors/403 returns 403
- GET /api/errors/404 returns 404
- GET /api/errors/500 returns 500
- Each returns appropriate error message
- Verify response format matches regular errors

**Expected Behaviors:**
- Each endpoint returns its designated status code
- Error format is consistent
- These endpoints help practice error handling

#### 8.4 Delayed Response Testing

**What to Test:**
- GET /api/errors/delay with default delay (2000ms)
- GET /api/errors/delay?ms=5000 (5 seconds)
- GET /api/errors/delay?ms=10000 (max 10 seconds)
- Test with ms=0 (immediate response)
- Test with ms > 10000 (should cap at 10000)
- Test with negative ms value
- Test with non-numeric ms value

**Expected Behaviors:**
- Response delayed by specified milliseconds
- Maximum delay capped at 10000ms
- Invalid values handled gracefully
- Response includes delay information
- 200 status after delay completes

**Data Requirements:**
- Timer/stopwatch to verify delays
- Patience for longer delays

---

## 9. Response Format Testing

### Test Objective
Ensure all API responses follow consistent format and include required fields.

### Preconditions
- Understanding of standard response structure

### Test Scenarios

#### 9.1 Success Response Structure

**What to Test:**
- All successful responses include `success: true`
- All successful responses include `data` object
- Message field present when applicable
- Data field contains expected object/array
- No unexpected fields in response

**Expected Behaviors:**
- Success responses consistent across all endpoints
- Data field structure matches documentation
- Null data field when no data to return (logout, delete)

**What to Verify:**
- Structure matches OpenAPI specification
- Field types are correct (boolean, object, string)

#### 9.2 Custom Headers

**What to Test:**
- X-Request-ID header present in all responses
- X-Request-ID is a valid UUID format
- X-App-Version header present in all responses
- X-App-Version shows correct version (1.0.0)
- Headers present in both success and error responses
- Each request has unique X-Request-ID

**Expected Behaviors:**
- Headers present in 100% of responses
- UUID format validation passes
- Version matches application version
- IDs are unique across requests

**Data Requirements:**
- UUID validator
- Multiple sequential requests to compare IDs

#### 9.3 Data Types and Formats

**What to Test:**
- IDs are integers (not strings)
- Booleans are true/false (not 0/1)
- Timestamps in ISO 8601 format
- Strings are properly escaped
- Numbers are not quoted
- Null values represented correctly

**Expected Behaviors:**
- Types consistent across all responses
- ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
- No type coercion issues

**What to Verify:**
- Parse JSON successfully
- Type checking passes
- Timestamp parsing works

#### 9.4 Field Naming Consistency

**What to Test:**
- All fields use camelCase
- Field names consistent across endpoints
- No snake_case or PascalCase mixing
- Boolean fields named appropriately (is*, has*, etc.)
- Timestamp fields end with "At"

**Expected Behaviors:**
- Consistent naming convention
- No confusion between similar fields
- API follows JavaScript/JSON conventions

---

## 10. Integration & Workflow Testing

### Test Objective
Test complete user journeys and realistic workflow scenarios.

### Preconditions
- Fresh database state
- No pre-existing sessions

### Test Scenarios

#### 10.1 New User Journey

**What to Test:**
- Complete flow: Register → Login → Create Todo → Logout
- Verify each step succeeds
- Verify data persists between steps
- Token works immediately after registration
- Created todo appears in user's todo list

**Steps to Execute:**
1. Register new user
2. Use returned token to create todo
3. Get all todos and verify created todo exists
4. Logout
5. Attempt to create todo with old token (should fail)
6. Login again
7. Verify todo still exists

**Expected Behaviors:**
- All steps complete successfully
- Data persists across login sessions
- Token invalidation works correctly

#### 10.2 Todo Management Workflow

**What to Test:**
- Login → Create Todo → Update Todo → Mark Complete → Delete Todo
- Each operation succeeds
- Changes persist
- Final state is correct

**Steps to Execute:**
1. Login
2. Create todo with initial data
3. Update title and description
4. Mark as completed
5. Verify completed status
6. Delete todo
7. Verify todo no longer exists

**Expected Behaviors:**
- Each operation returns success
- updatedAt timestamps change appropriately
- Todo state reflects each change

#### 10.3 Filtering and Search Workflow

**What to Test:**
- Login → Create Multiple Todos → Filter Completed → Search by Title → Paginate Results
- Results match expectations at each step

**Steps to Execute:**
1. Login
2. Create 15 todos (mix of completed/incomplete)
3. Filter for completed only
4. Search for specific keyword
5. Test pagination through results
6. Combine filters

**Expected Behaviors:**
- Filters work correctly
- Results are consistent
- Pagination counts are accurate

#### 10.4 Multi-User Scenarios

**What to Test:**
- Multiple users operating simultaneously
- Users cannot see each other's data
- Concurrent operations don't interfere

**Steps to Execute:**
1. Login as User A
2. Login as User B (different session)
3. Both create todos
4. Verify User A only sees their todos
5. Verify User B only sees their todos
6. User A updates their todo
7. Verify User B's todos unaffected

**Expected Behaviors:**
- Complete data isolation
- No cross-user interference
- Operations are atomic

#### 10.5 Account Deletion Workflow

**What to Test:**
- User creates todos → Deletes account → Verifies all data removed

**Steps to Execute:**
1. Login
2. Create multiple todos
3. Delete account
4. Attempt to login (should fail)
5. Verify todos no longer exist (if queryable)

**Expected Behaviors:**
- Account deletion cascades to todos
- Cannot login after deletion
- Token becomes invalid

**Data Requirements:**
- Multiple test user accounts
- Varied todo datasets

---

## 11. Performance & Load Testing

### Test Objective
Validate response times and behavior under various load conditions.

### Preconditions
- Server running without other heavy processes
- Sufficient test data for performance tests

### Test Scenarios

#### 11.1 Response Time Testing

**What to Test:**
- Average response time for each endpoint
- Response time with small datasets (< 10 todos)
- Response time with large datasets (100+ todos)
- Response time for authentication endpoints
- Response time for filtered queries
- Response time for paginated queries

**Expected Behaviors:**
- Response times under reasonable limits (< 500ms for most)
- No significant degradation with reasonable data sizes
- Consistent response times across similar requests

**Metrics to Collect:**
- Average response time per endpoint
- Min/max response times
- 95th percentile response time

#### 11.2 Concurrent Requests

**What to Test:**
- Multiple simultaneous requests with same token
- Multiple users making requests simultaneously
- Same user making rapid sequential requests
- Concurrent updates to same todo
- Rate limiting behavior (if implemented)

**Expected Behaviors:**
- Concurrent requests handled correctly
- No race conditions
- Data integrity maintained
- Responses remain accurate

**What to Verify:**
- No 500 errors under load
- Database consistency
- Token handling remains secure

#### 11.3 Large Dataset Handling

**What to Test:**
- Performance with 100+ todos per user
- Pagination with large datasets
- Search performance on large todo lists
- User with maximum realistic todo count

**Expected Behaviors:**
- Acceptable performance even with large datasets
- Pagination prevents timeout issues
- Database queries remain efficient

**Data Requirements:**
- Seed script for large datasets
- Users with varied data volumes

#### 11.4 Delayed Response Endpoint

**What to Test:**
- Accuracy of delay timing
- Different delay values (1s, 5s, 10s)
- Maximum delay cap enforcement
- Client timeout handling
- Multiple concurrent delayed requests

**Expected Behaviors:**
- Delay is approximately accurate (± 100ms)
- Delays don't block other requests
- Server remains responsive
- Maximum delay enforced

**Metrics to Collect:**
- Actual delay vs requested delay
- Server resource usage during delays

---

## 12. Negative Testing Scenarios

### Test Objective
Test how the API handles unexpected, malformed, or malicious inputs.

### Preconditions
- Understanding of expected request formats

### Test Scenarios

#### 12.1 Malformed JSON

**What to Test:**
- Request with invalid JSON syntax
- Request with trailing commas
- Request with comments in JSON
- Request with unquoted keys
- Request with single quotes instead of double
- Empty request body when body expected

**Expected Behaviors:**
- 400 Bad Request status
- Clear error about malformed JSON
- Server doesn't crash
- Error message doesn't expose internals

#### 12.2 Extra Fields

**What to Test:**
- Request with extra unexpected fields
- Request with valid and invalid fields mixed
- Verify extra fields are ignored (not saved)

**Expected Behaviors:**
- Extra fields ignored gracefully
- Valid fields processed normally
- No errors for extra fields (unless strict validation)

#### 12.3 Missing Headers

**What to Test:**
- Request without Content-Type header
- Request with wrong Content-Type
- Request without Authorization header (on protected routes)
- Request with malformed Authorization header

**Expected Behaviors:**
- Missing Content-Type handled appropriately
- 401 for missing Authorization
- Clear error messages

#### 12.4 Invalid HTTP Methods

**What to Test:**
- GET request to POST-only endpoint
- POST request to GET-only endpoint
- PATCH where only PUT supported
- DELETE where not supported
- OPTIONS requests (CORS preflight)

**Expected Behaviors:**
- 405 Method Not Allowed status
- Allow header shows permitted methods
- Error message indicates correct method

#### 12.5 Non-Existent Routes

**What to Test:**
- Request to undefined route
- Typo in endpoint URL
- Extra path segments
- Trailing slashes

**Expected Behaviors:**
- 404 Not Found status
- Consistent error format
- Helpful error message

#### 12.6 Very Large Payloads

**What to Test:**
- Request with extremely large JSON body
- Title/description with thousands of characters
- Many fields in single request
- Deeply nested JSON structures

**Expected Behaviors:**
- Server has reasonable size limits
- Large payloads rejected with 413 or validation error
- Server remains stable

**Data Requirements:**
- Prepared malformed JSON samples
- Very large string payloads
- Various invalid request formats

---

## Test Execution Guidance

### Recommended Testing Order

1. **Start with Health Check** - Verify server is running
2. **Authentication Tests** - Establish you can register/login
3. **User Management Tests** - Test profile operations
4. **Basic Todo CRUD** - Create, read, update, delete without complications
5. **Query Parameters** - Add filtering, search, pagination
6. **Authorization Tests** - Cross-user scenarios
7. **Validation Tests** - Boundary and negative cases
8. **Error Handling** - Error simulation endpoints
9. **Workflows** - Complete user journeys
10. **Performance Tests** - Response times and load
11. **Negative Tests** - Malformed requests and edge cases

### Tools and Techniques

**Recommended Tools:**
- **Postman**: GUI-based testing, collections, environment variables
- **curl**: Command-line testing, scripting
- **Newman**: Automated Postman collection runner
- **JMeter/k6**: Performance and load testing
- **REST Assured**: Java-based test automation
- **Pytest + Requests**: Python-based test automation

**Best Practices:**
- Use environment variables for base URL and tokens
- Save tokens from login responses for subsequent requests
- Create test data setup scripts
- Document actual vs expected results
- Take screenshots of interesting findings
- Log all requests and responses for debugging

### Verification Checklist

For each test:
- [ ] Verify HTTP status code
- [ ] Verify response format matches specification
- [ ] Verify response data is correct
- [ ] Verify custom headers are present
- [ ] Verify timestamps are recent and formatted correctly
- [ ] Verify error messages are helpful
- [ ] Check for data persistence across requests
- [ ] Verify no sensitive data leaked

### Common Issues to Watch For

- Token expiration during long test sessions
- Database state from previous tests affecting results
- Case sensitivity issues (email addresses)
- Whitespace in input fields
- Time zone issues in timestamps
- Race conditions in concurrent tests
- Database locks under heavy load

### Test Data Management

**When to Reset Database:**
- Before starting a new test suite
- After tests that delete data
- When test data becomes polluted
- Before performance tests (to ensure consistent data volume)

**Reset Command:** `npm run db:reset`

**Seed Only:** `npm run db:seed`

---

## Test Coverage Matrix

| Endpoint | Functional | Validation | Authorization | Error Handling | Performance | Priority |
|----------|-----------|------------|---------------|----------------|-------------|----------|
| POST /api/auth/register | ✓ | ✓ | N/A | ✓ | ✓ | P0 |
| POST /api/auth/login | ✓ | ✓ | N/A | ✓ | ✓ | P0 |
| POST /api/auth/logout | ✓ | N/A | ✓ | ✓ | ✓ | P0 |
| GET /api/users/me | ✓ | N/A | ✓ | ✓ | ✓ | P0 |
| PUT /api/users/me | ✓ | ✓ | ✓ | ✓ | ✓ | P1 |
| DELETE /api/users/me | ✓ | N/A | ✓ | ✓ | ✓ | P1 |
| POST /api/todos | ✓ | ✓ | ✓ | ✓ | ✓ | P0 |
| GET /api/todos | ✓ | ✓ | ✓ | ✓ | ✓ | P0 |
| GET /api/todos/:id | ✓ | N/A | ✓ | ✓ | ✓ | P0 |
| PUT /api/todos/:id | ✓ | ✓ | ✓ | ✓ | ✓ | P0 |
| PATCH /api/todos/:id/complete | ✓ | N/A | ✓ | ✓ | ✓ | P1 |
| DELETE /api/todos/:id | ✓ | N/A | ✓ | ✓ | ✓ | P0 |
| GET /api/errors/* | ✓ | N/A | N/A | ✓ | ✓ | P2 |
| GET /health | ✓ | N/A | N/A | N/A | ✓ | P2 |

**Priority Levels:**
- **P0**: Critical functionality - must work for API to be usable
- **P1**: Important functionality - should work for full feature set
- **P2**: Nice-to-have - supporting features for testing/debugging

### Estimated Testing Effort

| Test Category | Estimated Time | Test Count |
|--------------|----------------|------------|
| Authentication & Authorization | 3-4 hours | 40+ scenarios |
| User Management | 1-2 hours | 15+ scenarios |
| Todo CRUD Operations | 4-5 hours | 60+ scenarios |
| Query Parameters & Filtering | 2-3 hours | 30+ scenarios |
| Authorization & Security | 2-3 hours | 25+ scenarios |
| Validation Testing | 2-3 hours | 35+ scenarios |
| Error Handling | 1-2 hours | 20+ scenarios |
| Response Format | 1 hour | 15+ scenarios |
| Integration Workflows | 2-3 hours | 12+ scenarios |
| Performance Testing | 2-3 hours | 15+ scenarios |
| Negative Testing | 2-3 hours | 25+ scenarios |
| **Total** | **22-34 hours** | **290+ scenarios** |

### Test Dependencies

Some tests must be completed before others:
- Authentication tests must pass before any protected endpoint tests
- Create todo must work before update/delete tests
- User registration must work before login tests
- Basic CRUD must work before testing complex queries

---

## Appendix: Quick Reference

### Base URL
```
http://localhost:3000
```

### Test Credentials
```
Email: tester1@example.com | Password: password123
Email: tester2@example.com | Password: password123
Email: tester3@example.com | Password: password123
```

### Swagger Documentation
```
http://localhost:3000/api-docs
```

### Key Validation Rules
- Email: Valid format required
- Password: Minimum 8 characters
- Todo Title: Required, max 100 characters
- Todo Description: Optional, max 500 characters
- Name: Required, minimum 1 character

### HTTP Status Codes Reference
- 200: OK (successful GET, PUT, PATCH)
- 201: Created (successful POST)
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication failure)
- 403: Forbidden (authorization failure)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

### Custom Headers
- `X-Request-ID`: UUID for request tracing
- `X-App-Version`: 1.0.0

---

**Document End**

This test plan provides comprehensive coverage of all testing scenarios for the TODO API. Use it as a guide for manual testing or as a basis for creating automated test scripts.
