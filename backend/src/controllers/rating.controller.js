import Rating from '../models/Rating.model.js';

export async function getRatingsForStore(req, res) {
  try {
    const ratings = await Rating.find({ store: req.params.storeId }).populate('user', 'name').sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
}

export async function addRating(req, res) {
  try {
    const { rating } = req.body;
    const result = await Rating.findOneAndUpdate(
      { user: req.user.id, store: req.params.storeId },
      { rating },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteRating(req, res) {
  try {
    await Rating.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Rating deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete rating' });
  }
}