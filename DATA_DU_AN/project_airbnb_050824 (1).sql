-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2024 at 06:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_airbnb_050824`
--

-- --------------------------------------------------------

--
-- Table structure for table `binhluan`
--

CREATE TABLE `binhluan` (
  `id` int(11) NOT NULL,
  `maPhong` int(11) NOT NULL,
  `maNguoiBinhLuan` int(11) NOT NULL,
  `ngayBinhLuan` varchar(255) DEFAULT NULL,
  `noiDung` varchar(255) DEFAULT NULL,
  `saoBinhLuan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `binhluan`
--

INSERT INTO `binhluan` (`id`, `maPhong`, `maNguoiBinhLuan`, `ngayBinhLuan`, `noiDung`, `saoBinhLuan`) VALUES
(5, 5, 5, '2023-08-05', 'xin chao', 4),
(6, 6, 6, '2023-08-06', 'Luxurious stay with beautiful views.', 5),
(7, 7, 7, '2023-08-07', 'Modern and well-equipped.', 4),
(9, 9, 9, '2023-08-09', 'Charming and well-maintained.', 4),
(11, 3, 2, '2023-08-03', 'spacious', 3),
(12, 5, 5, '2023-08-05', 'xin chao', 3),
(13, 5, 5, '2023-08-05', 'xin chao', 3);

-- --------------------------------------------------------

--
-- Table structure for table `datphong`
--

CREATE TABLE `datphong` (
  `id` int(11) NOT NULL,
  `maPhong` int(11) NOT NULL,
  `ngayDen` datetime DEFAULT NULL,
  `ngayDi` datetime DEFAULT NULL,
  `soLuongKhach` int(11) DEFAULT NULL,
  `maNguoiDung` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `datphong`
--

INSERT INTO `datphong` (`id`, `maPhong`, `ngayDen`, `ngayDi`, `soLuongKhach`, `maNguoiDung`) VALUES
(4, 5, '2024-08-13 06:00:00', '2024-09-20 06:00:00', 5, 5),
(5, 5, '2024-08-14 14:00:00', '2024-08-19 12:00:00', 2, 5),
(6, 6, '2024-08-15 14:00:00', '2024-08-20 12:00:00', 2, 6),
(7, 7, '2024-08-16 14:00:00', '2024-08-21 12:00:00', 1, 7),
(9, 9, '2024-08-18 14:00:00', '2024-08-23 12:00:00', 1, 9),
(13, 4, '2024-08-13 15:51:45', '2024-08-13 15:51:45', 10, 2),
(14, 4, '2024-08-13 15:51:45', '2024-08-13 15:51:45', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pass_word` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `birth_day` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`id`, `name`, `email`, `pass_word`, `phone`, `birth_day`, `gender`, `role`) VALUES
(2, 'Minh Thanh', 'jane.smith@example.com', 'password123', '123456789', '1990-01-01', 'gay', 'user'),
(3, 'Alice Johnson', 'alice.johnson@example.com', 'password123', '3456789012', '1985-03-03', 'Female', 'user'),
(4, 'Bob Brown', 'bob.brown@example.com', 'password123', '4567890123', '1988-04-04', 'Male', 'user'),
(5, 'Charlie Davis', 'charlie.davis@example.com', 'password123', '5678901234', '1991-05-05', 'Male', 'user'),
(6, 'Eve White', 'eve.white@example.com', 'password123', '6789012345', '1989-06-06', 'Female', 'user'),
(7, 'Frank Black', 'frank.black@example.com', 'password123', '7890123456', '1993-07-07', 'Male', 'user'),
(9, 'Hank Blue', 'hank.blue@example.com', 'password123', '9012345678', '1994-09-09', 'Male', 'user'),
(21, 'minh TN AH', 'trmtan1@gmail.com', '$2b$10$qb/78MPLr5/ck.jF9SbKfu.wDbJWyI3Zir5EOU2.6ufsTg1FjgU6K', '123456789', '1990-01-01', 'gay', 'user'),
(26, 'Minh Thanh', 'trmthanh220895@gmail.com', '$2b$10$Zyla8KZ1fko/xXHqKc8rl.rX8dwjn9.SdKA2sEEIx5LcOyizK/xuK', '159753', '1990-01-01', 'bede', 'admin'),
(27, 'name', 'email@gmail.com', '$2b$10$yuNvjswsE7AEz6yXpxsLq.0k51VykXgBNWMEKuUYJ6OU6xcmGuJ2e', 'phone', 'birth_day', 'male', 'user'),
(31, 'Tran Minh Thanh', 'trmthanhpro@gmail.com', '$2b$10$6uU4jZbephVtN4k9JF0Ci.pBULXupXrl54j5J4MRf9leC2xzI1P8y', '123456789', '1989-06-06', 'male', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `phong`
--

CREATE TABLE `phong` (
  `id` int(11) NOT NULL,
  `tenPhong` varchar(255) DEFAULT NULL,
  `khach` int(11) NOT NULL,
  `phongNgu` int(11) DEFAULT NULL,
  `giuong` int(11) DEFAULT NULL,
  `phongTam` int(11) DEFAULT NULL,
  `moTa` varchar(255) DEFAULT NULL,
  `giaTien` int(11) DEFAULT NULL,
  `mayGiat` tinyint(1) DEFAULT 0,
  `banLa` tinyint(1) DEFAULT 0,
  `tivi` tinyint(1) DEFAULT 0,
  `dieuHoa` tinyint(1) DEFAULT 0,
  `wifi` tinyint(1) DEFAULT 0,
  `bep` tinyint(1) DEFAULT 0,
  `doXe` tinyint(1) DEFAULT 0,
  `hoBoi` tinyint(1) DEFAULT 0,
  `banUi` tinyint(1) DEFAULT 0,
  `maViTri` int(11) NOT NULL,
  `hinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phong`
--

INSERT INTO `phong` (`id`, `tenPhong`, `khach`, `phongNgu`, `giuong`, `phongTam`, `moTa`, `giaTien`, `mayGiat`, `banLa`, `tivi`, `dieuHoa`, `wifi`, `bep`, `doXe`, `hoBoi`, `banUi`, `maViTri`, `hinhAnh`) VALUES
(3, 'Master Room 11', 2, 3, 3, 3, 'Nhà đẹp 2', 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 'https://drive.google.com/thumbnail?id=1lwCRm2a0vTg7v_I7Vpjoi5_dDm4htdoy'),
(4, 'Single Room updated 2', 4, 1, 1, 1, 'Ky niem nguoi găp nhau', 1000000, 0, 0, 1, 1, 1, 0, 0, 0, 0, 4, 'https://drive.google.com/thumbnail?id=1dUa6TfZP6Uch6OVmFFRDj1lKfiBjsx6I'),
(5, 'Double Room', 5, 1, 1, 1, 'A room with two beds', 1200000, 0, 1, 1, 1, 1, 0, 1, 0, 1, 5, 'double_room.jpg'),
(6, 'Penthouse Suite', 6, 2, 1, 1, 'A luxurious penthouse with panoramic views', 5000000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 'penthouse_suite.jpg'),
(7, 'Studio Apartment', 7, 1, 1, 1, 'A modern studio apartment', 1800000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 'studio_apartment.jpg'),
(9, 'Cottage', 9, 1, 1, 1, 'A charming cottage', 2200000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 'cottage.jpg'),
(60, 'Master Room 2', 2, 3, 3, 3, 'Nhà đẹp', 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 'https://drive.google.com/thumbnail?id=1EZjKa05nQfacqb9EjEGr_q6BM5tJz6gU');

-- --------------------------------------------------------

--
-- Table structure for table `vitri`
--

CREATE TABLE `vitri` (
  `id` int(11) NOT NULL,
  `tenViTri` varchar(255) DEFAULT NULL,
  `tinhThanh` varchar(255) DEFAULT NULL,
  `quocGia` varchar(255) DEFAULT NULL,
  `hinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vitri`
--

INSERT INTO `vitri` (`id`, `tenViTri`, `tinhThanh`, `quocGia`, `hinhAnh`) VALUES
(3, 'tenViTri 3', 'Sa Pa', 'Vietnam', 'https://drive.google.com/thumbnail?id=1BbCCXO9JCuMzsUXTCCVM7aQVEwE_OvUK'),
(4, 'Riverside updated', 'tinhThanh', 'quocGia', 'https://drive.google.com/thumbnail?id=10L-QRjaj3WEPnDgWCndJg0gDtY_Kq99s'),
(5, 'Old Quarter updated 1', 'Hanoi  updated', 'Vietnam updated', 'https://drive.google.com/thumbnail?id=1dmuth6Kh_UREEbMfycLpxzXVwtFcQE0m'),
(6, 'Countryside', 'Mai Chau', 'Vietnam', 'countryside.jpg'),
(7, 'Island Paradise', 'Phu Quoc', 'Vietnam', 'island_paradise.jpg'),
(8, 'Historic District', 'Hue', 'Vietnam', 'historic_district.jpg'),
(9, 'Beach Resort', 'Nha Trang', 'Vietnam', 'beach_resort.jpg'),
(10, 'Lakeside', 'Da Lat', 'Vietnam', 'lakeside.jpg'),
(23, 'tenViTri 324', 'tinhThanh 2', 'quocGia 2', 'https://drive.google.com/thumbnail?id=1CmJ-wdawjeyBFHDnQJlsIb0In5yH3NlN'),
(24, 'tenVirwerw', 'tinhThanh 2', 'quocGia 2', 'https://drive.google.com/thumbnail?id=1SKDZIwz9hhS55bv0omezj6wpcOGoPUDz'),
(25, 'tenVirwe4455', 'tinhThanh 2', 'quocGia 2', 'https://drive.google.com/thumbnail?id=1OpKxhBfwM_vSYdt3PYQhldZUOSRlSzoz');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `binhluan`
--
ALTER TABLE `binhluan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maPhong` (`maPhong`),
  ADD KEY `maNguoiBinhLuan` (`maNguoiBinhLuan`);

--
-- Indexes for table `datphong`
--
ALTER TABLE `datphong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maPhong` (`maPhong`),
  ADD KEY `maNguoiDung` (`maNguoiDung`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `khach` (`khach`),
  ADD KEY `maViTri` (`maViTri`);

--
-- Indexes for table `vitri`
--
ALTER TABLE `vitri`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `binhluan`
--
ALTER TABLE `binhluan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `datphong`
--
ALTER TABLE `datphong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `phong`
--
ALTER TABLE `phong`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `vitri`
--
ALTER TABLE `vitri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `binhluan`
--
ALTER TABLE `binhluan`
  ADD CONSTRAINT `binhluan_ibfk_1` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `binhluan_ibfk_2` FOREIGN KEY (`maNguoiBinhLuan`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `datphong`
--
ALTER TABLE `datphong`
  ADD CONSTRAINT `datphong_ibfk_1` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `datphong_ibfk_2` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`khach`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `phong_ibfk_2` FOREIGN KEY (`maViTri`) REFERENCES `vitri` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
