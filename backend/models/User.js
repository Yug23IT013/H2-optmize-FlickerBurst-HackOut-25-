const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Model for H2 Optimize Authentication
 * Handles user registration, login, and profile management
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be longer than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'analyst', 'viewer'],
    default: 'analyst'
  },
  avatar: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=22c55e&color=ffffff`;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update avatar
userSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.avatar.includes('ui-avatars.com')) {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=22c55e&color=ffffff`;
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to update login info
userSchema.methods.updateLoginInfo = async function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  await this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get user stats
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { 
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } 
        },
        adminUsers: { 
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } 
        },
        analystUsers: { 
          $sum: { $cond: [{ $eq: ['$role', 'analyst'] }, 1, 0] } 
        },
        viewerUsers: { 
          $sum: { $cond: [{ $eq: ['$role', 'viewer'] }, 1, 0] } 
        },
        recentLogins: {
          $sum: {
            $cond: [
              { 
                $gte: ['$lastLogin', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] 
              }, 
              1, 
              0
            ]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    analystUsers: 0,
    viewerUsers: 0,
    recentLogins: 0
  };
};

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    isActive: this.isActive,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    memberSince: this.createdAt
  };
});

module.exports = mongoose.model('User', userSchema);
