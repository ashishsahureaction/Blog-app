import Comment from '../models/comment.model.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
    try {
      const comments = await Comment.find({ postId: req.params.postId }).sort({
        createdAt: -1,//after find the comments,sorting the result based on the createdAt field in desending order means newest at the top.
      });
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };
  

  export const likeComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      const userIndex = comment.likes.indexOf(req.user.id); //if comment is there find the index number of that comment by id, searches for the index of the current user's ID (req.user.id) within the likes array of the comment object.
      if (userIndex === -1) {//if no userid found 
        comment.numberOfLikes += 1;//add like, increments the numberOfLikes property of the comment object by 1. This property likely tracks the total number of likes for the comment.
        comment.likes.push(req.user.id);//adds the current user's ID to the likes array of the comment, indicating that the user has liked the comment.
      } 
      else { //otherwise userid found
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  export const editComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(
          errorHandler(403, 'You are not allowed to edit this comment')
        );
      }
  
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          content: req.body.content,
        },
        { new: true }
      );
      res.status(200).json(editedComment);
    } catch (error) {
      next(error);
    }
  };

  export const deleteComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(
          errorHandler(403, 'You are not allowed to delete this comment')
        );
      }
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json('Comment has been deleted');
    } catch (error) {
      next(error);
    }
  };
  
  export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin)
      return next(errorHandler(403, 'You are not allowed to get all comments'));
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthComments = await Comment.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      next(error);
    }
  };
  


//Basic Functionality:
// export const createComment=async (req,res,next){
//     try{
//         const{content,postId,userId}=req.body;
//     }
//     catch(error){
//         next(error);
//     }};
//{content,postId,userId} is coming from comment.model.js