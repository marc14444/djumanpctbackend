import Order from '../Models/Orders.js';

export const createOrder = async (req, res) => {
  try {
    const { buyer, artisan, publication, items, totalAmount } = req.body;
    const newOrder = new Order({ buyer, artisan, publication, items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: 'Commande créée avec succès', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer artisan publication');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la commande', error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.status(200).json({ message: 'Statut de la commande mis à jour avec succès', data: order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la commande', error });
  }
};

export const getOrdersByArtisan = async (req, res) => {
  try {
    const orders = await Order.find({ artisan: req.params.artisanId });
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
  }
};
