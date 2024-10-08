import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('batches')
export class BatchEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batchId: string;

  @Column()
  webhookUrl: string;

  @Column({ nullable: true, default: 'validating' }) // Default status set to 'validating'
  status: string;

  @Column({ nullable: true })
  result: string; // Store the result or some summary of the result here
}
