import { Rating } from "../models/rating.model.js";
import { Product } from "../models/product.model.js";
import { BadRequestException } from "../exceptions/bad-request.exception.js";

class RatingController {

  // POST /ratings — reyting qo'yish yoki yangilash
  rateProduct = async (req, res, next) => {
    try {
      const { product_id, score, device_id } = req.body;

      if (!product_id || !score || !device_id) {
        throw new BadRequestException("product_id, score va device_id kerak");
      }
      if (score < 1 || score > 5) {
        throw new BadRequestException("Reyting 1 dan 5 gacha bo'lishi kerak");
      }

      // Upsert — mavjud bo'lsa yangilaydi, yo'q bo'lsa yaratadi
      await Rating.findOneAndUpdate(
        { product_id, device_id },
        { score },
        { upsert: true, new: true }
      );

      // Yangilangan o'rtacha reytingni qaytarish
      const stats = await Rating.aggregate([
        { $match: { product_id: new (await import("mongoose")).default.Types.ObjectId(product_id) } },
        { $group: { _id: "$product_id", avg: { $avg: "$score" }, count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          avg: stats[0] ? Math.round(stats[0].avg * 10) / 10 : score,
          count: stats[0] ? stats[0].count : 1,
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /ratings/stats — admin uchun barcha mahsulotlar reytingi
  getStats = async (req, res, next) => {
    try {
      const stats = await Rating.aggregate([
        {
          $group: {
            _id: "$product_id",
            avg: { $avg: "$score" },
            count: { $sum: 1 },
          }
        },
        { $sort: { avg: -1 } },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 1,
            avg: { $round: ["$avg", 1] },
            count: 1,
            name: "$product.name",
            image: "$product.image",
          }
        }
      ]);

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  // GET /ratings/product/:id — bitta mahsulot reytingi (public)
  getProductRating = async (req, res, next) => {
    try {
      const stats = await Rating.aggregate([
        { $match: { product_id: new (await import("mongoose")).default.Types.ObjectId(req.params.id) } },
        { $group: { _id: "$product_id", avg: { $avg: "$score" }, count: { $sum: 1 } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          avg: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
          count: stats[0] ? stats[0].count : 0,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new RatingController();
