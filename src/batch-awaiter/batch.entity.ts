import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('batches')
export class BatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batchId: string;

  @Column()
  webhookUrl: string;
}
