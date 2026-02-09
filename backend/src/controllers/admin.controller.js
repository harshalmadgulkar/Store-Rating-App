import Store from '../models/Store.model.js';
import Rating from '../models/Rating.model.js';
import User from '../models/User.model.js';

export async function getDashboard(req, res) {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            User.countDocuments(),
            Store.countDocuments(),
            Rating.countDocuments(),
        ]);
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function createUser(req, res) {
    try {
        const { name, email, password, address, role } = req.body;
        const user = await User.create({ name, email, password, address, role });
        res.status(201).json(user.toJSON());
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getAllUsers(req, res) {
    try {
        const { search, role, sort } = req.query;
        let query = {};
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { address: { $regex: search, $options: 'i' } }];
        if (role) query.role = role;
        let sortOption = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption[field] = order === 'desc' ? -1 : 1;
        }
        let users = await User.find(query).sort(sortOption).select('-password');

        users = await Promise.all(users.map(async (user) => {
            if (user.role === 'STORE_OWNER') {
                const store = await Store.findOne({ owner: user._id });
                if (store) {
                    const [avg] = await Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]);
                    user = user.toObject();
                    user.storeRating = avg?.avg.toFixed(1) || 0;
                }
            }
            return user;
        }));

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getUserDetail(req, res) {
    try {
        let user = await User.findById(req.params.id).select('-password');
        if (user.role === 'STORE_OWNER') {
            const store = await Store.findOne({ owner: user._id });
            if (store) {
                const [avg] = await Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]);
                user = user.toObject();
                user.storeRating = avg?.avg.toFixed(1) || 0;
            }
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function createStore(req, res) {
    try {
        const { name, email, address, ownerId } = req.body;
        const owner = await User.findById(ownerId);
        if (!owner || owner.role !== 'STORE_OWNER') return res.status(400).json({ message: 'Invalid owner' });
        const store = await Store.create({ name, email, address, owner: ownerId });
        res.status(201).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function getAllStoresAdmin(req, res) {
    try {
        const { search, sort } = req.query;
        let query = {};
        if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { address: { $regex: search, $options: 'i' } }];
        let sortOption = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption[field] = order === 'desc' ? -1 : 1;
        }
        let stores = await Store.find(query).sort(sortOption).populate('owner', 'name email');

        stores = await Promise.all(stores.map(async (store) => {
            const [avg] = await Rating.aggregate([{ $match: { store: store._id } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]);
            return { ...store.toObject(), rating: avg?.avg.toFixed(1) || 0 };
        }));

        res.json(stores);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}