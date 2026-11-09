import { User } from './User';
import { Conversation } from './Conversation';
import { Message } from './Message';
import { Product } from './Product';
import { Order } from './Order';
import { Transaction } from './Transaction';
import { AgentExecution } from './AgentExecution';
import { AgentApproval } from './AgentApproval';
import { sequelize } from '../config/database';

// User <-> Conversation
User.hasMany(Conversation, { foreignKey: 'userId', as: 'conversations' });
Conversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Conversation <-> Message
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Conversation <-> AgentExecution
Conversation.hasMany(AgentExecution, { foreignKey: 'conversationId', as: 'executions' });
AgentExecution.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product <-> Order
Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Order <-> Transaction
Order.hasOne(Transaction, { foreignKey: 'orderId', as: 'transaction' });
Transaction.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Order <-> AgentApproval
Order.hasOne(AgentApproval, { foreignKey: 'orderId', as: 'approval' });
AgentApproval.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User <-> AgentApproval
User.hasMany(AgentApproval, { foreignKey: 'userId', as: 'approvals' });
AgentApproval.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  sequelize,
  User,
  Conversation,
  Message,
  Product,
  Order,
  Transaction,
  AgentExecution,
  AgentApproval,
};
