import Conversations from "../Models/Conversation.js";

export const createConversation = async (req, res) => {
  const { participants } = req.body;

  try {
    // Vérifier si une conversation existe déjà entre les participants
    const existingConversation = await Conversations.findOne({
      participants: { $all: participants.map((p) => ({ participantId: p.participantId, role: p.role })) },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = new Conversations({ participants });
    const savedConversation = await conversation.save();

    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la conversation.", error });
  }
};

export const getConversation = async (req, res) => {
    const conversationId = req.params.conversationId;
    const conversation = await Conversations.findById(conversationId);
    if (!conversation) {
        return res.status(404).json({ message: "Conversation introuvable" });
    }
    res.status(200).json(conversation);
};

export const deleteConversation = async (req, res) => {
    const conversationId = req.params.conversationId;
    const conversation = await Conversations.findById(conversationId);
    if (!conversation) {
        return res.status(404).json({ message: "Conversation introuvable" });
    }
    await conversation.deleteOne();
    res.status(200).json({ message: "Conversation supprimée avec succès" });
};