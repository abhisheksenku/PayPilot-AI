import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TransactionAttributes {
  id: string;
  orderId: string;
  paypalOrderId: string;
  paypalCaptureId?: string | null;
  amount: number;
  currency: string;
  status: 'created' | 'approved' | 'completed' | 'failed' | 'refunded';
  createdAt?: Date;
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'paypalCaptureId' | 'status' | 'createdAt'> {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes {
  declare id: string;
  declare orderId: string;
  declare paypalOrderId: string;
  declare paypalCaptureId: string | null;
  declare amount: number;
  declare currency: string;
  declare status: 'created' | 'approved' | 'completed' | 'failed' | 'refunded';
  declare readonly createdAt: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    paypalOrderId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    paypalCaptureId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
    },
    status: {
      type: DataTypes.ENUM('created', 'approved', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'created',
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
    updatedAt: false,
  }
);
