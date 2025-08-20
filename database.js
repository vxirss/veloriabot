
// Usuwa wszystkie dane powiązane z danym serwerem
export async function clearGuildData(guildId) {
  await Promise.all([
    LogChannel.deleteMany({ guildId }),
    CreateChannel.deleteMany({ guildId }),
    MutedRole.deleteMany({ guildId }),
    User.deleteMany({ guildId }),
    Punishment.deleteMany({ guildId }),
    GuildOptions.deleteMany({ guildId }),
    LevelChannel.deleteMany({ guildId }),
    TicketChannel.deleteMany({ guildId }),
    LvlChannel.deleteMany({ guildId }),
    TicketCategory.deleteMany({ guildId }),
    TicketLogChannel.deleteMany({ guildId }),
    Welcome.deleteMany({ guildId }),
    AutoRole.deleteMany({ guildId }),
    AutoMod.deleteMany({ guildId }),
    Verify.deleteMany({ guildId }),
    IdeasChannel.deleteMany({ guildId }),
    LogIgnoreChannel.deleteMany({ guildId }),
    // Dodaj inne modele jeśli są
  ]);
}
import dotenv from 'dotenv';
dotenv.config();
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
// Ticket channel schema
const ticketChannelSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const TicketChannel = mongoose.model('TicketChannel', ticketChannelSchema);

export async function setTicketChannel(guildId, channelId) {
  await TicketChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getTicketChannel(guildId) {
  const entry = await TicketChannel.findOne({ guildId });
  return entry ? entry.channelId : null;
}
// Mod log channel (alias for moderation log)
export async function setModLog(guildId, channelId) {
  await LogChannel.findOneAndUpdate(
    { guildId, type: 'moderation' },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getModLog(guildId) {
  const entry = await LogChannel.findOne({ guildId, type: 'moderation' });
  return entry ? entry.channelId : null;
}
// Level channel schema
const lvlChannelSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
});
export const LvlChannel = mongoose.model('LvlChannel', lvlChannelSchema);

export async function setLvlChannel(guildId, channelId) {
  await LvlChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}
export async function getLvlChannel(guildId) {
  const entry = await LvlChannel.findOne({ guildId });
  return entry ? entry.channelId : null;
}
// Channel template for create channel
export async function setChannelTemplate(guildId, template) {
  await CreateChannel.findOneAndUpdate(
    { guildId },
    { nameTemplate: template },
    { upsert: true, new: true }
  );
}
export async function getChannelTemplate(guildId) {
  const entry = await CreateChannel.findOne({ guildId });
  return entry ? entry.nameTemplate : '{username}';
}
// Set create channel (shortcut for addCreateChannel)
export async function setCreateChannel(guildId, channelId) {
  await CreateChannel.findOneAndUpdate(
    { guildId },
    { channelId },
    { upsert: true, new: true }
  );
}

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
  flood: { type: Boolean, default: false },
  caps: { type: Boolean, default: false },
  invite: { type: Boolean, default: false },
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
export async function setAutoModFlood(guildId, flood) {
  await AutoMod.findOneAndUpdate(
    { guildId },
    { flood },
    { upsert: true, new: true }
  );
}
export async function setAutoModCaps(guildId, caps) {
  await AutoMod.findOneAndUpdate(
    { guildId },
    { caps },
    { upsert: true, new: true }
  );
}
export async function setAutoModInvite(guildId, invite) {
  await AutoMod.findOneAndUpdate(
    { guildId },
    { invite },
    { upsert: true, new: true }
  );
}
export async function getAutoModFlood(guildId) {
  const entry = await AutoMod.findOne({ guildId });
  return entry ? entry.flood : false;
}
export async function getAutoModCaps(guildId) {
  const entry = await AutoMod.findOne({ guildId });
  return entry ? entry.caps : false;
}
export async function getAutoModInvite(guildId) {
  const entry = await AutoMod.findOne({ guildId });
  return entry ? entry.invite : false;
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

