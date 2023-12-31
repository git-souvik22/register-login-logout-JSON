const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

const userDataBase = "./JSON/user.json";

app.use(bodyParser.json());

app.get("/data", (req, res) => {
  const userList = JSON.parse(fs.readFileSync(userDataBase, "utf-8"));
  res.status(200).json(userList);
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const userData = JSON.parse(fs.readFileSync(userDataBase));

  const existUser = userData.find(
    (user) => user.username === username && user.password === password
  );

  if (existUser) {
    return res.status(400).json({ message: "User Already exist" });
  }
  userData.push({ username, password, isLogin: false });
  fs.writeFileSync(userDataBase, JSON.stringify(userData));
  res.status(201).json({ message: "User successfully registered" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const userData = JSON.parse(fs.readFileSync(userDataBase));

  const existUser = userData.find(
    (user) => user.username === username && user.password === password
  );

  if (existUser) {
    if (existUser.isLogin) {
      return res.status(403).json({ message: "User already logged in" });
    }

    existUser.isLogin = true;
    fs.writeFileSync(userDataBase, JSON.stringify(userData));
    return res.status(200).json({ message: "User successfully logged in" });
  }

  res.status(401).json({ message: "Wrong credentials" });
});

app.post("/logout", (req, res) => {
  const { username } = req.body;
  const userData = JSON.parse(fs.readFileSync(userDataBase));

  const user = userData.find((user) => user.username === username);

  if (user) {
    if (user.isLogin) {
      user.isLogin = false;
      fs.writeFileSync(userDataBase, JSON.stringify(userData));
      return res.status(200).json({ message: "User Successfully logged out" });
    }
    return res.status(400).json({ message: "User not logged in" });
  }
  res.status(401).json({ message: "User not found" });
});

app.delete("/delete-account", (req, res) => {
  const { username } = req.body;

  const userData = JSON.parse(fs.readFileSync(userDataBase));

  const user = userData.filter((user) => user.username !== username);

  fs.writeFileSync(userDataBase, JSON.stringify(user));

  res.status(202).json({ message: "Account successfully deleted" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
