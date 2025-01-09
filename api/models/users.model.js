import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    channelName:{
        type:String,
        unique:true,
    },
    about:{
        type:String
    },
    location:{
        type:String
    },
    profilePicture:{
        type:String,
        default:"https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
    },
    profileBgPicture:{
        type:String,
        default:"https://t4.ftcdn.net/jpg/05/49/86/39/360_F_549863991_6yPKI08MG7JiZX83tMHlhDtd6XLFAMce.jpg",
    },
    followers:{
        type:Array,
        default:[],
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const User = mongoose.model('User', userSchema);

export default User;