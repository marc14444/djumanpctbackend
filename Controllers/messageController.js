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

