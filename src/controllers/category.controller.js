import { ConflictException } from "../exceptions/conflict.exception.js";

import { NotFoundException } from "../exceptions/not-found.exception.js";

class CategoryController {
  #_categoryModel;

  constructor(categoryModel) {
    this.#_categoryModel = categoryModel;
  }




  createCategory = async (req, res, next) => {
    try {
      const { name } = req.body;


      const existing = await this.#_categoryModel.findOne({
        name,
        user_id: req.user.id
      });

      if (existing) {
        throw new ConflictException("Category already exists");
      }


      const category = await this.#_categoryModel.create({
        name,
        user_id: req.user.id
      });

      res.status(201).json({
        success: true,
        data: category
      });

    } catch (error) {
      next(error);
    }
  };







  getCategories = async (req, res, next) => {
    try {
      const categories = await this.#_categoryModel.find();

      res.status(200).json({
        success: true,
        data: categories
      });

    } catch (error) {
      next(error);
    }
  };






  deleteCategory = async (req, res, next) => {
    try {
      const category = await this.#_categoryModel.findByIdAndDelete(req.params.id);

      if (!category) {
        throw new NotFoundException("Category not found");
      }

      res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  };




  getCategoryById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await this.#_categoryModel.findById(id);

      if (!category) {
        return res.status(404).json({
          message: "Category not found"
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });

    } catch (error) {
      next(error);
    }
  };
  
}



export default CategoryController;






