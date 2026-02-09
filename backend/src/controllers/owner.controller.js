import Store from '../models/Store.model.js';
import Rating from '../models/Rating.model.js';

export async function getOwnerDashboard(req, res) {
    try {
        const store = await Store.findOne({ owner: req.user.id });
        if (!store) return res.status(404).json({ message: 'No store found' });

        const [avgRating, ratings] = await Promise.all([
            Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
            Rating.find({ store: store._id }).populate('user', 'name').sort({ createdAt: -1 }),
        ]);

        res.json({
            averageRating: avgRating[0]?.avg.toFixed(1) || 0,
            ratings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}