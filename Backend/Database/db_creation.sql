-- =========================================================
-- 1. CREATE DATABASE
-- =========================================================
DROP DATABASE IF EXISTS oss_demo;
CREATE DATABASE oss_demo
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
USE oss_demo;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 2. TABLE DEFINITIONS
-- =========================================================

-- 2.1 Admin
DROP TABLE IF EXISTS Admin;
CREATE TABLE Admin (
    Id                INT AUTO_INCREMENT PRIMARY KEY,
    Username          VARCHAR(50)  UNIQUE NOT NULL,
    Password          VARCHAR(255) NOT NULL,
    Name              VARCHAR(100) NOT NULL,
    Age               INT,
    PhoneNumber       VARCHAR(20),
    Email             VARCHAR(100),
    Gender            VARCHAR(10),
    Address           VARCHAR(255),
    IdentityCardNum   VARCHAR(20),
    LastLogin         TIMESTAMP NULL,
    CreatedDate       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdateDate    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Status            ENUM('Active', 'Deactivated') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.2 StoreStaff
DROP TABLE IF EXISTS StoreStaff;
CREATE TABLE StoreStaff (
    Id                  INT AUTO_INCREMENT PRIMARY KEY,
    Username            VARCHAR(50) UNIQUE NOT NULL,
    Password            VARCHAR(255) NOT NULL,
    Name                VARCHAR(100) NOT NULL,
    Age                 INT,
    PhoneNumber         VARCHAR(20),
    Email               VARCHAR(100),
    Gender              VARCHAR(10),
    Address             VARCHAR(255),
    IdentityCardNum     VARCHAR(20),
    LastLogin           TIMESTAMP NULL,
    CreatedDate         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdateDate      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Position            VARCHAR(100),
    Department          VARCHAR(100),
    HiredDate           DATE,
    Status            ENUM('Active', 'Deactivated') DEFAULT 'Active',
    Salary              DECIMAL(15,2),
    BankAccountNumber   VARCHAR(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.3 SystemModificationActivities
DROP TABLE IF EXISTS SystemModificationActivities;
CREATE TABLE SystemModificationActivities (
    ActivityId    INT AUTO_INCREMENT PRIMARY KEY,
    ActivityName  VARCHAR(100) NOT NULL,
    ActivityType  VARCHAR(50),
    Description   VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.4 AuditLog
DROP TABLE IF EXISTS AuditLog;
CREATE TABLE AuditLog (
    LogId            INT AUTO_INCREMENT PRIMARY KEY,
    AdminId          INT NOT NULL,
    ActivityId       INT NOT NULL,
    Status           VARCHAR(20),
    TimeOfOccurrence TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditlog_admin
        FOREIGN KEY (AdminId) REFERENCES Admin(Id),
    CONSTRAINT fk_auditlog_activity
        FOREIGN KEY (ActivityId) REFERENCES SystemModificationActivities(ActivityId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.5 Customer
DROP TABLE IF EXISTS Customer;
CREATE TABLE Customer (
    Id              INT AUTO_INCREMENT PRIMARY KEY,
    Username        VARCHAR(50) UNIQUE NOT NULL,
    Password        VARCHAR(255) NOT NULL,
    Name            VARCHAR(100) NOT NULL,
    Age             INT,
    PhoneNumber     VARCHAR(20),
    Email           VARCHAR(100),
    Gender          VARCHAR(10),
    Address         VARCHAR(255),
    IdentityCardNum VARCHAR(20),
    LastLogin       TIMESTAMP NULL,
    CreatedDate     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdateDate  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.6 Cart
DROP TABLE IF EXISTS Cart;
CREATE TABLE Cart (
    CartId            INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId        INT NOT NULL,
    LatestModifiedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_customer
        FOREIGN KEY (CustomerId) REFERENCES Customer(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.7 Product
DROP TABLE IF EXISTS Product;
CREATE TABLE Product (
    ProductId       VARCHAR(20) PRIMARY KEY,
    ProductName     VARCHAR(150) NOT NULL,
    Brand           VARCHAR(100),
    Price           DECIMAL(15,2),
    Color           VARCHAR(50),
    Quantity        INT,
    Specification   TEXT,
    WarrantyPeriod  INT,       -- months
    ReleaseDate     DATE,
    Status          ENUM('Active', 'Deactivated') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.8 Order (use backticks because ORDER is reserved)
DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
    OrderId             INT AUTO_INCREMENT PRIMARY KEY,
    CustomerId          INT NOT NULL,
    CartId              INT NOT NULL,
    IntendedShipmentDate DATE,
    OrderDate           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RecipientName		VARCHAR(150),
    RecipientContact	TEXT,
    ShipmentAddress     VARCHAR(255),
    Status              VARCHAR(50),
    CONSTRAINT fk_order_customer
        FOREIGN KEY (CustomerId) REFERENCES Cart(CustomerId),
    CONSTRAINT fk_order_cart
        FOREIGN KEY (CartId) REFERENCES Cart(CartId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.9 OrderContainsProduct
DROP TABLE IF EXISTS OrderContainsProduct;
CREATE TABLE OrderContainsProduct (
    OrderId   INT NOT NULL,
    ProductId VARCHAR(20) NOT NULL,
    Quantity  INT NOT NULL,
    PRIMARY KEY (OrderId, ProductId),
    CONSTRAINT fk_ocp_order
        FOREIGN KEY (OrderId) REFERENCES `Order`(OrderId),
    CONSTRAINT fk_ocp_product
        FOREIGN KEY (ProductId) REFERENCES Product(ProductId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2.10 CartContainsProduct
DROP TABLE IF EXISTS CartContainsProduct;
CREATE TABLE CartContainsProduct (
    ProductId  VARCHAR(20) NOT NULL,
    CustomerId INT NOT NULL,
    CartId     INT NOT NULL,
    Quantity   INT NOT NULL,
    PRIMARY KEY (ProductId, CartId),
    CONSTRAINT fk_ccp_product
        FOREIGN KEY (ProductId) REFERENCES Product(ProductId),
    CONSTRAINT fk_ccp_customer
        FOREIGN KEY (CustomerId) REFERENCES Cart(CustomerId),
    CONSTRAINT fk_ccp_cart
        FOREIGN KEY (CartId) REFERENCES Cart(CartId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- 3. SAMPLE DATA
-- Note: Password is saved as Bcrypt hash
-- Password for all admin: admin123
-- Password for all staff: staff123
-- Password for all user (customer): user123
-- =========================================================

-- 3.1 Admin
INSERT INTO Admin
(Id, Username, Password, Name, Age, PhoneNumber, Email, Gender, Address,
 IdentityCardNum, LastLogin, CreatedDate, LastUpdateDate, Status)
VALUES
(1, 'admin01', '$2b$12$MsSTnNBfpU/9FYQGnhANiuEfIujnli.og3efp1EVRu/acW/hAiSii', 'Nguyễn Quang Anh', 32, '0901000001', 'anh.nguyen@oss.vn', 'Nam',
 'Quận 1, TP. Hồ Chí Minh', '079123456001', '2024-06-01 09:10:00', '2023-01-01 08:00:00','2024-05-20 10:00:00','Active'),
(2, 'admin02', '$2b$12$MsSTnNBfpU/9FYQGnhANiuEfIujnli.og3efp1EVRu/acW/hAiSii', 'Trần Thị Bích', 30, '0901000002', 'bich.tran@oss.vn', 'Nữ',
 'Quận 3, TP. Hồ Chí Minh', '079123456002', '2024-06-02 09:15:00', '2023-01-05 08:00:00','2024-05-21 10:00:00','Active'),
(3, 'admin03', '$2b$12$MsSTnNBfpU/9FYQGnhANiuEfIujnli.og3efp1EVRu/acW/hAiSii', 'Lê Văn Cường', 35, '0901000003', 'cuong.le@oss.vn', 'Nam',
 'Quận Tân Bình, TP. Hồ Chí Minh', '079123456003', '2024-06-03 09:20:00', '2023-02-01 08:00:00','2024-05-22 10:00:00','Active'),
(4, 'admin04', '$2b$12$MsSTnNBfpU/9FYQGnhANiuEfIujnli.og3efp1EVRu/acW/hAiSii', 'Phạm Thị Dung', 29, '0901000004', 'dung.pham@oss.vn', 'Nữ',
 'Quận Bình Thạnh, TP. Hồ Chí Minh', '079123456004', '2024-06-04 09:25:00', '2023-02-10 08:00:00','2024-05-23 10:00:00','Active'),
(5, 'admin05', '$2b$12$MsSTnNBfpU/9FYQGnhANiuEfIujnli.og3efp1EVRu/acW/hAiSii', 'Đỗ Minh Đức', 33, '0901000005', 'duc.do@oss.vn', 'Nam',
 'Quận 7, TP. Hồ Chí Minh', '079123456005', '2024-06-05 09:30:00', '2023-03-01 08:00:00','2024-05-24 10:00:00','Active');

-- 3.2 StoreStaff
INSERT INTO StoreStaff
(Id, Username, Password, Name, Age, PhoneNumber, Email, Gender, Address,
 IdentityCardNum, LastLogin, CreatedDate, LastUpdateDate,
 Position, Department, HiredDate, Status, Salary, BankAccountNumber)
VALUES
(1, 'nv001', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Nguyễn Văn A', 24, '0912000001','a.nguyen@oss.vn','Nam',
 'Kho A, Quận 1, TP. HCM','079654321001','2024-06-01 08:00:00','2023-01-01 08:00:00','2024-05-20 10:00:00',
 'Nhân viên kho','Kho vận','2023-01-01','Active',9000000,'0123456789001'),
(2, 'nv002', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Trần Thị B', 25, '0912000002','b.tran@oss.vn','Nữ',
 'Kho B, Quận 3, TP. HCM','079654321002','2024-06-02 08:00:00','2023-01-05 08:00:00','2024-05-21 10:00:00',
 'Nhân viên bán hàng','Bán lẻ','2023-01-03','Active',10000000,'0123456789002'),
(3, 'nv003', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Lê Văn C', 27, '0912000003','c.le@oss.vn','Nam',
 'Kho C, Quận 5, TP. HCM','079654321003','2024-06-03 08:00:00','2023-02-01 08:00:00','2024-05-22 10:00:00',
 'Nhân viên kỹ thuật','Kỹ thuật','2023-02-01','Active',12000000,'0123456789003'),
(4, 'nv004', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Phạm Thị D', 26, '0912000004','d.pham@oss.vn','Nữ',
 'Quận 7, TP. HCM','079654321004','2024-06-04 08:00:00','2023-02-10 08:00:00','2024-05-23 10:00:00',
 'Nhân viên CSKH','Chăm sóc khách hàng','2023-02-05','Active',9500000,'0123456789004'),
(5, 'nv005', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Đỗ Văn E', 29, '0912000005','e.do@oss.vn','Nam',
 'Quận Tân Bình, TP. HCM','079654321005','2024-06-05 08:00:00','2023-03-01 08:00:00','2024-05-24 10:00:00',
 'Nhân viên giao hàng','Giao nhận','2023-03-01','Active',8000000,'0123456789005'),
(6, 'nv006', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Vũ Thị F', 23, '0912000006','f.vu@oss.vn','Nữ',
 'Quận Gò Vấp, TP. HCM','079654321006','2024-06-06 08:00:00','2023-03-05 08:00:00','2024-05-25 10:00:00',
 'Nhân viên bán hàng','Bán lẻ','2023-03-05','Active',9500000,'0123456789006'),
(7, 'nv007', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Ngô Văn G', 30, '0912000007','g.ngo@oss.vn','Nam',
 'Quận Bình Thạnh, TP. HCM','079654321007','2024-06-07 08:00:00','2023-03-10 08:00:00','2024-05-26 10:00:00',
 'Tổ trưởng kho','Kho vận','2023-03-10','Active',13000000,'0123456789007'),
(8, 'nv008', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Huỳnh Thị H', 22, '0912000008','h.huynh@oss.vn','Nữ',
 'TP. Thủ Đức, TP. HCM','079654321008','2024-06-08 08:00:00','2023-03-15 08:00:00','2024-05-27 10:00:00',
 'Nhân viên thu ngân','Bán lẻ','2023-03-15','Active',8500000,'0123456789008'),
(9, 'nv009', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Bùi Văn I', 28, '0912000009','i.bui@oss.vn','Nam',
 'Quận 10, TP. HCM','079654321009','2024-06-09 08:00:00','2023-04-01 08:00:00','2024-05-28 10:00:00',
 'Nhân viên kho','Kho vận','2023-04-01','Active',9000000,'0123456789009'),
(10, 'nv010', '$2b$12$hMBBIPS7Ja80C8lLKZ5x2ut3yjIyO1dh1ACLCab1wvJrWCz5Xs0vq', 'Phan Thị K', 27, '0912000010','k.phan@oss.vn','Nữ',
 'Quận 11, TP. HCM','079654321010','2024-06-10 08:00:00','2023-04-10 08:00:00','2024-05-29 10:00:00',
 'Nhân viên bán hàng','Bán lẻ','2023-04-10','Active',9500000,'0123456789010');

-- 3.3 SystemModificationActivities
INSERT INTO SystemModificationActivities
(ActivityId, ActivityName, ActivityType, Description)
VALUES
(1, 'Tạo tài khoản nhân viên', 'CREATE', 'Thêm nhân viên mới'),
(2, 'Khóa tài khoản nhân viên', 'DELETE', 'Khóa tài khoản do vi phạm'),
(3, 'Xuất báo cáo doanh thu', 'REPORT', 'Tạo báo cáo doanh thu theo tháng'),
(4, 'Xuất báo cáo kho', 'REPORT', 'Tạo báo cáo tồn kho'),
(5, 'Phân quyền tài khoản', 'UPDATE', 'Cập nhật quyền cho tài khoản'),
(6, 'Cấu hình hệ thống', 'UPDATE', 'Thay đổi cấu hình hệ thống'),
(7, 'Sao lưu dữ liệu', 'BACKUP', 'Thực hiện backup dữ liệu hàng ngày');

-- 3.4 AuditLog – gắn với Admin + Activity
INSERT INTO AuditLog
(LogId, AdminId, ActivityId, Status, TimeOfOccurrence)
VALUES
(1, 1, 1, 'SUCCESS','2024-06-01 09:10:00'),
(2, 1, 7,  'SUCCESS','2024-06-01 09:15:00'),
(3, 2, 3,  'SUCCESS','2024-06-02 10:00:00'),
(4, 3, 2,  'SUCCESS','2024-06-03 10:30:00'),
(5, 4, 4,  'SUCCESS','2024-06-04 11:00:00'),
(6, 4, 5,  'SUCCESS','2024-06-04 11:30:00'),
(7, 5, 6,  'SUCCESS','2024-06-05 14:00:00'),
(8, 1, 3, 'SUCCESS','2024-06-06 15:00:00'),
(9, 1, 2, 'SUCCESS','2024-06-07 16:00:00'),
(10,2, 1, 'SUCCESS','2024-06-08 17:00:00');

-- 3.5 Customer
INSERT INTO Customer
(Id, Username, Password, Name, Age, PhoneNumber, Email, Gender, Address,
 IdentityCardNum, LastLogin, CreatedDate, LastUpdateDate)
VALUES
(1,'kh001','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Nguyễn Minh An',22,'0938000001','an.nguyen@gmail.com','Nam',
 'Thủ Đức, TP. HCM','079111111001','2024-06-01 19:00:00','2023-09-01 10:00:00','2024-05-20 09:00:00'),
(2,'kh002','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Trần Thị Bình',24,'0938000002','binh.tran@gmail.com','Nữ',
 'Quận 1, TP. HCM','079111111002','2024-06-02 19:00:00','2023-09-05 10:00:00','2024-05-21 09:00:00'),
(3,'kh003','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Lê Quốc Cường',26,'0938000003','cuong.le@gmail.com','Nam',
 'Quận 3, TP. HCM','079111111003','2024-06-03 19:00:00','2023-09-10 10:00:00','2024-05-22 09:00:00'),
(4,'kh004','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Phạm Thị Diệu',23,'0938000004','dieu.pham@gmail.com','Nữ',
 'Quận 5, TP. HCM','079111111004','2024-06-04 19:00:00','2023-09-15 10:00:00','2024-05-23 09:00:00'),
(5,'kh005','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Đỗ Trung Dũng',28,'0938000005','dung.do@gmail.com','Nam',
 'Quận 7, TP. HCM','079111111005','2024-06-05 19:00:00','2023-10-01 10:00:00','2024-05-24 09:00:00'),
(6,'kh006','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Vũ Thùy Giang',21,'0938000006','giang.vu@gmail.com','Nữ',
 'Quận 10, TP. HCM','079111111006','2024-06-06 19:00:00','2023-10-05 10:00:00','2024-05-25 09:00:00'),
(7,'kh007','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Ngô Thanh Hải',29,'0938000007','hai.ngo@gmail.com','Nam',
 'Quận Bình Thạnh, TP. HCM','079111111007','2024-06-07 19:00:00','2023-10-10 10:00:00','2024-05-26 09:00:00'),
(8,'kh008','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Huỳnh Thu Hằng',25,'0938000008','hang.huynh@gmail.com','Nữ',
 'Quận Gò Vấp, TP. HCM','079111111008','2024-06-08 19:00:00','2023-10-15 10:00:00','2024-05-27 09:00:00'),
(9,'kh009','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Bùi Minh Hoàng',27,'0938000009','hoang.bui@gmail.com','Nam',
 'TP. Biên Hòa, Đồng Nai','079111111009','2024-06-09 19:00:00','2023-11-01 10:00:00','2024-05-28 09:00:00'),
(10,'kh010','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Phan Thị Hương',24,'0938000010','huong.phan@gmail.com','Nữ',
 'TP. Dĩ An, Bình Dương','079111111010','2024-06-10 19:00:00','2023-11-05 10:00:00','2024-05-29 09:00:00'),
(11,'kh011','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Nguyễn Quốc Khánh',30,'0938000011','khanh.nguyen@gmail.com','Nam',
 'TP. Thủ Dầu Một, Bình Dương','079111111011','2024-06-11 19:00:00','2023-11-10 10:00:00','2024-05-30 09:00:00'),
(12,'kh012','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Trần Thị Lan',23,'0938000012','lan.tran@gmail.com','Nữ',
 'TP. Vũng Tàu','079111111012','2024-06-12 19:00:00','2023-11-15 10:00:00','2024-05-31 09:00:00'),
(13,'kh013','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Lê Minh Long',28,'0938000013','long.le@gmail.com','Nam',
 'TP. Nha Trang','079111111013','2024-06-13 19:00:00','2023-12-01 10:00:00','2024-06-01 09:00:00'),
(14,'kh014','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Nguyễn Thị Mai',22,'0938000014','mai.nguyen@gmail.com','Nữ',
 'TP. Đà Nẵng','079111111014','2024-06-14 19:00:00','2023-12-05 10:00:00','2024-06-02 09:00:00'),
(15,'kh015','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Phạm Hữu Nam',31,'0938000015','nam.pham@gmail.com','Nam',
 'TP. Huế','079111111015','2024-06-15 19:00:00','2023-12-10 10:00:00','2024-06-03 09:00:00'),
(16,'kh016','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Trịnh Thị Ngọc',21,'0938000016','ngoc.trinh@gmail.com','Nữ',
 'TP. Hải Phòng','079111111016','2024-06-16 19:00:00','2024-01-01 10:00:00','2024-06-04 09:00:00'),
(17,'kh017','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Đặng Thanh Phong',27,'0938000017','phong.dang@gmail.com','Nam',
 'Quận Cầu Giấy, Hà Nội','079111111017','2024-06-17 19:00:00','2024-01-05 10:00:00','2024-06-05 09:00:00'),
(18,'kh018','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Hoàng Thị Quỳnh',24,'0938000018','quynh.hoang@gmail.com','Nữ',
 'Quận Hoàn Kiếm, Hà Nội','079111111018','2024-06-18 19:00:00','2024-01-10 10:00:00','2024-06-06 09:00:00'),
(19,'kh019','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Ngô Văn Sơn',29,'0938000019','son.ngo@gmail.com','Nam',
 'Quận Nam Từ Liêm, Hà Nội','079111111019','2024-06-19 19:00:00','2024-01-15 10:00:00','2024-06-07 09:00:00'),
(20,'kh020','$2b$12$Fm3QzCj/D4HNDrp3TT43mONOmcgqbyj/xhn66BsqgxcCAM0rexm2G','Vũ Thị Trang',22,'0938000020','trang.vu@gmail.com','Nữ',
 'Quận Bắc Từ Liêm, Hà Nội','079111111020','2024-06-20 19:00:00','2024-01-20 10:00:00','2024-06-08 09:00:00');

-- 3.6 Cart – mỗi khách 1 giỏ hàng
INSERT INTO Cart (CartId, CustomerId, LatestModifiedTime)
VALUES
(1,1,'2024-06-01 20:00:00'),
(2,2,'2024-06-02 20:00:00'),
(3,3,'2024-06-03 20:00:00'),
(4,4,'2024-06-04 20:00:00'),
(5,5,'2024-06-05 20:00:00'),
(6,6,'2024-06-06 20:00:00'),
(7,7,'2024-06-07 20:00:00'),
(8,8,'2024-06-08 20:00:00'),
(9,9,'2024-06-09 20:00:00'),
(10,10,'2024-06-10 20:00:00'),
(11,11,'2024-06-11 20:00:00'),
(12,12,'2024-06-12 20:00:00'),
(13,13,'2024-06-13 20:00:00'),
(14,14,'2024-06-14 20:00:00'),
(15,15,'2024-06-15 20:00:00'),
(16,16,'2024-06-16 20:00:00'),
(17,17,'2024-06-17 20:00:00'),
(18,18,'2024-06-18 20:00:00'),
(19,19,'2024-06-19 20:00:00'),
(20,20,'2024-06-20 20:00:00');

-- 3.7 Product
INSERT INTO Product
(ProductId, ProductName, Brand, Price, Color, Quantity, Specification, WarrantyPeriod, ReleaseDate, Status)
VALUES
('PH_SGA15_BLK','Samsung Galaxy A15 Phone','Samsung',4500000,'Black',100,'6.5-inch display, 6GB RAM, 128GB storage',24,'2024-01-10','Active'),
('PH_IP15_BLU','iPhone 15','Apple',23000000,'Blue',50,'A17 chip, 8GB RAM, 256GB storage',24,'2023-10-01','Active'),
('PH_XRN12_BLK','Xiaomi Redmi Note 12','Xiaomi',5500000,'Black',120,'6.7-inch AMOLED, 8GB RAM, 128GB storage',24,'2023-07-20','Active'),
('PH_SGS23_WHT','Samsung Galaxy S23','Samsung',21000000,'White',60,'6.1-inch AMOLED, 8GB RAM, 256GB',24,'2023-03-15','Active'),
('PH_OPR10_PUR','Oppo Reno 10','Oppo',9000000,'Purple',80,'6.4-inch display, 8GB RAM, 256GB',24,'2023-06-01','Active'),

('LP_ASVB15_SIL','Asus VivoBook 15 Laptop','Asus',16000000,'Silver',40,'Core i5, 16GB RAM, 512GB SSD, 15.6-inch',24,'2023-09-15','Active'),
('LP_DEIN14_BLK','Dell Inspiron 14 Laptop','Dell',19000000,'Black',35,'Core i7, 16GB RAM, 512GB SSD, 14-inch',24,'2023-08-20','Active'),
('LP_HPPV14_SIL','HP Pavilion 14 Laptop','HP',17000000,'Silver',30,'Core i5, 8GB RAM, 512GB SSD, 14-inch',24,'2023-02-12','Active'),
('LP_LEID3_GRY','Lenovo IdeaPad 3 Laptop','Lenovo',15000000,'Gray',50,'Ryzen 5, 8GB RAM, 512GB SSD, 15.6-inch',24,'2023-04-05','Active'),
('LP_MBAM2_SIL','MacBook Air M2','Apple',28000000,'Silver',25,'Apple M2 chip, 8GB RAM, 256GB SSD, 13-inch',24,'2023-07-10','Active'),

('TV_LG43_4K','LG 43-inch 4K Smart TV','LG',9000000,'Black',40,'4K UHD, WebOS, HDR10',24,'2023-05-01','Active'),
('TV_SA55_4K','Samsung 55-inch 4K Crystal TV','Samsung',12000000,'Black',30,'4K UHD, Crystal Processor, HDR10+',24,'2023-03-11','Active'),
('TV_SO50_4K','Sony Bravia 50-inch 4K TV','Sony',15000000,'Black',20,'4K HDR Processor X1, Android TV',24,'2023-02-22','Active'),
('TV_TC40_FHD','TCL 40-inch Android TV','TCL',6000000,'Black',35,'Full HD, Android TV, HDR',12,'2023-06-15','Active'),
('TV_PA65_4K','Panasonic 65-inch 4K TV','Panasonic',17000000,'Black',15,'4K UHD, Dolby Vision, SmartOS',24,'2023-09-30','Active'),

('PH_SGA54_WHT','Samsung Galaxy A54 Phone','Samsung',9000000,'White',90,'6.4-inch AMOLED, 8GB RAM, 256GB',24,'2023-05-20','Active'),
('PH_IP14_BLK','iPhone 14','Apple',19000000,'Black',70,'A15 chip, 6GB RAM, 128GB storage',24,'2022-10-01','Deactivated'),
('PH_XM11L_BLU','Xiaomi Mi 11 Lite','Xiaomi',7500000,'Blue',100,'6.55-inch AMOLED, 8GB RAM, 128GB',24,'2023-01-01','Active'),
('LP_ACA7_BLK','Acer Aspire 7 Laptop','Acer',20000000,'Black',22,'Core i7, 16GB RAM, 1TB SSD, 15.6-inch',24,'2023-08-11','Active'),
('TV_SO75_4K','Sony Bravia 75-inch 4K TV','Sony',30000000,'Black',10,'4K HDR, Android TV, XR Upscaling',24,'2023-09-05','Active');


-- 3.8 Order
INSERT INTO `Order`
(OrderId, CustomerId, CartId, IntendedShipmentDate, OrderDate,
 RecipientName, RecipientContact, ShipmentAddress, Status)
VALUES
(1,1,1,'2024-06-03','2024-06-01',
 'Nguyễn Văn A', 'Phone: 0901 111 111\nEmail: nguyenvana@example.com',
 'Thủ Đức, TP. HCM', 'Processing'),

(2,2,2,'2024-06-04','2024-06-02',
 'Trần Thị B', 'Phone: 0902 222 222\nEmail: tranthib@example.com',
 'Quận 1, TP. HCM', 'Delivered'),

(3,3,3,'2024-06-05','2024-06-03',
 'Lê Minh C', 'Phone: 0903 333 333\nEmail: leminhc@example.com',
 'Quận 3, TP. HCM', 'Processing'),

(4,4,4,'2024-06-06','2024-06-04',
 'Phạm Thu D', 'Phone: 0904 444 444\nEmail: phamthud@example.com',
 'Quận 5, TP. HCM', 'Delivered'),

(5,5,5,'2024-06-07','2024-06-05',
 'Hoàng Văn E', 'Phone: 0905 555 555\nEmail: hoangvane@example.com',
 'Quận 7, TP. HCM', 'Cancelled'),

(6,6,6,'2024-06-08','2024-06-06',
 'Đặng Thị F', 'Phone: 0906 666 666\nEmail: dangthif@example.com',
 'Quận 10, TP. HCM', 'Processing'),

(7,7,7,'2024-06-09','2024-06-07',
 'Võ Minh G', 'Phone: 0907 777 777\nEmail: vominhg@example.com',
 'Quận Bình Thạnh, TP. HCM', 'Delivered'),

(8,8,8,'2024-06-10','2024-06-08',
 'Huỳnh Mỹ H', 'Phone: 0908 888 888\nEmail: huynhmyh@example.com',
 'Quận Gò Vấp, TP. HCM', 'Processing'),

(9,9,9,'2024-06-11','2024-06-09',
 'Ngô Nhật I', 'Phone: 0909 999 999\nEmail: ngonhati@example.com',
 'TP. Biên Hòa, Đồng Nai', 'Processing'),

(10,10,10,'2024-06-12','2024-06-10',
 'Mai Quốc K', 'Phone: 0910 101 010\nEmail: maiquock@example.com',
 'TP. Dĩ An, Bình Dương', 'Delivered'),

(11,11,11,'2024-06-13','2024-06-11',
 'Bùi Thị L', 'Phone: 0911 111 112\nEmail: buithil@example.com',
 'TP. Thủ Dầu Một, Bình Dương', 'Processing'),

(12,12,12,'2024-06-14','2024-06-12',
 'Đỗ Trung M', 'Phone: 0912 121 212\nEmail: dotrungm@example.com',
 'TP. Vũng Tàu', 'Delivered'),

(13,13,13,'2024-06-15','2024-06-13',
 'Hà Mỹ N', 'Phone: 0913 131 313\nEmail: hamyn@example.com',
 'TP. Nha Trang', 'Processing'),

(14,14,14,'2024-06-16','2024-06-14',
 'Lương Văn O', 'Phone: 0914 141 414\nEmail: luongvano@example.com',
 'TP. Đà Nẵng', 'Processing'),

(15,15,15,'2024-06-17','2024-06-15',
 'Nguyễn Khánh P', 'Phone: 0915 151 515\nEmail: nguyenkhanhp@example.com',
 'TP. Huế', 'Delivered'),

(16,16,16,'2024-06-18','2024-06-16',
 'Phan Quốc Q', 'Phone: 0916 161 616\nEmail: phanquocq@example.com',
 'TP. Hải Phòng', 'Processing'),

(17,17,17,'2024-06-19','2024-06-17',
 'Lê Thị R', 'Phone: 0917 171 717\nEmail: lethir@example.com',
 'Quận Cầu Giấy, Hà Nội', 'Delivered'),

(18,18,18,'2024-06-20','2024-06-18',
 'Vũ Hoàng S', 'Phone: 0918 181 818\nEmail: vuhoangs@example.com',
 'Quận Hoàn Kiếm, Hà Nội', 'Processing'),

(19,19,19,'2024-06-21','2024-06-19',
 'Trịnh Mỹ T', 'Phone: 0919 191 919\nEmail: trinhmyt@example.com',
 'Quận Nam Từ Liêm, Hà Nội', 'Delivered'),

(20,20,20,'2024-06-22','2024-06-20',
 'Đào Thanh U', 'Phone: 0920 202 020\nEmail: daothanhu@example.com',
 'Quận Bắc Từ Liêm, Hà Nội', 'Processing');


-- 3.9 OrderContainsProduct – mỗi dòng: 1 đơn + 1 sản phẩm
INSERT INTO OrderContainsProduct (OrderId, ProductId, Quantity)
VALUES
(1,'PH_SGA15_BLK',1),
(2,'PH_IP15_BLU',1),
(3,'PH_XRN12_BLK',1),
(4,'PH_SGS23_WHT',1),
(5,'PH_OPR10_PUR',2),
(6,'LP_ASVB15_SIL',1),
(7,'LP_DEIN14_BLK',1),
(8,'LP_HPPV14_SIL',1),
(9,'LP_LEID3_GRY',2),
(10,'LP_MBAM2_SIL',1),
(11,'TV_LG43_4K',1),
(12,'TV_SA55_4K',1),
(13,'TV_SO50_4K',1),
(14,'TV_TC40_FHD',1),
(15,'TV_PA65_4K',1),
(16,'PH_SGA54_WHT',1),
(17,'PH_IP14_BLK',2),
(18,'PH_XM11L_BLU',1),
(19,'LP_ACA7_BLK',1),
(20,'TV_SO75_4K',3);

-- 3.10 CartContainsProduct
INSERT INTO CartContainsProduct (ProductId, CustomerId, CartId, Quantity)
VALUES
('PH_SGA15_BLK',1,1,1),
('PH_IP15_BLU',2,2,1),
('PH_XRN12_BLK',3,3,1),
('PH_SGS23_WHT',4,4,1),
('PH_OPR10_PUR',5,5,2),
('LP_ASVB15_SIL',6,6,1),
('LP_DEIN14_BLK',7,7,1),
('LP_HPPV14_SIL',8,8,1),
('LP_LEID3_GRY',9,9,2),
('LP_MBAM2_SIL',10,10,1),
('TV_LG43_4K',11,11,1),
('TV_SA55_4K',12,12,1),
('TV_SO50_4K',13,13,1),
('TV_TC40_FHD',14,14,1),
('TV_PA65_4K',15,15,1),
('PH_SGA54_WHT',16,16,1),
('PH_IP14_BLK',17,17,2),
('PH_XM11L_BLU',18,18,1),
('LP_ACA7_BLK',19,19,1),
('TV_SO75_4K',20,20,3);

