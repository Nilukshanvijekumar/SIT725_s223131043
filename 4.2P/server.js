const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/techTopicsDB");

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err);
});

// ✅ Create Schema (YOUR OWN DATA)
const TopicSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    minlength: 3
  },
  image: {
    type: String,
    required: true
  },
  resourceText: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true,
    maxlength: 300
  },
  difficulty: {
    type: String,
    required: true
  }
});

const Topic = mongoose.model("Topic", TopicSchema);

// ✅ API Route (NOW FROM DATABASE)
app.get("/api/cards", async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.json({
      statusCode: 200,
      data: topics,
      message: "Success"
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Error fetching data"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});