#Simple Study Group Finder Web Application

StudySync Pro is a full-stack web application designed to help university students discover, create, and join study groups tailored to their specific courses.

##Key Engineering Features

- Decoupled Architecture: Single Page Application (SPA) communicating with a Node.js/Express REST API via asynchronous Fetch requests.

- Data Integrity: Implemented server-side input sanitization and explicit ID type-casting in the backend to ensure precise data matching.

- Concurrency Control: Validation logic within the join-group transaction to prevent joining groups that have reached maximum capacity.

- Fault Tolerance: Centralized global error-handling middleware implemented to catch system exceptions and ensure application stability.

##Tech Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+) with responsive dashboard architecture.

- Backend: Node.js, Express.js framework for robust API routing.

- Environment: Dynamic port allocation using environment variables for cloud-readiness.

##Installation & Setup

- Clone the repository to your local machine.

- Ensure you have Node.js installed.

- Open your terminal in the project root folder and run:

	npm install


#How to Run

To initialize the server, run the following command in the terminal:

	npm start


The application will be accessible at: http://localhost:3000

## Project Structure

- server.js: Primary backend logic, REST API endpoints, and global error middleware.

- index.html: Single-entry point for the frontend UI, including state management and rendering logic.

- package.json: Manifest file defining project dependencies and operational scripts.

- .gitignore: Configuration to ensure a clean repository by excluding node_modules and system files.

- explanation.docx: Comprehensive project analysis and architecture overview.
