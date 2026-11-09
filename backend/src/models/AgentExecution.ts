import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AgentExecutionAttributes {
  id: string;
  conversationId: string;
  toolName: string;
  input: Record<string, any>;
  output: Record<string, any>;
  status: 'started' | 'completed' | 'failed';
  executionTime: number; // in milliseconds
  createdAt?: Date;
}

export interface AgentExecutionCreationAttributes
  extends Optional<AgentExecutionAttributes, 'id' | 'createdAt'> {}

export class AgentExecution
  extends Model<AgentExecutionAttributes, AgentExecutionCreationAttributes>
  implements AgentExecutionAttributes {
  declare id: string;
  declare conversationId: string;
  declare toolName: string;
  declare input: Record<string, any>;
  declare output: Record<string, any>;
  declare status: 'started' | 'completed' | 'failed';
  declare executionTime: number;
  declare readonly createdAt: Date;
}

AgentExecution.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    toolName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    input: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    output: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('started', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'started',
    },
    executionTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'agent_executions',
    timestamps: true,
    updatedAt: false,
  }
);
