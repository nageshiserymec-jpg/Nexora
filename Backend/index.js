const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const User = require("./Models/users");
const collage = require("./Models/collages.js");
const agri = require("./Models/agri.js");
const phr = require("./Models/phr.js");
const vet = require("./Models/vet.js");

// Gemini API endpoint for career guidance
app.post("/predict", async (req, res) => {
    const { tags } = req.body;

    if (!tags || tags.length === 0) {
        return res
            .status(400)
            .json({ error: "Please provide at least one interest" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a career counselor for students who have just completed 10th grade in India. Based on the following interests and subjects: ${tags.join(
            ", "
        )}.

Please provide a comprehensive career guidance report with the following sections:

1. **Recommended Stream** (Science/Commerce/Arts/Vocational)
2. **Top 3 Career Paths** - Most suitable careers with brief descriptions
3. **Subject Combinations** - Recommended subjects for 11th-12th
4. **Skills to Develop** - Key skills they should focus on
5. **Entrance Exams** - Relevant competitive exams to prepare for
6. **Higher Education Options** - Diploma/Degree programs after 12th
7. **Short-term Courses** - Online courses or certifications they can start now
8. **Career Roadmap** - 5-year plan (11th → 12th → Higher Ed → Career)
9. **Industry Trends** - Future scope and demand for these careers
10. **Action Steps** - Immediate next steps they should take

Format the response in a clear, structured manner with proper headings and bullet points. Be specific to the Indian education system.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const guidance = response.text();

        res.status(200).json({
            success: true,
            prediction: tags.length > 0 ? tags[0] : "General",
            guidance: guidance,
            interests: tags,
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({
            error: "Failed to generate career guidance",
            message: error.message,
        });
    }
});

// Gemini API endpoint for 12th grade career guidance
app.post("/predict-12th", async (req, res) => {
    const { tags, stream, education, percentage } = req.body;

    if (!tags || tags.length === 0) {
        return res
            .status(400)
            .json({ error: "Please provide at least one interest" });
    }

    if (!stream || !education) {
        return res
            .status(400)
            .json({ error: "Please provide stream and education path" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a career counselor for students who have just completed 12th grade in India.

Student Profile:
- Stream: ${stream}
- Education Path: ${education}
- 12th Percentage: ${percentage}
- Interests: ${tags.join(", ")}

Please provide a comprehensive career guidance report with the following sections:

1. **Best Career Options** - Top 5 career paths aligned with their profile
2. **Recommended Degree Programs** - B.Tech, MBBS, BBA, BA, etc. with specializations
3. **Top Colleges/Universities** - Best institutions in India for their chosen field
4. **Entrance Exams** - Required exams (JEE, NEET, CUET, CAT, CLAT, etc.) with preparation tips
5. **Eligibility Criteria** - Minimum percentage, age limits, prerequisites
6. **Skills to Develop** - Technical and soft skills for success
7. **Certification Courses** - Short-term courses to boost employability
8. **Internship Opportunities** - Where to gain practical experience
9. **Higher Education Abroad** - Study abroad options if applicable
10. **Career Roadmap** - Year-by-year plan (Degree → Skills → Internship → Job/Masters)
11. **Salary Expectations** - Expected starting salaries and growth potential
12. **Industry Trends** - Future demand and emerging opportunities
13. **Scholarships & Financial Aid** - Available scholarships and funding options
14. **Action Steps** - Immediate next steps (application deadlines, exam dates, etc.)

Be very specific to the Indian education system and the student's ${stream} background with ${education} path.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const guidance = response.text();

        res.status(200).json({
            success: true,
            guidance: guidance,
            stream: stream,
            education: education,
            interests: tags,
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({
            error: "Failed to generate career guidance",
            message: error.message,
        });
    }
});

// Quick prediction endpoint (simpler response)
app.post("/quick-predict", async (req, res) => {
    const { tags } = req.body;

    if (!tags || tags.length === 0) {
        return res
            .status(400)
            .json({ error: "Please provide at least one interest" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Based on these interests: ${tags.join(
            ", "
        )}, suggest the top 3 most suitable career paths for a 10th grade student in India. Keep it brief - just career names and one line description each.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const prediction = response.text();

        res.status(200).json({
            success: true,
            prediction: prediction,
            interests: tags,
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({
            error: "Failed to generate prediction",
            message: error.message,
        });
    }
});

// Summarize guidance endpoint
app.post("/summarize", async (req, res) => {
    const { guidance } = req.body;

    if (!guidance) {
        return res.status(400).json({ error: "No guidance text provided" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Summarize the following career guidance report into a concise, easy-to-read summary. Focus on the key points:
- Recommended stream
- Top 3 career paths (just names)
- Essential subjects to take
- Top 3 entrance exams
- Top 3 immediate action steps

Keep it brief and use bullet points. Maximum 200 words.

Career Guidance Report:
${guidance}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.status(200).json({
            success: true,
            summary: summary,
        });
    } catch (error) {
        console.error("Gemini API error:", error);
        res.status(500).json({
            error: "Failed to generate summary",
            message: error.message,
        });
    }
});

app.post("/signup", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Signup successful",
            token,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/clg/:rank/:branch", async (req, res) => {
    const rank = parseInt(req.params.rank, 10);
    const branch = req.params.branch;

    if (isNaN(rank) || !branch) {
        return res.status(400).json({ message: "Invalid rank or branch" });
    }

    try {
        const colleges = await collage.find({
            branch: branch,
        });

        res.status(200).json({ colleges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges", error });
    }
});

app.get("/agri/:rank", async (req, res) => {
    const rank = parseInt(req.params.rank, 10);

    if (isNaN(rank)) {
        return res.status(400).json({ message: "Invalid rank" });
    }

    try {
        const colleges = await agri.find({});

        res.status(200).json({ colleges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges", error });
    }
});

app.get("/vet/:rank", async (req, res) => {
    const rank = parseInt(req.params.rank, 10);

    if (isNaN(rank)) {
        return res.status(400).json({ message: "Invalid rank" });
    }

    try {
        const colleges = await vet.find({});

        res.status(200).json({ colleges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges", error });
    }
});

app.get("/phr/:rank", async (req, res) => {
    const rank = parseInt(req.params.rank, 10);

    if (isNaN(rank)) {
        return res.status(400).json({ message: "Invalid rank" });
    }

    try {
        const colleges = await phr.find({});

        res.status(200).json({ colleges });
    } catch (error) {
        res.status(500).json({ message: "Error fetching colleges", error });
    }
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on ${PORT} port at localhost`);
        });
    })
    .catch(() => {
        console.log("Database connection failed");
    });
