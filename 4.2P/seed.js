const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/techTopicsDB");

const TopicSchema = new mongoose.Schema({
  topicName: String,
  image: String,
  resourceText: String,
  details: String,
  difficulty: String
});

const Topic = mongoose.model("Topic", TopicSchema);

const sampleTopics = [
  {
    topicName: "Web Development",
    image: "images/WD.jpeg",
    resourceText: "Learn frontend basics",
    details: "HTML, CSS, JavaScript and responsive design",
    difficulty: "Beginner"
  },
  {
    topicName: "Cyber Security",
    image: "images/CS.jpeg",
    resourceText: "Security fundamentals",
    details: "Learn about threats, encryption and protection",
    difficulty: "Intermediate"
  },
  {
    topicName: "Artificial Intelligence",
    image: "images/AI.jpeg",
    resourceText: "AI concepts",
    details: "Machine learning and smart systems",
    difficulty: "Advanced"
  }
];

async function seedData() {
  await Topic.deleteMany({});
  await Topic.insertMany(sampleTopics);
  console.log("✅ Data inserted!");
  mongoose.connection.close();
}

seedData();