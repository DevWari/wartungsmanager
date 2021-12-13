import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

import { TABLE_PREFIX } from '../definitions';

import { Maintenance } from './maintenance.entity';
import { Document } from './document.entity';

@Entity({ name: TABLE_PREFIX + 'files' })
export class File {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  id!: string;

  @Column({ type: 'char', length: 36, nullable: false })
  tenantId!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @ManyToOne(
    () => Maintenance,
    maintenance => maintenance.files,
  )
  maintenance!: Maintenance;
}
