#!/bin/bash

# Semgrep Security Scan Script
# Usage: ./scripts/semgrep-scan.sh [security|full|custom]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if semgrep is installed
check_semgrep() {
    if ! command -v semgrep &> /dev/null; then
        print_error "Semgrep is not installed. Installing..."
        pip install semgrep
        if [ $? -ne 0 ]; then
            print_error "Failed to install Semgrep. Please install manually: pip install semgrep"
            exit 1
        fi
        print_success "Semgrep installed successfully"
    else
        print_status "Semgrep is already installed"
    fi
}

# Run security audit scan
run_security_scan() {
    print_status "Running security audit scan..."
    semgrep --config=p/security-audit src/ --json --output=semgrep-security-$(date +%Y%m%d-%H%M%S).json
    
    if [ $? -eq 0 ]; then
        print_success "Security scan completed successfully"
        print_status "Results saved to semgrep-security-*.json"
    else
        print_error "Security scan failed"
        exit 1
    fi
}

# Run full code quality scan
run_full_scan() {
    print_status "Running full code quality scan..."
    semgrep --config=auto src/ --json --output=semgrep-full-$(date +%Y%m%d-%H%M%S).json
    
    if [ $? -eq 0 ]; then
        print_success "Full scan completed successfully"
        print_status "Results saved to semgrep-full-*.json"
    else
        print_error "Full scan failed"
        exit 1
    fi
}

# Run custom scan with specific rules
run_custom_scan() {
    local config=$1
    print_status "Running custom scan with config: $config"
    semgrep --config=$config src/ --json --output=semgrep-custom-$(date +%Y%m%d-%H%M%S).json
    
    if [ $? -eq 0 ]; then
        print_success "Custom scan completed successfully"
        print_status "Results saved to semgrep-custom-*.json"
    else
        print_error "Custom scan failed"
        exit 1
    fi
}

# Parse command line arguments
case "${1:-security}" in
    "security")
        check_semgrep
        run_security_scan
        ;;
    "full")
        check_semgrep
        run_full_scan
        ;;
    "custom")
        if [ -z "$2" ]; then
            print_error "Custom scan requires a config parameter"
            print_status "Usage: $0 custom <config>"
            print_status "Example: $0 custom p/owasp-top-ten"
            exit 1
        fi
        check_semgrep
        run_custom_scan "$2"
        ;;
    "help"|"-h"|"--help")
        echo "Semgrep Security Scan Script"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  security    Run security audit scan (default)"
        echo "  full        Run full code quality scan"
        echo "  custom      Run custom scan with specific config"
        echo "  help        Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Run security scan"
        echo "  $0 security           # Run security scan"
        echo "  $0 full               # Run full scan"
        echo "  $0 custom p/owasp-top-ten  # Run OWASP Top 10 scan"
        echo ""
        echo "Available configs:"
        echo "  p/security-audit      # Security vulnerabilities"
        echo "  p/owasp-top-ten       # OWASP Top 10 vulnerabilities"
        echo "  p/javascript          # JavaScript/TypeScript rules"
        echo "  p/react               # React-specific rules"
        echo "  auto                  # All available rules"
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for usage information"
        exit 1
        ;;
esac

print_success "Scan completed successfully!"
print_status "Review the JSON output files for detailed results"
print_status "For more information, visit: https://semgrep.dev/docs/"
