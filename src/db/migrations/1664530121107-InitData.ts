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
    await queryRunner.query(
      `CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`price\` float NOT NULL DEFAULT '0', \`count\` int NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_addresses\` (\`id\` varchar(36) NOT NULL, \`country\` varchar(50) NOT NULL, \`city\` varchar(50) NOT NULL, \`street\` varchar(50) NOT NULL, \`buildingNumber\` int NOT NULL, \`flatNumber\` int NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(50) NOT NULL, \`lastName\` varchar(50) NOT NULL, \`email\` varchar(50) NOT NULL, \`birthdate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('ADMIN', 'SELLER', 'CUSTOMER') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products_tags\` (\`productId\` varchar(36) NOT NULL, \`tagId\` varchar(36) NOT NULL, INDEX \`IDX_760e7f7633ea6698009264a7b9\` (\`productId\`), INDEX \`IDX_26646b3daf27bc55654b2e5134\` (\`tagId\`), PRIMARY KEY (\`productId\`, \`tagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_addresses\` ADD CONSTRAINT \`FK_781afdedafe920f331f6229cb62\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products_tags\` ADD CONSTRAINT \`FK_760e7f7633ea6698009264a7b9a\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products_tags\` ADD CONSTRAINT \`FK_26646b3daf27bc55654b2e5134d\` FOREIGN KEY (\`tagId\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    const tags = await this.saveTags();
    await this.saveProducts(tags);
    await this.saveUsers();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products_tags\` DROP FOREIGN KEY \`FK_26646b3daf27bc55654b2e5134d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products_tags\` DROP FOREIGN KEY \`FK_760e7f7633ea6698009264a7b9a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_addresses\` DROP FOREIGN KEY \`FK_781afdedafe920f331f6229cb62\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_26646b3daf27bc55654b2e5134\` ON \`products_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_760e7f7633ea6698009264a7b9\` ON \`products_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`products_tags\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`user_addresses\``);
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP TABLE \`tags\``);
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
