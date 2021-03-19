import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('border')
export class Border {
  @PrimaryColumn('text', { name: 'platform' })
  platform: string;

  @Column('text', { name: 'date' })
  date: string;

  @Column('int', { name: 'rp' })
  rp: number;

  constructor(platform: string, date: string, border: number) {
    this.platform = platform;
    this.date = date;
    this.rp = border;
  }
}