const Post = require('../models/post.model');
const { uploadFile } = require('../helpers/imageKit');
const User = require('../models/user.model')


exports.createPost = async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const { file } = req.files;
        const image = await uploadFile(file);
        const post = await Post.create({
            title,
            description,
            image,
            tags
        });
        post.user = req.user._id;
        post.save();
        res.json({ Message: 'New Post Added'});
        return;

    } catch (error) {
        return res.json(error);
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        let result = [];

        for(const post of posts)  {
            let obj = {};
            obj.title = post.title;
            obj.description = post.description;
            obj.image = post.image;
            obj.tags = post.tags;

            const user = await User.findOne({ _id: post.user }, { username: 1});
            obj.username = user.username;
            result.push(obj);
        }
        res.json(result);
        return;

    } catch(error) {
        return res.json(error);
    }
};

exports.getPostByTitle = async (req, res) => {
    try {
        const { title } = req.body;
        if(!title) return res.json({Warning: 'Requires Title'});
        const post = await Post.findOne({ title: { $regex: title, $options: 'i' }});
        const user = await User.findOne({ _id: post.user })
        let updatedPost = {
            title: post.title,
            description: post.description,
            tags: post.tags,
            image: post.image,
            username: user.username,
            created: post.createdAt,
        }
       
        res.json(updatedPost);
        return;

    } catch (error) {
        return res.json(error);
    }
};

exports.searchPosts = async (req, res) => {
    try {
        const { title, tags, user, minDate, maxDate } = req.body;
        let query = {};

        if(title) {
            query.title = {$regex: new RegExp(title, 'i')};
        }
        if(tags && tags.length > 0) {
            const regs = tags.map((item) =>new RegExp(item, 'i'));
            query.tags = { $in: regs };
        }

        if(user) {
            const result = await User.findOne({ username: user });
            query.user =  result._id 
        }

        if(minDate && maxDate) {
            query.createdAt = { $gte: new Date(minDate), $lt: new Date(maxDate)};
        }

        const posts = await Post.find(query);
        let result = []

        for(const post of posts) {
            let obj = {};
            obj.title = post.title;
            obj.description = post.description;
            obj.image = post.image;
            obj.tags = post.tags;
            obj._id = post._id;

            const user = await User.findOne({ _id: post.user }, { username: 1});
            obj.username = user.username;
            result.push(obj);

        }
        res.json(result);
        return;

    } catch (error) {
        return res.json(error);
    }
};

exports.updatePostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOneAndUpdate({ _id: postId }, req.body);
        if(!post) return res.json({ warning: 'no post found'});
        res.json({Message: 'post updated'});
        return;

    } catch(error) {
        return res.json(error)
    }
};

exports.deletePostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post  =  await Post.findOneAndDelete({ _id: postId });
        if(!post) return res.json({ warning: 'no post found'});
        res.json({message: 'Post Deleted'});
        return;


    } catch (error) {
        return res.json(error)
    }
};

exports.getNumberOfPostsByTag = async (req, res) => {
    try {
        const { tags } = req.body;
        if(!tags) return res.json({ Warning: 'Tags are required'})
        const regexs = tags.map((item) =>new RegExp(item, 'i'));
        const posts = await Post.find({ tags: {$in: regexs }}).countDocuments();
        res.json({ totalPostsByTag: posts });
        return;

    } catch (error) {
        return res.json(error)
    }
}