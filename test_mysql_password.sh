#!/bin/bash

# Script to test MySQL root password
# This will help you find your MySQL root password

echo "Testing MySQL root connection..."
echo ""

# Common passwords to try
PASSWORDS=("" "root" "password" "123456" "admin" "mysql")

for pwd in "${PASSWORDS[@]}"; do
    if [ -z "$pwd" ]; then
        echo "Trying: (empty password)"
        mysql -u root -e "SELECT 'SUCCESS: No password needed!' as result;" 2>/dev/null && echo "✓ Found! Your MySQL root has NO password" && exit 0
    else
        echo "Trying: $pwd"
        mysql -u root -p"$pwd" -e "SELECT 'SUCCESS!' as result;" 2>/dev/null && echo "✓ Found! Your MySQL root password is: $pwd" && exit 0
    fi
done

echo ""
echo "✗ None of the common passwords worked."
echo ""
echo "You have two options:"
echo "1. Remember/check where you wrote down your MySQL password"
echo "2. Reset the password using the reset_mysql_password.sh script"
echo ""
echo "To reset, run: bash reset_mysql_password.sh"

