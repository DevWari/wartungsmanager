import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { TABLE_PREFIX } from '../definitions';

import { Maintenance } from './maintenance.entity';
import { Task } from './task.entity';

@Entity({ name: TABLE_PREFIX + 'comments' })
export class Comment {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36, nullable: false })
  tenantId!: string;

  @Column({ type: 'numeric', nullable: false })
  duration!: number;

  @Column({ type: 'numeric', nullable: false, default: 1 })
  timeUnit!: number;

  @Column({ type: 'text', nullable: true })
  responsible!: string;

  @Column({ type: 'text', nullable: false })
  comment!: string;

  @ManyToOne(
    () => Maintenance,
    maintenance => maintenance.comments,
  )
  maintenance!: Maintenance;

  @ManyToOne(
    () => Task,
    task => task.comments,
  )
  task!: Task;
}
