const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
// High-level: Using environment variables for configuration
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname)));

// --------------------
// In-memory database
// --------------------
let users = [];

let groups = [
  { id: 1, name: "Data Structures Study", course: "CS201", desc: "Weekly review of Trees and Graphs.", members: 4, limit: 6 },
  { id: 2, name: "Econ Paper Prep", course: "ECON10", desc: "Analyzing global trade trends.", members: 2, limit: 5 },
  { id: 3, name: "MCAT Flashcards", course: "MED400", desc: "Intense daily quiz sessions.", members: 9, limit: 10 },
  { id: 4, name: "Modern Lit Discussion", course: "ENG302", desc: "Post-modern novel analysis.", members: 3, limit: 4 }
];

// --------------------
// AUTH
// --------------------
app.post('/login', (req, res) => {
  const { name, uni } = req.body;

  if (!name || !uni) {
    return res.status(400).json({ error: "Authentication failed: Missing name or university credentials" });
  }

  const user = {
    id: Date.now(),
    name,
    uni,
    courses: [],
    joinedGroups: [],
    requests: []
  };

  users.push(user);
  res.status(201).json(user);
});

// --------------------
// COURSE MANAGEMENT
// --------------------
app.post('/course', (req, res) => {
  const { userId, course } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User identity not verified" });

  if (!user.courses.includes(course)) {
    user.courses.push(course);
  }

  res.json(user.courses);
});

app.post('/course/remove', (req, res) => {
  const { userId, course } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: "User identity not verified" });

  user.courses = user.courses.filter(c => c !== course);
  res.json(user.courses);
});

// --------------------
// GROUPS
// --------------------
app.get('/groups', (req, res) => {
  res.json(groups);
});

// Create group
app.post('/groups', (req, res) => {
  const { name, course, desc, userId } = req.body;

  // High-level: Data Integrity Check
  if (!name || !course || !desc || !userId) {
    return res.status(400).json({ error: "Payload Validation Error: Required fields are missing" });
  }

  const newGroup = {
    id: Date.now(),
    name,
    course,
    desc,
    members: 1,
    limit: 10
  };

  groups.unshift(newGroup);

  const user = users.find(u => u.id === userId);
  if (user && !user.joinedGroups.includes(newGroup.id)) {
    user.joinedGroups.push(newGroup.id);
  }

  res.status(201).json(newGroup);
});


// JOIN GROUP

app.post('/groups/join', (req, res) => {
  const { userId, groupId } = req.body;

  // High-level: Input Sanitization
  const targetGroupId = Number(groupId);
  const user = users.find(u => u.id === userId);
  const group = groups.find(g => g.id === targetGroupId || g.id === groupId);

  if (!user || !group) {
    return res.status(404).json({ error: "Transaction Failed: Target user or group resource not found" });
  }

  if (user.joinedGroups.includes(groupId)) {
    return res.json(user);
  }

  // Business Logic: Capacity Validation
  if (group.members >= group.limit) {
    return res.status(400).json({ error: "Concurrency Limit: This study group has reached maximum capacity" });
  }

  user.joinedGroups.push(groupId);
  user.requests = user.requests.filter(r => r !== groupId);
  group.members += 1;

  res.json(user);
});

// --------------------
// GLOBAL ERROR HANDLING MIDDLEWARE
// --------------------
// High-level: Centralized exception handling to prevent server crashes
app.use((err, req, res, next) => {
  console.error(`[Internal Server Error]: ${err.message}`);
  res.status(500).json({ 
    error: "System Exception", 
    message: "An unexpected error occurred within the application layer." 
  });
});

app.listen(PORT, () => {
  console.log(`[Server Initialized] Listening on http://localhost:${PORT}`);
});