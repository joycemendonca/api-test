#!/bin/bash

# TODO API - Setup Verification Script
# This script verifies that all necessary files are in place

echo "🔍 Verifying TODO API Project Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SUCCESS=0
FAILED=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((FAILED++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((FAILED++))
    fi
}

echo "📂 Checking Directory Structure..."
check_dir "src"
check_dir "src/config"
check_dir "src/models"
check_dir "src/controllers"
check_dir "src/routes"
check_dir "src/middlewares"
check_dir "src/validations"
check_dir "src/utils"
check_dir "database"
check_dir "database/seeders"

echo ""
echo "📄 Checking Configuration Files..."
check_file "package.json"
check_file ".env"
check_file ".env.example"
check_file ".gitignore"

echo ""
echo "🔧 Checking Core Application Files..."
check_file "src/app.js"
check_file "src/server.js"
check_file "src/config/database.js"

echo ""
echo "📊 Checking Models..."
check_file "src/models/index.js"
check_file "src/models/User.js"
check_file "src/models/Todo.js"

echo ""
echo "🎮 Checking Controllers..."
check_file "src/controllers/authController.js"
check_file "src/controllers/userController.js"
check_file "src/controllers/todoController.js"
check_file "src/controllers/errorController.js"
check_file "src/controllers/healthController.js"

echo ""
echo "🛣️  Checking Routes..."
check_file "src/routes/auth.js"
check_file "src/routes/users.js"
check_file "src/routes/todos.js"
check_file "src/routes/errors.js"
check_file "src/routes/health.js"

echo ""
echo "🛡️  Checking Middleware..."
check_file "src/middlewares/auth.js"
check_file "src/middlewares/requestMetadata.js"
check_file "src/middlewares/errorHandler.js"

echo ""
echo "✅ Checking Validations..."
check_file "src/validations/auth.js"
check_file "src/validations/todo.js"
check_file "src/validations/user.js"

echo ""
echo "🔨 Checking Utilities..."
check_file "src/utils/tokenBlacklist.js"
check_file "src/utils/responseFormatter.js"

echo ""
echo "🗄️  Checking Database Scripts..."
check_file "database/migrate.js"
check_file "database/reset.js"
check_file "database/seeders/seed.js"

echo ""
echo "📚 Checking Documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "PROJECT_SUMMARY.md"
check_file "TESTING_EXAMPLES.md"
check_file "CHECKLIST.md"
check_file "postman_collection.json"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 Verification Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Success: $SUCCESS${NC}"
echo -e "${RED}✗ Failed:  $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All files verified successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install"
    echo "2. Run: npm run db:seed"
    echo "3. Run: npm run dev"
    echo "4. Test: curl http://localhost:3000/health"
    exit 0
else
    echo -e "${RED}⚠️  Some files are missing. Please check the output above.${NC}"
    exit 1
fi
