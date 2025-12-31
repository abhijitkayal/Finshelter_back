#!/bin/bash

# This script will help identify all functions that need JWT token removal
grep -n "const token = localStorage.getItem(\"adminToken\")" /Users/shivamkumarrai/Documents/Abhis\ Finshelter/Finshelter_Frontend/src/Admin/AdminDashboardContext.jsx