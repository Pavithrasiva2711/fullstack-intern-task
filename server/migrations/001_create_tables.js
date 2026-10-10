
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('templates', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('category').notNullable();
    table.string('image_url');
    table.string('author').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('template_id').unsigned().notNullable()
      .references('id').inTable('templates').onDelete('CASCADE');
    table.unique(['user_id', 'template_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('favorites');
  await knex.schema.dropTableIfExists('templates');
  await knex.schema.dropTableIfExists('users');
};