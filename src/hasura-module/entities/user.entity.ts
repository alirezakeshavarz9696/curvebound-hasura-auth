import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @Column('text')
    wallet_address: string;

    @Column('timestamp with time zone', { nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column('timestamp with time zone', { nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

}
