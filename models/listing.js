const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title : {
        type: String,
        require : true,
    },
    description : String,
    image:{ filename:String,
        url:{type:String,
        default:"https://media.istockphoto.com/id/534716373/photo/sunset-on-tropical-beach.jpg?s=2048x2048&w=is&k=20&c=08A6qXe1sw5inFvzbik-eDu05ANE81Jdhf8SynoohAA=",
        Set:(v)=> v==="" ? "https://www.istockphoto.com/photo/a-large-gray-craftsman-new-construction-house-with-a-landscaped-yard-and-leading-gm1448386210-485915364?utm_campaign=category_photos_bottom&utm_content=https%3A%2F%2Funsplash.com%2Fimages&utm_medium=affiliate&utm_source=unsplash&utm_term=images%3A%3A%3A" : v
       
    
    }},
    price : Number,
    location : String,
    country : String,
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },

});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if (listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
   
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
