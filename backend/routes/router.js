const express = require('express')
const router = express.Router()
const validateToken = require('../middlewares/validatetoken')
const {
   register,
   login,
   logout,
   
} = require("../controllers/authControllers")

const{
   createquizz,
   getquizzlist,
   deletequizz,
   getquizz,
   submit
}=require('../controllers/Operations')
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(validateToken, logout);


router.route('/createquizz').post(validateToken,createquizz);
router.route('/quizzes').get(validateToken,getquizzlist);
router.route('/quizzes/:id').delete(validateToken,deletequizz);
router.route('/quiz/:id').get(validateToken,getquizz);
router.route('/quizzes/:id/submit').post(validateToken,submit);

module.exports = router