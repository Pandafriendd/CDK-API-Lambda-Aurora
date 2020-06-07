select * from information_schema.tables;
CREATE DATABASE recordstore;
USE recordstore;
CREATE TABLE IF NOT EXISTS records (recordid INT PRIMARY KEY, title VARCHAR(255) NOT NULL, release_date DATE);
CREATE TABLE IF NOT EXISTS singers (id INT PRIMARY KEY, name VARCHAR(255) NOT NULL, nationality VARCHAR(255) NOT NULL, recordid INT NOT NULL, FOREIGN KEY (recordid) REFERENCES records (recordid) ON UPDATE RESTRICT ON DELETE CASCADE);
INSERT INTO records(recordid,title,release_date) VALUES(001,'Liberian Girl','2012-05-03');
INSERT INTO singers(id,name,nationality,recordid) VALUES(100,'Michael Jackson','American',001);
