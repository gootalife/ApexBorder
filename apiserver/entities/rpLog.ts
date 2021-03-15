import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('rplog')
export class RPLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('text', { name: 'date' })
  date: string;

  @Column('text', { name: 'season' })
  season: string;

  @Column('int', { name: 'origin', array: true })
  origin: number[];

  @Column('int', { name: 'ps', array: true })
  ps: number[];

  @Column('int', { name: 'xbox', array: true })
  xbox: number[];

  constructor(date: string, season: string) {
    this.date = date;
    this.season = season;
    this.origin = [];
    this.ps = [];
    this.xbox = [];
  }
}