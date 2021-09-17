import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Crud extends Model {
 
  @Column({ type: DataType.STRING }) name: string;

  @Column({ type: DataType.STRING }) email: string;

  @Column({ type: DataType.STRING }) password: string;

  @Column({ type: 'TIMESTAMP', allowNull: true }) deletedAt;

}
