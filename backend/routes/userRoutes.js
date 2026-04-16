const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const {
  getAllUsers, getUserById, createUser,
  updateUser, deleteUser, getMyProfile, updateMyProfile,
} = require('../controllers/userController');
const { createUserRules, updateUserRules, updateProfileRules, validate } = require('../validators/userValidator');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateProfileRules, validate, updateMyProfile);
router.post('/', protect, authorize('admin'), createUserRules, validate, createUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.get('/', protect, authorize('admin', 'manager'), getAllUsers);
router.get('/:id', protect, authorize('admin', 'manager'), getUserById);
router.put('/:id', protect, authorize('admin', 'manager'), updateUserRules, validate, updateUser);

module.exports = router;