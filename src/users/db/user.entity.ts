import { Roles } from 'src/shared/enums/roles.enums';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserAddress } from './userAddress.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50 })
  email: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column('enum', {
    enum: Roles,
  })
  role: Roles;

  @OneToMany(() => UserAddress, (address) => address.user)
  address?: UserAddress[];
}