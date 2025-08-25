import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    posts: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now, // auto-store when added
        },
      },
    ],
    postCount: {
      type: Number,
      default: 0,
    },
    route: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Middleware: keep postCount in sync
communitySchema.pre("save", function (next) {
  this.postCount = this.posts.length;
  next();
});

// If you update posts via updateOne/findOneAndUpdate, you can also add post middleware:
communitySchema.pre("findOneAndUpdate", function (next) {
  if (this._update.posts) {
    this._update.postCount = this._update.posts.length;
  }
  next();
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
