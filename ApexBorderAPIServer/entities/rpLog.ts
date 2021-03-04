import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('RPLog')
export class RPLog {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column('text', { name: 'date' })
    date: string;

    @Column('int', {name: 'season'})
    season: number;

    @Column('int', { name: 'origin', array: true })
    origin: number[];

    @Column('int', { name: 'ps', array: true })
    ps: number[];

    @Column('int', { name: 'xbox', array: true })
    xbox: number[];

    constructor(date: string, season: number) {
        this.date = date;
        this.season = season;
        this.origin = [];
        this.ps = [];
        this.xbox = [];
    }
}