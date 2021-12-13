import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TABLE_PREFIX } from '../definitions';

import { Maintenance } from './maintenance.entity';
import { Comment } from './comment.entity';
import { Document } from './document.entity';

@Entity({ name: TABLE_PREFIX + 'tasks' })
export class Task {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36, nullable: false })
  tenantId!: string;

  @Column({ type: 'boolean' })
  completed!: boolean;

  @Column({ type: 'datetime', nullable: true })
  completedDate!: Date | null;

  @Index({ fulltext: true })
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isInternal!: boolean;

  @Column({ type: 'text' })
  responsible!: string;

  @Column({ type: 'numeric' })
  timeUnit!: number;

  @Column({ type: 'numeric' })
  targetTime!: number;

  @Column({ type: 'numeric' })
  position!: number;

  @ManyToOne(
    () => Maintenance,
    maintenance => maintenance.tasks,
  )
  maintenance!: Maintenance;

  @OneToMany(
    () => Comment,
    comment => comment.task,
  )
  comments!: Comment[];

  @ManyToMany(
    () => Document,
    document => document.tasks,
  )
  documents!: Document[];
}
