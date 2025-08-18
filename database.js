import mongoose from 'mongoose';
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URL);

// Log channel schemas (moderation & messages)
const logChannelSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  type: String, // 'moderation' or 'messages'
});
export const LogChannel = mongoose.model('LogChannel', logChannelSchema);

export async function setModerationLogChannel(guildId, channelId) {
  await LogChannel.findOneAndUpdate(
    { guildId, type: 'moderation' },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getModerationLogChannel(guildId) {
  const entry = await LogChannel.findOne({ guildId, type: 'moderation' });
  return entry ? entry.channelId : null;
}
export async function setMessagesLogChannel(guildId, channelId) {
  await LogChannel.findOneAndUpdate(
    { guildId, type: 'messages' },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getMessagesLogChannel(guildId) {
  const entry = await LogChannel.findOne({ guildId, type: 'messages' });
  return entry ? entry.channelId : null;
}

// Schemat dla kanałów do tworzenia prywatnych kanałów głosowych
const createChannelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  nameTemplate: { type: String, default: '{username}' },
});
export const CreateChannel = mongoose.model('CreateChannel', createChannelSchema);

export async function addCreateChannel(guildId, channelId, nameTemplate = '{username}') {
  await CreateChannel.findOneAndUpdate(
    { guildId, channelId },
    { guildId, channelId, nameTemplate },
    { upsert: true, new: true }
  );
}
export async function getCreateChannels(guildId) {
  return await CreateChannel.find({ guildId });
}
export async function getChannelTemplate(guildId, channelId) {
  const entry = await CreateChannel.findOne({ guildId, channelId });
  return entry ? entry.nameTemplate : '{username}';
}
export async function removeCreateChannel(guildId, channelId) {
  await CreateChannel.deleteOne({ guildId, channelId });
}

// Muted role schema
const mutedRoleSchema = new mongoose.Schema({
  guildId: String,
  roleId: String,
});
export const MutedRole = mongoose.model('MutedRole', mutedRoleSchema);

export async function setMutedRole(guildId, roleId) {
  await MutedRole.findOneAndUpdate(
    { guildId },
    { roleId },
    { upsert: true, new: true }
  );
}
export async function getMutedRole(guildId) {
  const entry = await MutedRole.findOne({ guildId });
  return entry ? entry.roleId : null;
}

// User points & levels schema
const userSchema = new mongoose.Schema({
  id: String,
  guildId: String,
  points: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  birthday: { type: String, default: null }, // DD-MM
});
export const User = mongoose.model('User', userSchema);

export async function addPoints(userId, guildId, points) {
  const user = await User.findOneAndUpdate(
    { id: userId, guildId },
    { $inc: { points } },
    { upsert: true, new: true }
  );
  return user;
}
export async function getPoints(userId, guildId) {
  const user = await User.findOne({ id: userId, guildId });
  return user ? user.points : 0;
}

export async function getUserBirthday(userId, guildId) {
  const user = await User.findOne({ id: userId, guildId });
  return user ? user.birthday : null;
}

export async function setUserBirthday(userId, guildId, date) {
  await User.findOneAndUpdate(
    { id: userId, guildId },
    { birthday: date },
    { upsert: true, new: true }
  );
}

// Punishment schema with caseNumber
const punishmentSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  type: String,
  reason: String,
  moderatorId: String,
  timestamp: Date,
  caseNumber: Number,
});
export const Punishment = mongoose.model('Punishment', punishmentSchema);

export async function logPunishment({ userId, guildId, type, reason, moderatorId }) {
  const caseNumber = (await Punishment.countDocuments({ guildId })) + 1;
  await Punishment.create({
    userId,
    guildId,
    type,
    reason,
    moderatorId,
    timestamp: new Date(),
    caseNumber,
  });
  return caseNumber;
}
export async function getPunishments(userId, guildId) {
  return await Punishment.find({ userId, guildId }).sort({ timestamp: -1 });
}
export async function deletePunishmentByCase(guildId, caseNumber) {
  return await Punishment.findOneAndDelete({ guildId, caseNumber });
}
export async function clearPunishments(userId, guildId) {
  return await Punishment.deleteMany({ userId, guildId });
}

// Level system - kanał ogłoszeń i opcje
const guildOptionsSchema = new mongoose.Schema({
  guildId: String,
  levelsEnabled: { type: Boolean, default: false },
  birthdayChannel: { type: String, default: null },
});
export const GuildOptions = mongoose.model('GuildOptions', guildOptionsSchema);

export async function setLevelsEnabled(guildId, enabled) {
  await GuildOptions.findOneAndUpdate(
    { guildId },
    { levelsEnabled: enabled },
    { upsert: true, new: true }
  );
}
export async function getLevelsEnabled(guildId) {
  const entry = await GuildOptions.findOne({ guildId });
  return entry ? entry.levelsEnabled : false;
}

const levelChannelSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const LevelChannel = mongoose.model('LevelChannel', levelChannelSchema);

export async function setLevelChannel(guildId, channelId) {
  await LevelChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getLevelChannel(guildId) {
  const entry = await LevelChannel.findOne({ guildId });
  return entry ? entry.channelId : null;
}

// --- TICKETS ---

const ticketSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  caseNumber: Number,
  reason: String,
  createdAt: Date,
  channelId: String,
  closed: { type: Boolean, default: false },
  closedAt: Date,
  closedBy: String,
  transcript: String,
});
export const Ticket = mongoose.model('Ticket', ticketSchema);

const ticketCategorySchema = new mongoose.Schema({
  guildId: String,
  categoryId: String,
});
export const TicketCategory = mongoose.model('TicketCategory', ticketCategorySchema);

export async function setTicketCategory(guildId, categoryId) {
  await TicketCategory.findOneAndUpdate(
    { guildId },
    { categoryId },
    { upsert: true, new: true }
  );
}
export async function getTicketCategory(guildId) {
  const entry = await TicketCategory.findOne({ guildId });
  return entry ? entry.categoryId : null;
}

const ticketLogSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const TicketLogChannel = mongoose.model('TicketLogChannel', ticketLogSchema);

export async function setTicketLogChannel(guildId, channelId) {
  await TicketLogChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getTicketLogChannel(guildId) {
  const entry = await TicketLogChannel.findOne({ guildId });
  return entry ? entry.channelId : null;
}

const welcomeSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  message: String,
  enabled: { type: Boolean, default: true },
});
export const Welcome = mongoose.model('Welcome', welcomeSchema);

export async function setWelcomeChannel(guildId, channelId) {
  await Welcome.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function setWelcomeMessage(guildId, message) {
  await Welcome.findOneAndUpdate(
    { guildId },
    { message },
    { upsert: true, new: true }
  );
}
export async function setWelcomeEnabled(guildId, enabled) {
  await Welcome.findOneAndUpdate(
    { guildId },
    { enabled },
    { upsert: true, new: true }
  );
}
export async function getWelcomeChannel(guildId) {
  const entry = await Welcome.findOne({ guildId });
  return entry ? entry.channelId : null;
}
export async function getWelcomeMessage(guildId) {
  const entry = await Welcome.findOne({ guildId });
  return entry ? entry.message : null;
}
export async function getWelcomeEnabled(guildId) {
  const entry = await Welcome.findOne({ guildId });
  return entry ? entry.enabled : false;
}

const autoRoleSchema = new mongoose.Schema({
  guildId: String,
  roleId: String,
});
export const AutoRole = mongoose.model('AutoRole', autoRoleSchema);

export async function setAutoRole(guildId, roleId) {
  await AutoRole.findOneAndUpdate(
    { guildId },
    { roleId },
    { upsert: true, new: true }
  );
}
export async function getAutoRole(guildId) {
  const entry = await AutoRole.findOne({ guildId });
  return entry ? entry.roleId : null;
}

const autoModSchema = new mongoose.Schema({
  guildId: String,
  enabled: { type: Boolean, default: false },
  words: [String],
});
export const AutoMod = mongoose.model('AutoMod', autoModSchema);

export async function setAutoModEnabled(guildId, enabled) {
  await AutoMod.findOneAndUpdate(
    { guildId },
    { enabled },
    { upsert: true, new: true }
  );
}
export async function setAutoModWords(guildId, words) {
  await AutoMod.findOneAndUpdate(
    { guildId },
    { words },
    { upsert: true, new: true }
  );
}
export async function getAutoModEnabled(guildId) {
  const entry = await AutoMod.findOne({ guildId });
  return entry ? entry.enabled : false;
}
export async function getAutoModWords(guildId) {
  const entry = await AutoMod.findOne({ guildId });
  return entry ? entry.words : [];
}

const verifySchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  roleId: String,
});
export const Verify = mongoose.model('Verify', verifySchema);

export async function setVerifyChannel(guildId, channelId) {
  await Verify.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function setVerifyRole(guildId, roleId) {
  await Verify.findOneAndUpdate(
    { guildId },
    { roleId },
    { upsert: true, new: true }
  );
}
export async function getVerifyChannel(guildId) {
  const entry = await Verify.findOne({ guildId });
  return entry ? entry.channelId : null;
}
export async function getVerifyRole(guildId) {
  const entry = await Verify.findOne({ guildId });
  return entry ? entry.roleId : null;
}

const ideasSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const IdeasChannel = mongoose.model('IdeasChannel', ideasSchema);

export async function setIdeasChannel(guildId, channelId) {
  await IdeasChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getIdeasChannel(guildId) {
  const entry = await IdeasChannel.findOne({ guildId });
  return entry ? entry.channelId : null;
}

const logIgnoreSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const LogIgnoreChannel = mongoose.model('LogIgnoreChannel', logIgnoreSchema);

export async function setLogIgnoreChannel(guildId, channelId) {
  await LogIgnoreChannel.findOneAndUpdate(
    { guildId, channelId },
    { guildId, channelId },
    { upsert: true, new: true }
  );
}
export async function getLogIgnoreChannels(guildId) {
  const entries = await LogIgnoreChannel.find({ guildId });
  return entries.map(e => e.channelId);
}

export async function setBirthdayChannel(guildId, channelId) {
  await GuildOptions.findOneAndUpdate(
    { guildId },
    { birthdayChannel: channelId },
    { upsert: true, new: true }
  );
}

