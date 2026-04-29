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


    const image = req.file ? req.file.path : null; // Cloudinary URL


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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Product.countDocuments();
      const products = await Product.find()
        .populate("category_id")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
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
      const { name, price, category_id, description } = req.body;

      const image = req.file ? req.file.path : undefined; // Cloudinary URL

      const updateData = { name, price, category_id, description };
      if (image) updateData.image = image;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
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