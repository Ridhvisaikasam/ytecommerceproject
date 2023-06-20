const express=require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router=express.Router();

router.route("/admin/product/new")
.post(isAuthenticatedUser,authorizeRole("admin"),createProduct); //C

router.route("/products")
.get(getAllProducts); //R

router.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)

router.route("/product/:id")
.get(getProductDetails); //UDR

router.route("/review")
.put(isAuthenticatedUser,createProductReview);

router.route("/reviews")
.get(getProductReviews)
.delete(deleteReview);


module.exports = router 