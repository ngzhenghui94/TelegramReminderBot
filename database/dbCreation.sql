create table Reminders
(
    id         int auto_increment
        primary key,
    uuid      varchar(255) not null,
    reminderdatetime    datetime not null,
    addedby     varchar(255)          not null,
    addedon datetime   not null
);

create index id
    on blogs (id);