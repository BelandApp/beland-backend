import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'event_pass_type'})
export class EventPassType {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar')
    name:string

    @CreateDateColumn()
    created_at: Date;

}
