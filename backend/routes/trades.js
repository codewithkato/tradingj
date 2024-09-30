const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');

// Route om alle trades op te halen
router.get('/', async (req, res) => {
  try {
    const trades = await Trade.find();
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route om een trade toe te voegen
router.post('/', async (req, res) => {
  try {
    const { pair, type, entryPrice, exitPrice, quantity, date, notes } = req.body;
    
    // Voeg server-side validatie toe
    if (!pair || !type || !entryPrice || !quantity || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trade = new Trade({
      pair,
      type,
      entryPrice,
      exitPrice,
      quantity,
      date,
      notes
    });

    const newTrade = await trade.save();
    res.status(201).json(newTrade);
  } catch (err) {
    console.error('Error saving trade:', err);
    res.status(400).json({ message: err.message });
  }
});

// Route om een specifieke trade op te halen
router.get('/:id', async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });
    res.json(trade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route om een trade te updaten
router.put('/:id', async (req, res) => {
  try {
    const updatedTrade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrade) return res.status(404).json({ message: "Trade not found" });
    res.json(updatedTrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route om een trade te verwijderen
router.delete('/:id', async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });
    res.json({ message: "Trade deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
