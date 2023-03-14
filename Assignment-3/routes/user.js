const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const salt = 10;
const SECRET_CODE = "tajhsjbcwuaptnasnd321";
const { user } = require("../schemas/user-schema");
///findOne userExist
router.post("/signup", async (req, res) => {
  //encrypt the password
  bcrypt.genSalt(salt, (saltError, saltValue) => {
    if (saltError) {
      res.status(401).send("Unable to process", saltError);
    } else {
      bcrypt.hash(req.body.password, saltValue, (hashError, hashValue) => {
        if (hashError) {
          res.status(401).send("Unable to process", hashError);
        } else {
          user
            .create({
              username: req.body.username,
              password: hashValue,
              email: req.body.email | "",
              mobile: req.body.mobile | "",
            })
            .then((user) => {
              res
                .status(200)
                .send(user.username + " " + "created successfully");
            })
            .catch((err) => {
              res.status(400).send(err.message);
            });
        }
      });
    }
  });
});

router.post("/signin", async (req, res) => {
  user
    .findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(401).send("User not exist!");
      } else {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.status(401).send("Invalid Password");
        } else {
          const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_CODE
          );
          res
            .status(200)
            .send({ message: "User loggedin successsfully", token: token });
        }
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
module.exports = router;
