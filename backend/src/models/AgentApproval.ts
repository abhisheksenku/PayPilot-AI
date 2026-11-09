import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AgentApprovalAttributes {
  id: string;
  orderId: string;
  userId: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date | null;
  createdAt?: Date;
}

export interface AgentApprovalCreationAttributes
  extends Optional<AgentApprovalAttributes, 'id' | 'approvalStatus' | 'approvedAt' | 'createdAt'> {}

export class AgentApproval
  extends Model<AgentApprovalAttributes, AgentApprovalCreationAttributes>
  implements AgentApprovalAttributes {
  declare id: string;
  declare orderId: string;
  declare userId: string;
  declare approvalStatus: 'pending' | 'approved' | 'rejected';
  declare approvedAt: Date | null;
  declare readonly createdAt: Date;
}

AgentApproval.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'agent_approvals',
    timestamps: true,
    updatedAt: false,
  }
);
