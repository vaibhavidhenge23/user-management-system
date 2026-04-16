const User = require('../models/User');

// @GET /api/users — Admin, Manager
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Manager cannot see admin accounts
    if (req.user.role === 'manager') filter.role = { $ne: 'admin' };

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @GET /api/users/:id — Admin, Manager
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Manager cannot view admin accounts
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this user' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @POST /api/users — Admin only
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const generatedPassword = password || Math.random().toString(36).slice(-8);

    const user = await User.create({
      name,
      email,
      password: generatedPassword,
      role: role || 'user',
      status: status || 'active',
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      ...(password ? {} : { generatedPassword }),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @PUT /api/users/:id — Admin, Manager
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Manager cannot update admin accounts or change roles
    if (req.user.role === 'manager') {
      if (user.role === 'admin') {
        return res.status(403).json({ message: 'Not authorized to update admin users' });
      }
      if (role) {
        return res.status(403).json({ message: 'Managers cannot change roles' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.status = status || user.status;
    if (role && req.user.role === 'admin') user.role = role;
    user.updatedBy = req.user.id;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @DELETE /api/users/:id — Admin only (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    user.status = 'inactive';
    user.updatedBy = req.user.id;
    await user.save();

    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @GET /api/users/me — Any logged in user
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @PUT /api/users/me — Any logged in user
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (password) user.password = password; // pre-save hook hashes it
    user.updatedBy = req.user.id;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};