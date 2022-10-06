import { EntityManager, MigrationInterface, QueryRunner } from 'typeorm';
import { Tag } from '../../products/db/tag.entity';
import { faker } from '@faker-js/faker';
import { User } from '../../users/db/user.entity';
import { Roles } from '../../shared/enums/roles.enums';
import { UserAddress } from '../../users/db/userAddress.entity';
import { dataSource } from '../../data-source';
import { Product } from 'src/products/db/products.entity';
export class InitData1664530121107 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tags = await this.saveTags();
    await this.saveProducts(tags);
    await this.saveUsers();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return null;
  }

  private async saveTags(): Promise<Tag[]> {
    const tagsArr: Tag[] = [];
    const tags = [{ name: 'NEW' }, { name: 'PROMO' }, { name: 'LAST_ITEMS' }];

    for (const tag of tags) {
      const tagToSave = new Tag();
      tagToSave.name = tag.name;
      tagsArr.push(await dataSource.getRepository(Tag).save(tagToSave));
    }

    console.log('Tags saved');

    return tagsArr;
  }

  private async saveUsers(): Promise<User[]> {
    const usersArr: User[] = [];

    for (let i = 0; i < 100; i++) {
      const userToSave = new User();
      userToSave.firstName = faker.name.firstName();
      userToSave.lastName = faker.name.lastName();
      userToSave.email = faker.internet.email();
      userToSave.birthdate = faker.date.birthdate();
      userToSave.role = faker.helpers.arrayElement([
        Roles.ADMIN,
        Roles.SELLER,
        Roles.CUSTOMER,
      ]);

      userToSave.address = await this.prepareUserAddressesToSave();

      usersArr.push(await dataSource.getRepository(User).save(userToSave));
    }

    return usersArr;
  }

  private async prepareUserAddressesToSave(): Promise<UserAddress[]> {
    const userAddressesArr: UserAddress[] = [];
    const numberOfAddresses = Number(faker.datatype.number({ min: 0, max: 5 }));

    for (let i = 0; i < numberOfAddresses; i++) {
      const userAddressToSave = new UserAddress();
      userAddressToSave.city = faker.address.city();
      userAddressToSave.street = faker.address.street();
      userAddressToSave.country = faker.address.country();
      while (userAddressToSave.country.length > 50) {
        userAddressToSave.country = faker.address.country();
      }
      userAddressToSave.buildingNumber = Number(faker.address.buildingNumber());
      const flatNumber = Number(
        faker.helpers.arrayElement([faker.address.buildingNumber(), null]),
      );
      userAddressToSave.flatNumber = flatNumber === 0 ? null : flatNumber;

      userAddressesArr.push(
        await dataSource.getRepository(UserAddress).save(userAddressToSave),
      );
    }

    return userAddressesArr;
  }

  private async saveProducts(tags: Tag[]): Promise<Product[]> {
    const products: Product[] = [];
    for (let i = 0; i < 100; i++) {
      await dataSource.transaction(async (manager: EntityManager) => {
        const productToSave = new Product();

        productToSave.name = faker.commerce.productName();
        productToSave.count = Number(
          faker.datatype.number({ min: 0, max: 100 }),
        );
        productToSave.price = Number(faker.commerce.price());
        productToSave.tags = faker.helpers.arrayElements(tags);

        products.push(await manager.getRepository(Product).save(productToSave));
        console.log('Products saved:, products.length');
      });
    }

    return products;
  }
}
