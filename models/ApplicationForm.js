const mongoose = require('mongoose');

const applicationFormSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
      maxlength: [50, 'Nationality cannot exceed 50 characters']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    }
  },
  academic: {
    currentEducation: {
      type: String,
      required: [true, 'Current education level is required'],
      trim: true,
      maxlength: [100, 'Education level cannot exceed 100 characters']
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [200, 'Institution name cannot exceed 200 characters']
    },
    gpa: {
      type: String,
      trim: true,
      maxlength: [10, 'GPA cannot exceed 10 characters']
    },
    graduationYear: {
      type: String,
      trim: true,
      maxlength: [4, 'Graduation year cannot exceed 4 characters']
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [100, 'Field of study cannot exceed 100 characters']
    }
  },
  program: {
    degreeLevel: {
      type: String,
      required: [true, 'Degree level is required'],
      enum: ['bachelors', 'masters', 'phd', 'mbbs', 'diploma', 'certificate'],
      trim: true
    },
    preferredProgram: {
      type: String,
      required: [true, 'Preferred program is required'],
      trim: true,
      maxlength: [100, 'Program name cannot exceed 100 characters']
    },
    preferredUniversity: {
      type: String,
      trim: true,
      maxlength: [200, 'University name cannot exceed 200 characters']
    },
    startDate: {
      type: String,
      required: [true, 'Preferred start date is required'],
      trim: true
    }
  },
  documents: {
    transcript: {
      type: Boolean,
      default: false
    },
    passport: {
      type: Boolean,
      default: false
    },
    languageTest: {
      type: Boolean,
      default: false
    },
    recommendation: {
      type: Boolean,
      default: false
    }
  },
  additional: {
    scholarshipInterest: {
      type: String,
      enum: ['yes', 'no', 'maybe'],
      trim: true
    },
    personalStatement: {
      type: String,
      trim: true,
      maxlength: [2000, 'Personal statement cannot exceed 2000 characters']
    },
    previousExperience: {
      type: String,
      trim: true,
      maxlength: [1000, 'Previous experience cannot exceed 1000 characters']
    }
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'accepted', 'rejected', 'on_hold'],
    default: 'submitted'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
applicationFormSchema.index({ 'personalInfo.email': 1, createdAt: -1 });
applicationFormSchema.index({ status: 1, createdAt: -1 });
applicationFormSchema.index({ 'program.degreeLevel': 1, createdAt: -1 });

// Virtual for full name
applicationFormSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for age calculation
applicationFormSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware
applicationFormSchema.pre('save', function(next) {
  // Clean up string fields
  const cleanString = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          cleanString(obj[key]);
        }
      });
    }
  };
  
  cleanString(this.toObject());
  next();
});

module.exports = mongoose.model('ApplicationForm', applicationFormSchema);

