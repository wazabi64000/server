// controllers/messageController.js
import Message from '../models/Message';

export const createMessage = async (req, res) => {
  try {
    // Assurez-vous que le champ content est fourni
    if (!req.body.content) {
      return res.status(400).json({ error: 'Le champ content est requis' });
    }

    // Récupérez le titre de l'annonce à partir du corps de la requête
    const adTitle = req.body.adTitle;

    // ... (autres logiques de création de message)

    const newMessage = new Message({
      sender: req.body.sender,
      recipient: req.body.recipient,
      content: req.body.content,
      adTitle: adTitle, // Ajoutez le titre de l'annonce au nouveau message
      unread: true,
    });

    // Enregistrez le message dans la base de données
    const savedMessage = await newMessage.save();

    // Répondez avec le message sauvegardé
    return res.status(200).json({ message: 'Message créé avec succès', savedMessage });
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
};

exports.getReceivedMessagesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const receivedMessages = await Message.find({ recipient: userId })
      .sort({ timestamp: 'desc' })
      .populate('sender', 'name');

    res.status(200).json(receivedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Obtenez tous les messages reçus par tous les utilisateurs
exports.getAllReceivedMessages = async (req, res) => {
  try {
    const allReceivedMessages = await Message.find({})
      .sort({ timestamp: 'desc' })
      .populate('sender', 'name');

    res.status(200).json(allReceivedMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
