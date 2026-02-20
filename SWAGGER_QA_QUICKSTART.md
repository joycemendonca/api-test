# Quick Start: Swagger & QA Documentation

## 🚀 Getting Started with New Documentation

### Step 1: Install New Dependencies

The Swagger UI requires two new packages:

```bash
npm install
```

This will install:
- `swagger-ui-express` - Swagger UI middleware
- `yamljs` - YAML parser for OpenAPI spec

### Step 2: Start the Server

```bash
npm run dev
```

### Step 3: Access Swagger UI

Open your browser and navigate to:

```
http://localhost:3000/api-docs
```

You'll see an interactive API documentation interface!

---

## 📖 Using Swagger UI

### Authenticate to Test Protected Endpoints

1. **Get a JWT Token:**
   - Scroll to "Authentication" section
   - Find `POST /api/auth/login`
   - Click "Try it out"
   - Use test credentials:
     ```json
     {
       "email": "tester1@example.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - Copy the token from the response

2. **Add Token to Swagger UI:**
   - Click the green "Authorize" button at the top
   - In the "Value" field, enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"
   - Click "Close"

3. **Test Protected Endpoints:**
   - Now you can try any protected endpoint
   - The token will be automatically included
   - Example: Try `GET /api/users/me` or `POST /api/todos`

### Testing Endpoints

1. Find the endpoint you want to test
2. Click "Try it out"
3. Fill in required parameters or request body
4. Click "Execute"
5. View the response below (status code, headers, body)

### Features You Can Use

- **Schema Viewer:** Click on any schema to see its structure
- **Example Values:** Pre-filled examples for easy testing
- **Response Codes:** See all possible responses for each endpoint
- **Export:** Download the OpenAPI spec in JSON or YAML format

---

## 📋 Using the QA Test Plan

### Open the Test Plan

The comprehensive test plan is in:

```
QA_TEST_PLAN.md
```

Open it in any markdown viewer or directly in your IDE.

### Structure

The document contains:

1. **Test Plan Overview** (Section 1)
   - Purpose, scope, environment details
   - Test data requirements
   - Prerequisites

2. **12 Test Categories** (Sections 2-12)
   - Authentication & Authorization
   - User Management
   - Todo CRUD Operations
   - Query Parameters & Filtering
   - Authorization & Security
   - Validation Testing
   - Error Handling & Response
   - Response Format
   - Integration & Workflow
   - Performance & Load
   - Negative Testing
   - Plus Test Execution Guidance

3. **Appendices**
   - Test Coverage Matrix
   - Quick Reference
   - Estimated Testing Effort

### How to Use It

**For Manual Testing:**
1. Read Section 1 (overview)
2. Start with Section 2 (Authentication)
3. Follow test scenarios one by one
4. Use Swagger UI or Postman to execute tests
5. Document your findings
6. Move to next section

**For Creating Test Cases:**
1. Use test scenarios as basis for test cases
2. Each scenario can become a test case in Jira/TestRail
3. Add test steps based on "What to Test"
4. Use "Expected Behaviors" for expected results
5. Reference "Data Requirements" for test data setup

**For Test Automation:**
1. Read through test scenarios
2. Identify scenarios suitable for automation
3. Use Swagger spec for request/response validation
4. Implement tests based on scenarios
5. Use priority levels (P0, P1, P2) to prioritize automation

### Testing Tips

- **Start Simple:** Begin with basic authentication tests
- **Use Reset:** Run `npm run db:reset` to restore test data
- **Save Tokens:** Keep JWT tokens handy for protected endpoints
- **Check Headers:** Verify X-Request-ID and X-App-Version in responses
- **Follow Order:** Follow the recommended testing order in the document

---

## 🎯 Common Workflows

### Workflow 1: Quick API Exploration

1. Open Swagger UI: `http://localhost:3000/api-docs`
2. Browse available endpoints
3. Read descriptions and examples
4. Try health check endpoint (no auth needed)
5. Try error simulation endpoints

### Workflow 2: Full Authentication Testing

1. Open QA_TEST_PLAN.md
2. Go to Section 2 (Authentication Testing)
3. Test registration with Swagger UI
4. Test login and save token
5. Test logout
6. Verify token is invalidated

### Workflow 3: Todo CRUD Testing

1. Login via Swagger UI (save token)
2. Click "Authorize" and add token
3. Create a todo (`POST /api/todos`)
4. Get all todos (`GET /api/todos`)
5. Update the todo (`PUT /api/todos/:id`)
6. Delete the todo (`DELETE /api/todos/:id`)

### Workflow 4: Comprehensive Manual Testing

1. Read QA_TEST_PLAN.md completely
2. Set up test data (`npm run db:reset`)
3. Follow test scenarios section by section
4. Use Swagger UI for execution
5. Document results (pass/fail/issues)
6. Report findings

---

## 📚 Documentation Files Reference

| File | Purpose | Size |
|------|---------|------|
| `swagger.yaml` | OpenAPI specification | 27KB |
| `QA_TEST_PLAN.md` | Comprehensive test plan | 37KB |
| `SWAGGER_QA_IMPLEMENTATION.md` | Implementation summary | 10KB |
| `README.md` | Main documentation (updated) | 14KB+ |

**Total Documentation:** ~88KB of comprehensive API and testing documentation!

---

## 🔧 Troubleshooting

### Swagger UI Not Loading

**Problem:** Cannot access http://localhost:3000/api-docs

**Solution:**
1. Check server is running: `npm run dev`
2. Check console for errors
3. Verify dependencies installed: `npm install`
4. Check swagger.yaml exists in root folder

### Token Authentication Issues

**Problem:** Getting 401 errors in Swagger UI

**Solution:**
1. Click "Authorize" button
2. Format must be: `Bearer YOUR_TOKEN` (note the space)
3. Token must be from recent login (24h expiration)
4. Don't include quotes around the token

### Cannot Execute Tests

**Problem:** "Try it out" button not working

**Solution:**
1. Check CORS is enabled (already configured)
2. Verify server is running
3. Check browser console for errors
4. Try refreshing the page

---

## 💡 Pro Tips

1. **Bookmark Swagger UI:** Add `http://localhost:3000/api-docs` to bookmarks
2. **Use Collections:** Export Swagger as Postman collection for automated testing
3. **Copy Examples:** Use Swagger examples as basis for test data
4. **Check Schemas:** Review schemas section to understand data models
5. **Read Descriptions:** Endpoint descriptions explain validation rules
6. **Test Systematically:** Follow the test plan order for thorough coverage
7. **Reset Often:** Use `npm run db:reset` between test runs for consistency

---

## 📞 Getting Help

- **API Documentation:** http://localhost:3000/api-docs
- **Test Plan:** QA_TEST_PLAN.md (sections 1-12)
- **Quick Reference:** QA_TEST_PLAN.md (Appendix)
- **Implementation Details:** SWAGGER_QA_IMPLEMENTATION.md
- **Main README:** README.md

---

## ✅ Quick Checklist

Before starting testing:
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm run dev`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Swagger UI accessible (http://localhost:3000/api-docs)
- [ ] Test credentials known (tester1@example.com / password123)
- [ ] QA_TEST_PLAN.md opened and reviewed

Ready to test!

---

**Happy Testing! 🚀**
