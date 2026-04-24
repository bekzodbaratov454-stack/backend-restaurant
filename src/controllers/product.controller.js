import { Product } from "../models/product.model.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { ConflictException } from "../exceptions/conflict.exception.js";

class ProductController {

createProduct = async (req, res, next) => {
  try {
    const { name, price, category_id, description } = req.body;

    const existing = await Product.findOne({
      name,
      user_id: req.user.id,
    });
    

    if (existing) {
      throw new ConflictException("Product already exists");
    }


    const image = req.file ? req.file.filename : null; // opt


    const product = await Product.create({
      name,
      price,
      category_id,
      user_id: req.user.id,
      image,
      description: description || "",
    });

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (error) {
    next(error);
  }
};






  getProducts = async (req, res, next) => {
    try {
      const products = await Product.find().populate("category_id");

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };





  getProductById = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate("category_id");

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };






  updateProduct = async (req, res, next) => {
    try {
      const { name, price, category_id } = req.body;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, category_id },
        { new: true }
      );

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };






  deleteProduct = async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        throw new NotFoundException("Product not found");
      }

      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  };


}



export default new ProductController();