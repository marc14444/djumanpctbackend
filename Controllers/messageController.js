import Messages from "../Models/Messages.js";
import Conversations from "../Models/Conversation.js";

//Envoyer un message à une conversation
export const sendMessage = async (req, res) => {
  const { conversationId, sender, content } = req.body;

  try {
    const message = new Messages({ conversationId, sender, content });
    const savedMessage = await message.save();

    // Mettre à jour le dernier message de la conversation
    await Conversations.findByIdAndUpdate(conversationId, {
      lastMessage: savedMessage._id,
      updatedAt: Date.now(),
    });

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message.", error });
  }
};

//recuperer les messages d'une conversation
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Messages.find({ conversationId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages.", error });
  }
};

//supprimer un message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Messages.findByIdAndDelete(messageId);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du message.", error });
  }
};

//modifier un message
export const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await Messages.findByIdAndUpdate(messageId, { content });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification du message.", error });
  }
};

//répondre à un message
export const answerMessage = async (req, res) => {
  const { messageId, answer } = req.body;

  try {
    const message = await Messages.findByIdAndUpdate(messageId, { answer });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réponse au message.", error });
  }
};

//récupérer les messages non lus d'une conversation
export const getUnreadMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, read: false }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages non lus.", error });
  }
};

//marquer un message comme lu
export const markMessageAsRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Messages.findByIdAndUpdate(messageId, { read: true });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification du message comme lu.", error });
  }
};

//récupérer les messages d'une conversation avec un utilisateur
export const getMessagesByUser = async (req, res) => {
  const { conversationId, userId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, sender: userId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages d'une conversation avec un utilisateur.", error });
  }
};

//récupérer les messages d'une conversation avec un artisan
export const getMessagesByArtisan = async (req, res) => {
  const { conversationId, artisanId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, sender: artisanId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages d'une conversation avec un artisan.", error });
  }
};

//récupérer les messages recu d'une conversation avec un client
export const getMessagesByClient = async (req, res) => {
  const { conversationId, clientId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, sender: clientId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages d'une conversation avec un client.", error });
  }
};

//récupérer les messages envoyés d'une conversation avec un client
export const getMessagesByClientSent = async (req, res) => {
  const { conversationId, clientId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, receiver: clientId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages envoyés d'une conversation avec un client.", error });
  }
};

//récupérer les messages envoyés d'une conversation avec un artisan
export const getMessagesByArtisanSent = async (req, res) => {
  const { conversationId, artisanId } = req.params;

  try {
    const messages = await Messages.find({ conversationId, receiver: artisanId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages envoyés d'une conversation avec un artisan.", error });
  }
};


