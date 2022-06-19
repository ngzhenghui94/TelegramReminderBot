create table Reminders
(
    id               int auto_increment
        primary key,
    uuid             varchar(255) null,
    addedon          datetime     null,
    addedby          varchar(255) null,
    reminderdatetime varchar(255) null
);

