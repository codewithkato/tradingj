const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  pair: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['long', 'short'],
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  // Optionele velden die je later kunt toevoegen
  stopLoss: {
    type: Number
  },
  takeProfit: {
    type: Number
  },
  fees: {
    type: Number,
    default: 0
  },
  profitLoss: {
    type: Number
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    required: true
  },
  exitDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Voeg een methode toe om profit/loss te berekenen
tradeSchema.methods.calculateProfitLoss = function() {
  if (this.exitPrice) {
    const difference = this.type === 'long' 
      ? this.exitPrice - this.entryPrice
      : this.entryPrice - this.exitPrice;
    this.profitLoss = (difference * this.quantity) - this.fees;
  }
};

// Voeg een methode toe om een trade te sluiten
tradeSchema.methods.closeTrade = function(exitPrice, exitDate = new Date()) {
  this.exitPrice = exitPrice;
  this.exitDate = exitDate;
  this.status = 'closed';
  this.calculateProfitLoss();
};

// Middleware om profit/loss te berekenen voor het opslaan
tradeSchema.pre('save', function(next) {
  if (this.exitPrice) {
    this.calculateProfitLoss();
  }
  next();
});

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;