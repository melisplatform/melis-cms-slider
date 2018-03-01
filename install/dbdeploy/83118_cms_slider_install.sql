-- -----------------------------------------------------
-- Table `melis_cms_slider`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `melis_cms_slider` (
  `mcslide_id` INT NOT NULL AUTO_INCREMENT,
  `mcslide_name` VARCHAR(255) NOT NULL,
  `mcslide_page_id` INT NULL,
  `mcslide_date` DATETIME NULL,
  PRIMARY KEY (`mcslide_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `melis_cms_slider_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `melis_cms_slider_details` (
  `mcsdetail_id` INT NOT NULL AUTO_INCREMENT,
  `mcsdetail_mcslider_id` INT NOT NULL,
  `mcsdetail_status` TINYINT NOT NULL,
  `mcsdetail_title` VARCHAR(255) NULL,
  `mcsdetail_sub1` VARCHAR(255) NULL,
  `mcsdetail_sub2` VARCHAR(255) NULL,
  `mcsdetail_sub3` VARCHAR(255) NULL,
  `mcsdetail_link` LONGTEXT NULL,
  `mcsdetail_img` LONGTEXT NULL,
  `mcsdetail_order` INT NOT NULL,
  PRIMARY KEY (`mcsdetail_id`),
  INDEX `fk_melis_cms_slider_details_melis_cms_slider_idx` (`mcsdetail_mcslider_id` ASC))
ENGINE = InnoDB;

