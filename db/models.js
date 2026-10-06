import mongoose from 'mongoose';

// ── SHARED OPTIONS ────────────────────────────────────────────────
// Adds virtual `id` string field, removes `_id` and `__v` from JSON
const opts = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
};

// ── FIELD (Email Marketing, Website Design, etc.) ─────────────────
const fieldSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  icon:        { type: String, default: '🔧' },
  color:       { type: String, default: '#7c3aed' },
  status:      { type: String, enum: ['active', 'coming_soon', 'inactive'], default: 'active' },
  sortOrder:   { type: Number, default: 0 },
}, opts);

// ── USER ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['admin', 'member'], default: 'member' },
  active:      { type: Boolean, default: true },
  fieldAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Field' }],
  lastLogin:   { type: Date, default: null },
}, opts);

// ── PROJECT ───────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  brand:     { type: String, required: true },
  niche:     { type: String, default: '' },
  goals:     { type: String, default: '' },
  field:     { type: mongoose.Schema.Types.ObjectId, ref: 'Field',   required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
}, opts);

// ── CAMPAIGN ──────────────────────────────────────────────────────
const campaignSchema = new mongoose.Schema({
  project:        { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name:           { type: String, default: 'New Campaign' },
  inputData:      { type: mongoose.Schema.Types.Mixed },
  briefData:      { type: mongoose.Schema.Types.Mixed },
  researchData:   { type: mongoose.Schema.Types.Mixed },
  synthesisData:  { type: mongoose.Schema.Types.Mixed },
  initialCopy:    { type: mongoose.Schema.Types.Mixed },
  copiesData:     { type: mongoose.Schema.Types.Mixed },
  copyEvaluation: { type: mongoose.Schema.Types.Mixed },
  selectedCopy:   { type: mongoose.Schema.Types.Mixed },
  designData:     { type: mongoose.Schema.Types.Mixed },
  designQA:       { type: mongoose.Schema.Types.Mixed },
  finalHtml:      { type: String, default: '' },
  status:         {
    type: String,
    enum: ['running','checkpoint1','designing','checkpoint2','complete','error'],
    default: 'running'
  },
  errorMessage:   { type: String, default: '' },
}, opts);

// ── REVISION ──────────────────────────────────────────────────────
const revisionSchema = new mongoose.Schema({
  campaign:     { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  type:         { type: String, enum: ['copy', 'design'], required: true },
  feedback:     { type: String, required: true },
  previousData: { type: mongoose.Schema.Types.Mixed },
  newData:      { type: mongoose.Schema.Types.Mixed },
  status:       { type: String, enum: ['pending','complete','error'], default: 'pending' },
}, opts);

// ── EXPORT MODELS ─────────────────────────────────────────────────
export const Field    = mongoose.models.Field    || mongoose.model('Field',    fieldSchema);
export const User     = mongoose.models.User     || mongoose.model('User',     userSchema);
export const Project  = mongoose.models.Project  || mongoose.model('Project',  projectSchema);
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
export const Revision = mongoose.models.Revision || mongoose.model('Revision', revisionSchema);