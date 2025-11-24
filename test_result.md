#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  VIBE for Wellness Landing Page - Sync with codebase, install Redis and dependencies, 
  restart app, ensure all content matches the provided Word document with exact CTAs and positions,
  make production ready for deployment.

backend:
  - task: "Redis Installation and Configuration"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Redis server installed and running on port 6379. Backend configured with Redis client for session management."

  - task: "Database Content - Products"
    implemented: true
    working: true
    file: "/app/init_database.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Product updated with exact pricing: $399 → $299 (Save $100). Features list matches document requirements."

  - task: "Database Content - Testimonials"
    implemented: true
    working: true
    file: "/app/init_database.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "4 testimonials added matching exact text from document: Ankita (India), FCG, Real User, Verified User."

  - task: "Database Content - FAQs"
    implemented: true
    working: true
    file: "/app/init_database.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "6 FAQs added matching document: PEMF safety, usage frequency, eligibility, EMF comparison, purchase location, money-back guarantee."

  - task: "Database Content - SEO Settings"
    implemented: true
    working: true
    file: "MongoDB direct update"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "SEO metadata updated with exact meta title, description, and keywords from document."

frontend:
  - task: "Hero Section CTA Update"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Updated hero CTA to 'Get Your VIBE Device - $100 Off' linking to external shop: https://resona.health/shop/?ap_id=smitashares"

  - task: "External Shop Link Integration"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "All CTAs now point to external shop and research links instead of internal checkout. handleGetStarted() and handleResearch() functions created."

  - task: "Research Links Addition"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added 'See How Cellular Optimization Works', 'Explore All 60 Protocols', 'See the Research' links to https://resona.health/research/?ap_id=smitashares"

  - task: "Stop Settling Section Addition"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added new section 'Stop Settling. Start Healing.' before community section with 4 key benefits and CTA."

  - task: "Header Shop Button"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added prominent 'Shop Now' button in header navigation for easy access to external shop."

  - task: "Footer Links Update"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "Added 'Shop Now' link in footer Resources section. All external links verified with ?ap_id=smitashares."

  - task: "Community Links Verification"
    implemented: true
    working: true
    file: "/app/frontend/src/pages/LandingPage.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: true
        agent: "main"
        comment: "WhatsApp and Facebook community links verified and match document requirements."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Hero Section CTA Update"
    - "External Shop Link Integration"
    - "Research Links Addition"
    - "Stop Settling Section Addition"
    - "All CTAs and Links Verification"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Initial implementation completed:
      ✅ Redis installed and running
      ✅ All dependencies installed (backend + frontend)
      ✅ All services running properly
      ✅ Database content updated with exact testimonials (4), FAQs (6), product pricing ($399→$299)
      ✅ Landing page CTAs updated to use external shop links (https://resona.health/shop/?ap_id=smitashares)
      ✅ Research links added throughout page (https://resona.health/research/?ap_id=smitashares)
      ✅ New "Stop Settling. Start Healing" section added
      ✅ Header shop button added
      ✅ Footer links updated with Shop Now
      ✅ All affiliate links include ?ap_id=smitashares
      
      Ready for frontend testing to verify:
      - All CTAs open correct external links
      - Content matches document exactly
      - All sections render properly
      - Responsive design works
      - Links include affiliate ID