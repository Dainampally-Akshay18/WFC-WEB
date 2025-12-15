#!/bin/bash

echo ""
echo "================================================"
echo "  WFC Backend Database Initialization"
echo "================================================"
echo ""

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  Virtual environment not activated"
    echo "Activating virtual environment..."
    source venv/bin/activate
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file first (copy from .env.example)"
    exit 1
fi

echo "Step 1: Creating database tables..."
python scripts/create_tables.py
if [ $? -ne 0 ]; then
    echo "❌ Failed to create tables"
    exit 1
fi

echo ""
echo "Step 2: Seeding branches..."
python scripts/seed_branches.py
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed branches"
    exit 1
fi

echo ""
echo "Step 3: Creating admin account..."
python scripts/seed_admin.py
if [ $? -ne 0 ]; then
    echo "❌ Failed to create admin"
    exit 1
fi

echo ""
read -p "Do you want to create test data? (y/n): " create_test
if [ "$create_test" = "y" ] || [ "$create_test" = "Y" ]; then
    echo ""
    echo "Creating test data..."
    python scripts/populate_test_data.py
fi

echo ""
echo "================================================"
echo "  ✅ Database Initialization Complete!"
echo "================================================"
echo ""
echo "Next step: Run the server"
echo "  uvicorn app.main:app --reload"
echo ""
