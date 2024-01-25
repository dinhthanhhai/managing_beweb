import userService from "../service/userService";

const handleHelloWorld = (req, res) => {
  return res.render("home.ejs");
};

const handleUserPage = async (req, res) => {
  let usersList = await userService.getUserList();
  // console.log("Check users list: ", usersList);

  return res.render("user.ejs", { usersList });
};

const handleCreateNewUser = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;

  userService.createNewUser(email, password, username);

  return res.send("Created user");
};

module.exports = {
  handleHelloWorld,
  handleUserPage,
  handleCreateNewUser,
};
