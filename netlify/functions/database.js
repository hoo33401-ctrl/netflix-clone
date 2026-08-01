const mongoose = require('mongoose');
let cachedDb = null;
exports.connectToDatabase = async () => {
  if (cachedDb) return cachedDb;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI);
  return cachedDb;
};
const MovieSchema = new mongoose.Schema({ tmdbId: Number, title: String, isAdult: Boolean, isBlocked: Boolean });
exports.Movie = mongoose.model('Movie', MovieSchema);
