import mongoose from "mongoose";

const mediaPostScema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    postImage:{
        type:String,
        default:'https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg',
       },
    postMedia:{
        type:String,
        default:'',
       },
    content:{
        type:String,
        required:true
       },
       hashtag:{
        type: Array,
        default: [],
       },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    likes: {
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0,
    },
    impressions: { type: Number, default: 0 }, // Track impressions
    usersavedpost: [String],
    },{timestamps:true});

const MediaPost = mongoose.model('MediaPost',mediaPostScema);

export default MediaPost;

