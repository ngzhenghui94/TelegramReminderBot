CREATE TABLE Reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(255) NULL,
    addedon DATETIME NULL,
    addedby VARCHAR(255) NULL,
    reminderdate VARCHAR(255) NULL,
    remindertime VARCHAR(255) NULL,
    description VARCHAR(1024) NULL,
    sendTo VARCHAR(255) NULL
);
