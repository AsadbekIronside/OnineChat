const knex = require('../db/db_init');

const create_users = async ()=>{

    await knex.schema.createTable('tb_users', (table)=>{
        table.increments('user_id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('account_name').notNullable();
        table.tinyint('user_status').defaultTo(1);
        table.string('profile_photo').defaultTo("default_profile_photo.jpg");
        table.timestamp('create_time').defaultTo(knex.fn.now());
        table.string('delete_time').nullable();
        table.string('update_time').nullable();
        // table.string('active_time').nullable();
    });
    console.log('td_users created!');
}

const create_messages = async ()=>{

    await knex.schema.createTable('tb_messages', (table)=>{
        table.increments('message_id').primary();
        table.integer('from_user_id').notNullable().unsigned();
        table.integer('to_user_id').notNullable();
        table.string('message',1000).notNullable();
        table.tinyint('message_status').defaultTo(1);
        table.string('create_time').notNullable();
        table.string('update_time').nullable();
        table.string('delete_time').nullable();

        table.foreign('from_user_id', 'f_key_user_id').references('tb_users.user_id');

    });
    console.log('tb_messages created!');

}

const create_groups = async ()=>{

    await knex.schema.dropTableIfExists('tb_groups');
    await knex.schema.createTable('tb_groups', (table)=>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('users').notNullable();
        table.integer('owner').notNullable();
        table.string('admins').nullable();
        table.string('photo').defaultTo('group.png')
        table.tinyint('status').defaultTo(1);
        table.string('create_time').notNullable();
        table.string('delete_time').nullable();
        table.string('update_time').nullable();
    });
    console.log('tb_groups created!');

}

const create_group_messages = async ()=>{

    await knex.schema.dropTableIfExists('tb_group_messages');
    await knex.schema.createTable('tb_group_messages', (table)=>{
        table.increments('id').primary();
        table.integer('user').notNullable();
        table.integer('group').notNullable();
        table.string('message', 1000).notNullable();
        table.tinyint('status').defaultTo(1);
        table.string('create_time').notNullable();
        table.string('delete_time').nullable();
        table.string('update_time').nullable();
    });
    console.log('tb_group_messages created!');


}

(async function(){

    await create_users();
    await create_messages();

    await create_group_messages();
    await create_groups();

}());