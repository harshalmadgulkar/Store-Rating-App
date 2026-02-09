import Store from '../models/Store.model.js';
import Rating from '../models/Rating.model.js';

export async function getAllStores(req, res) {
  try {
    const { search, sort } = req.query;
    let query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { address: { $regex: search, $options: 'i' } }];
    }
    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOption[field] = order === 'desc' ? -1 : 1;
    }
    const stores = await Store.find(query).sort(sortOption).populate('owner', 'name email');

    const storesWithRatings = await Promise.all(stores.map(async (store) => {
      const [avgRating, myRating] = await Promise.all([
        Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
        Rating.findOne({ store: store._id, user: req.user.id }),
      ]);
      return {
        ...store.toObject(),
        overallRating: avgRating[0]?.avg.toFixed(1) || 0,
        myRating: myRating ? myRating.rating : null,
      };
    }));

    res.json(storesWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
}

export async function getStore(req, res) {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [avgRating, myRating] = await Promise.all([
      Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
      Rating.findOne({ store: store._id, user: req.user.id }),
    ]);

    res.json({
      ...store.toObject(),
      overallRating: avgRating[0]?.avg.toFixed(1) || 0,
      myRating: myRating ? myRating.rating : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store' });
  }
}

export async function addStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'STORE_OWNER') return res.status(400).json({ message: 'Invalid owner' });
    const store = await Store.create({ name, email, address, owner: ownerId });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create store' });
  }
}

export async function deleteStore(req, res) {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    await store.deleteOne();
    res.json({ message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store' });
  }
}