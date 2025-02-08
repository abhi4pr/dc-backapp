const express = require('express');
const router = express.Router();
const users = require('./controllers/users.js');
const feedback = require('./controllers/feedback.js');
const posts = require('./controllers/posts.js');
const questions = require('./controllers/questions.js');
const quotes = require('./controllers/quotes.js');
const tasks = require('./controllers/tasks.js');
const videos = require('./controllers/videos.js');
const token = require('./token.js');
const { upload, fileUpload } = require('./fileUpload');

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my application." });
});

router.post("/add_user", upload.single('user_image'), users.addUser);
router.get("/get_single_user", users.getSingleUser);
router.get("/get_all_users", users.getAllUsers);
router.put("/update_user", upload.single('user_image'), users.updateUser);
router.post("/login_user", users.loginUser);
router.delete("/delete_user", users.deleteUser);

router.post("/add_feedback", upload.single('feedback_image'), fileUpload, feedback.addFeedback);
router.get("/get_single_feedback", feedback.getSingleFeedback);
router.get("/get_all_feedbacks", feedback.getAllFeedbacks);
router.delete("/delete_feedback", feedback.deleteFeedback);

router.post("/add_post", upload.single('post_image'), fileUpload, posts.addPost);
router.get("/get_single_post", posts.getSinglePost);
router.get("/get_all_posts", posts.getAllPosts);
router.put("/update_post", upload.single('post_image'), posts.updatePost);
router.delete("/delete_post", posts.deletePost);

router.post("/add_question", questions.addQuestion);
router.get("/get_single_question/:questionId", questions.getSingleQuestion);
router.get("/get_all_questions", questions.getAllQuestions);
router.put("/update_question/:questionId", questions.updateQuestion);
router.delete("/delete_question/:questionId", questions.deleteQuestion);

router.post("/add_quote", upload.single('quote_img'), fileUpload, quotes.addQuote);
router.get("/get_single_quote/:quoteId", quotes.getSingleQuote);
router.get("/get_all_quotes", quotes.getAllQuotes);
router.put("/update_quote/:quoteId", upload.single('quote_img'), fileUpload, quotes.updateQuote);
router.delete("/delete_quote/:quoteId", quotes.deleteQuote);

router.post("/add_task", tasks.addTask);
router.get("/get_single_task/:taskId", tasks.getSingleTask);
router.get("/get_all_tasks", tasks.getAllTasks);
router.put("/update_task/:taskId", tasks.updateTask);
router.delete("/delete_task/:taskId", tasks.deleteTask);

router.post("/add_video", upload.single('video_src'), fileUpload, videos.addVideo);
router.get("/get_single_video", videos.getSingleVideo);
router.get("/get_all_videos", videos.getAllVideos);
router.put("/update_video", upload.single('video_src'), videos.updateVideo);
router.delete("/delete_video", videos.deleteVideo);

module.exports = router;