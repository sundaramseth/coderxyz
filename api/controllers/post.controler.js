
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) =>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'Please provide all required fields!'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'')
    const newPost = new Post({
        ...req.body, slug, userId:req.user.id
    }); 

    try{
        const savePost = await newPost.save();
        res.status(201).json(savePost);
    }
    catch(error){
    next(error);
    }

}


export const getposts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
            { category: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      }).sort({ createdOn: sortDirection }).skip(startIndex).limit(limit);
  
      const totalPosts = await Post.countDocuments();

      const now = new Date();

      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdOn: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };

  export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            postImage: req.body.postImage,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };


  export const likePost = async (req, res, next) => {
  
    try {
      const post = await Post.findById(req.params.postId);
      if(!post){
        return next(errorHandler(404, 'Post not found'));
      }
  
      const userIndex = post.likes.indexOf(req.user.id);
      if(userIndex === -1){
        post.numberOfLikes += 1;
        post.likes.push(req.user.id);
      }
      else{
        post.numberOfLikes -= 1;
        post.likes.splice(userIndex, 1);
      }
  
      await post.save();
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  
  };
  
  
  export const savePost = async (req, res, next) => {
    try {
        const savepost = await Post.findById(req.params.postId);
        if(!savepost){
          return next(errorHandler(404, 'Post not found'));
        }
    
        const userIndex = savepost.usersavedpost.indexOf(req.params.userId);
        if(userIndex){
            savepost.usersavedpost.push(req.params.userId);
        }
    
        await savepost.save();
        res.status(200).json(savepost);
      } catch (error) {
        next(error);
      }
    
  
  };

  export const getSavePost = async (req, res, next) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const posts = await Post.find({ usersavedpost: { $in: [userId] }})  
      
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No saved posts found for this user.' });
      }
      
      res.status(200).json(posts);

    } catch (error) {
      console.error('Error fetching saved posts:', error);
      next(error);
    }

  };
  

  export const unsavepost = async(req, res, next) =>{
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
        // Find the post by ID
     const post = await Post.findById(postId);

     if (!post) {
      return next(errorHandler(404, 'Post not found'));
     }
      // Use $pull to remove the userId from the usersavedpost array
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { usersavedpost: userId } },
        { new: true } // Return the updated document
      );

      if (!updatedPost) {
        return next(errorHandler(404, 'Post not found or could not be updated.'));
      }
  
      // Debugging: Log the updated document
      console.log("Updated Post:", updatedPost);

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  export const getauthorposts = async(req,res,next)=>{
    const userIdFetch = req.params.userId;

    if (!userIdFetch) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const posts = await Post.find({ userId: userIdFetch })  
      
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user.' });
      }
      
      res.status(200).json(posts);

    } catch (error) {
      console.error('Error fetching saved posts:', error);
      next(error);
    }

  };