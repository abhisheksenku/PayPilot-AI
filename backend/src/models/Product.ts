import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductAttributes {
  id: string;
  externalId?: string | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  specifications?: Record<string, any> | null;
  source: string;
  createdAt?: Date;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'id' | 'externalId' | 'imageUrl' | 'specifications' | 'createdAt'> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  declare id: string;
  declare externalId: string | null;
  declare name: string;
  declare description: string;
  declare price: number;
  declare currency: string;
  declare imageUrl: string | null;
  declare specifications: Record<string, any> | null;
  declare source: string;
  declare readonly createdAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    externalId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    },
    imageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'channel3',
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    updatedAt: false,
  }
);
