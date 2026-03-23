const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const cardList = [
  {
    title: "Web Development",
    image: "images/WD.jpeg",
    linkText: "Learn web development",
    description:
      "Explore HTML, CSS, JavaScript, responsive design, and modern frontend development concepts."
  },
  {
    title: "Cyber Security",
    image: "images/CS.jpeg",
    linkText: "Learn cyber security",
    description:
      "Understand online safety, network protection, ethical hacking basics, and data security principles."
  },
  {
    title: "Artificial Intelligence",
    image: "images/AI.jpeg",
    linkText: "Learn artificial intelligence",
    description:
      "Discover machine learning, neural networks, automation, and real-world AI applications."
  }
];

app.get("/api/cards", (req, res) => {
  res.json({
    statusCode: 200,
    data: cardList,
    message: "Cards fetched successfully"
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});