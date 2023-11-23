// src/airports/entities/airport.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('airports')
export class Airports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 4, nullable: true })
  icaoCode: string;

  @Column({ type: 'char', length: 3, nullable: true })
  iataCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'int', nullable: true })
  latDeg: number;

  @Column({ type: 'int', nullable: true })
  latMin: number;

  @Column({ type: 'int', nullable: true })
  latSec: number;

  @Column({ type: 'char', length: 1, nullable: true })
  latDir: string;

  @Column({ type: 'int', nullable: true })
  lonDeg: number;

  @Column({ type: 'int', nullable: true })
  lonMin: number;

  @Column({ type: 'int', nullable: true })
  lonSec: number;

  @Column({ type: 'char', length: 1, nullable: true })
  lonDir: string;

  @Column({ type: 'int', nullable: true })
  altitude: number;

  @Column({ type: 'double precision', nullable: true })
  latDecimal: number;

  @Column({ type: 'double precision', nullable: true })
  lonDecimal: number;
  // Constructor for easier entity creation
  constructor(partial: Partial<Airports>) {
    Object.assign(this, partial);
  }
}


